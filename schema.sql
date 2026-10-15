
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Racer'
    check (char_length(username) between 1 and 20),
  avatar text not null default 'car-front'
    check (avatar in ('car-front','trophy','zap','shield','rocket','star')),
  avatar_color text not null default '#d8838a'
    check (avatar_color in ('#d8838a','#62e6a7','#ffc857','#58a6c7','#b18cff','#ff426d')),
  collision_count integer not null default 0 check (collision_count >= 0),
  coins bigint not null default 0 check (coins >= 0),
  rubies bigint not null default 0 check (rubies >= 0),
  best_score integer not null default 0 check (best_score >= 0),
  owned jsonb not null default '["blue"]'::jsonb,
  selected text not null default 'blue',
  upgrades jsonb not null default '{}'::jsonb,
  tuning jsonb not null default '{}'::jsonb,
  owned_paints jsonb not null default '[]'::jsonb,
  owned_cosmetics jsonb not null default '[]'::jsonb,
  xp integer not null default 0 check (xp >= 0),
  player_level integer not null default 1 check (player_level >= 1),
  coin_multiplier numeric not null default 1 check (coin_multiplier >= 1),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists owned_paints jsonb not null default '[]'::jsonb;
alter table public.profiles
  add column if not exists owned_cosmetics jsonb not null default '[]'::jsonb;
alter table public.profiles
  add column if not exists xp integer not null default 0;
alter table public.profiles
  add column if not exists player_level integer not null default 1;
alter table public.profiles
  add column if not exists coin_multiplier numeric not null default 1;
alter table public.profiles
  add column if not exists rubies bigint not null default 0;
alter table public.profiles
  add column if not exists avatar text not null default 'car-front'
    check (avatar in ('car-front','trophy','zap','shield','rocket','star'));
alter table public.profiles
  add column if not exists avatar_color text not null default '#d8838a'
    check (avatar_color in ('#d8838a','#62e6a7','#ffc857','#58a6c7','#b18cff','#ff426d'));
alter table public.profiles
  add column if not exists collision_count integer not null default 0
    check (collision_count >= 0);

create table if not exists public.game_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer,
  coins integer,
  constraint valid_run_score check (score is null or score >= 0),
  constraint valid_run_coins check (coins is null or coins >= 0)
);

create index if not exists leaderboard_score_idx
  on public.profiles (best_score desc);

create index if not exists game_runs_user_idx
  on public.game_runs (user_id, started_at desc);

alter table public.profiles enable row level security;
alter table public.game_runs enable row level security;

-- De frontend mag niet rechtstreeks munten, scores of garagegegevens wijzigen.
revoke all on public.profiles from anon, authenticated;
revoke all on public.game_runs from anon, authenticated;

grant select on public.profiles to authenticated;

drop policy if exists "Read public leaderboard" on public.profiles;
create policy "Read public leaderboard"
  on public.profiles for select to authenticated
  using (true);

-- Nieuwe accounts krijgen automatisch een profiel.
create or replace function public.create_player_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_name text;
create or replace function public.update_my_profile(
  p_username text,
  p_avatar text,
  p_avatar_color text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if nullif(btrim(p_username), '') is null or char_length(btrim(p_username)) > 20
      or p_avatar not in ('car-front','trophy','zap','shield','rocket','star')
      or p_avatar_color not in ('#d8838a','#62e6a7','#ffc857','#58a6c7','#b18cff','#ff426d') then
    raise exception 'Invalid profile';
  end if;

  update public.profiles
  set username = btrim(p_username), avatar = p_avatar, avatar_color = p_avatar_color
  where id = auth.uid();

  if not found then raise exception 'Profile not found'; end if;
end;
$$;
  chosen_name := coalesce(
    nullif(left(trim(new.raw_user_meta_data ->> 'username'), 20), ''),
    'Racer'
  );

  insert into public.profiles (id, username)
  values (new.id, chosen_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_player_profile();

-- Herstel profielen voor accounts die al bestonden voordat de trigger actief was.
insert into public.profiles (id, username)
select
  id,
  coalesce(
    nullif(left(trim(raw_user_meta_data ->> 'username'), 20), ''),
    'Racer'
  )
from auth.users
on conflict (id) do nothing;

-- Aankoop en aftrek gebeuren binnen één databasetransactie.
create or replace function public.buy_car(
  p_user_id uuid,
  p_car_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_coins bigint;
  owned_cars jsonb;
create or replace function public.buy_my_paint(
  p_paint_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  perform public.buy_paint(auth.uid(), p_paint_id, p_price);
end;
$$;

create or replace function public.buy_my_ruby_paint(
  p_paint_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  perform public.buy_ruby_paint(auth.uid(), p_paint_id, p_price);
end;
$$;
  if p_car_id not in (
    'marmalade','bloom','violet','bluebolt','ivory','sheriff',
    'car8','car9','car10','car11','car12','car13','car14',
    'car15','car16','car17','car20'
  ) then
    raise exception 'Invalid car';
  end if;

  if p_price < 0 then raise exception 'Invalid price'; end if;

  select coins, owned into current_coins, owned_cars
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if owned_cars @> jsonb_build_array(p_car_id) then
    raise exception 'Already owned';
  end if;
  if current_coins < p_price then raise exception 'Insufficient coins'; end if;

  update public.profiles
  set coins = coins - p_price,
      owned = owned || jsonb_build_array(p_car_id),
      selected = p_car_id
  where id = p_user_id;
end;
$$;

create or replace function public.buy_paint(
  p_user_id uuid,
  p_paint_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_coins bigint;
  unlocked_paints jsonb;
  expected_price integer;
create or replace function public.save_my_tuning(
  p_car_id text,
  p_tuning jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  perform public.save_tuning(auth.uid(), p_car_id, p_tuning);
end;
$$;
  revoke all on function public.update_my_profile(text,text,text) from public, anon, authenticated;
  revoke all on function public.buy_my_paint(text,integer) from public, anon, authenticated;
  revoke all on function public.buy_my_ruby_paint(text,integer) from public, anon, authenticated;
  revoke all on function public.save_my_tuning(text,jsonb) from public, anon, authenticated;
  grant execute on function public.update_my_profile(text,text,text) to authenticated;
  grant execute on function public.buy_my_paint(text,integer) to authenticated;
  grant execute on function public.buy_my_ruby_paint(text,integer) to authenticated;
  grant execute on function public.save_my_tuning(text,jsonb) to authenticated;
  expected_price := case p_paint_id
    when 'honey' then 150
    when 'terracotta' then 250
    when 'moss' then 300
    when 'heather' then 400
    when 'pearl' then 500
    when 'copper' then 600
    when 'rose' then 750
    when 'sky' then 850
    when 'plum' then 950
    when 'slate' then 1100
    when 'cream' then 1250
    when 'forest' then 1450
    else null
  end;
  if p_paint_id ~ '^#[0-9A-Fa-f]{6}$' then expected_price := 250; end if;

  if expected_price is null or p_price <> expected_price then
    raise exception 'Invalid paint or price';
  end if;

  select coins, owned_paints into current_coins, unlocked_paints
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if unlocked_paints @> jsonb_build_array(p_paint_id) then
    raise exception 'Paint already owned';
  end if;
  if current_coins < expected_price then raise exception 'Insufficient coins'; end if;

  update public.profiles
  set coins = coins - expected_price,
      owned_paints = owned_paints || jsonb_build_array(p_paint_id)
  where id = p_user_id;
end;
$$;

create or replace function public.buy_cosmetic(
  p_user_id uuid,
  p_cosmetic_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_coins bigint;
  unlocked_cosmetics jsonb;
  expected_price integer;
begin
  expected_price := case p_cosmetic_id
    when 'wrap-stripes' then 350
    when 'wrap-flames' then 500
    when 'wrap-checker' then 450
    when 'wrap-side' then 300
    when 'wrap-camo' then 650
    when 'wrap-woodgrain' then 700
    when 'wrap-pinstripe' then 400
    when 'wrap-stars' then 550
    when 'rim-cream' then 200
    when 'rim-copper' then 250
    when 'rim-brick' then 300
    when 'rim-sage' then 300
    when 'rim-slate' then 350
    when 'rim-gold' then 400
    when 'rim-pearl' then 450
    when 'spoiler-ducktail' then 450
    when 'spoiler-wing' then 600
    when 'spoiler-tall' then 900
    when 'spoiler-vintage' then 350
    else null
  end;

  if expected_price is null or p_price <> expected_price then
    raise exception 'Invalid cosmetic or price';
  end if;

  select coins, owned_cosmetics into current_coins, unlocked_cosmetics
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if unlocked_cosmetics @> jsonb_build_array(p_cosmetic_id) then
    raise exception 'Cosmetic already owned';
  end if;
  if current_coins < expected_price then raise exception 'Insufficient coins'; end if;

  update public.profiles
  set coins = coins - expected_price,
      owned_cosmetics = owned_cosmetics || jsonb_build_array(p_cosmetic_id)
  where id = p_user_id;
end;
$$;

create or replace function public.buy_ruby_car(
  p_user_id uuid,
  p_car_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_rubies bigint;
  owned_cars jsonb;
begin
  if p_car_id not in ('phantom','aurora','car18','car19') then
    raise exception 'Invalid ruby car';
  end if;

  if p_price < 0 then raise exception 'Invalid price'; end if;

  select rubies, owned into current_rubies, owned_cars
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if owned_cars @> jsonb_build_array(p_car_id) then
    raise exception 'Already owned';
  end if;
  if current_rubies < p_price then raise exception 'Insufficient rubies'; end if;

  update public.profiles
  set rubies = rubies - p_price,
      owned = owned || jsonb_build_array(p_car_id),
      selected = p_car_id
  where id = p_user_id;
end;
$$;

create or replace function public.buy_ruby_paint(
  p_user_id uuid,
  p_paint_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_rubies bigint;
  unlocked_paints jsonb;
  expected_price integer;
begin
  expected_price := case p_paint_id
    when 'ruby-glow' then 5
    when 'obsidian' then 8
    else null
  end;

  if expected_price is null or p_price <> expected_price then
    raise exception 'Invalid ruby paint or price';
  end if;

  select rubies, owned_paints into current_rubies, unlocked_paints
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if unlocked_paints @> jsonb_build_array(p_paint_id) then
    raise exception 'Paint already owned';
  end if;
  if current_rubies < expected_price then raise exception 'Insufficient rubies'; end if;

  update public.profiles
  set rubies = rubies - expected_price,
      owned_paints = owned_paints || jsonb_build_array(p_paint_id)
  where id = p_user_id;
end;
$$;

create or replace function public.buy_ruby_cosmetic(
  p_user_id uuid,
  p_cosmetic_id text,
  p_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_rubies bigint;
  unlocked_cosmetics jsonb;
  expected_price integer;
begin
  expected_price := case p_cosmetic_id
    when 'wrap-prism' then 6
    when 'rim-ruby' then 5
    when 'spoiler-blade' then 7
    else null
  end;

  if expected_price is null or p_price <> expected_price then
    raise exception 'Invalid ruby cosmetic or price';
  end if;

  select rubies, owned_cosmetics into current_rubies, unlocked_cosmetics
  from public.profiles where id = p_user_id for update;

  if not found then raise exception 'Profile not found'; end if;
  if unlocked_cosmetics @> jsonb_build_array(p_cosmetic_id) then
    raise exception 'Cosmetic already owned';
  end if;
  if current_rubies < expected_price then raise exception 'Insufficient rubies'; end if;

  update public.profiles
  set rubies = rubies - expected_price,
      owned_cosmetics = owned_cosmetics || jsonb_build_array(p_cosmetic_id)
  where id = p_user_id;
end;
$$;

create or replace function public.add_player_xp(
  p_user_id uuid,
  p_amount integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  p public.profiles%rowtype;
  remaining_xp integer;
  next_level integer;
  next_multiplier numeric;
  updated_owned jsonb;
  bonus_coins bigint := 0;
  bonus_rubies bigint := 0;
  reward_car text;
  reward_text text := '';
begin
  if p_amount < 0 then raise exception 'Negative XP'; end if;

  select * into p from public.profiles where id = p_user_id for update;
  if not found then raise exception 'Profile not found'; end if;

  remaining_xp := p.xp + p_amount;
  next_level := p.player_level;
  next_multiplier := p.coin_multiplier;
  updated_owned := p.owned;

  while remaining_xp >= 2500 loop
    remaining_xp := remaining_xp - 2500;
    next_level := next_level + 1;
    bonus_rubies := bonus_rubies + 1;
    reward_text := concat_ws(' · ', nullif(reward_text,''), 'Level ' || next_level::text || ': 1 robijn');
    if next_level % 5 = 0 then
      bonus_rubies := bonus_rubies + 5;
      reward_text := concat_ws(' · ', nullif(reward_text,''), '5 bonusrobijnen');
    end if;
  end loop;

  update public.profiles
  set xp = remaining_xp,
      player_level = next_level,
      coin_multiplier = next_multiplier,
      coins = coins + bonus_coins,
      rubies = rubies + bonus_rubies,
      owned = updated_owned
  where id = p_user_id;

  return jsonb_build_object(
    'xp', remaining_xp,
    'level', next_level,
    'coinMultiplier', next_multiplier,
    'owned', updated_owned,
    'bonusCoins', bonus_coins,
    'bonusRubies', bonus_rubies,
    'reward', reward_text
  );
end;
$$;

create or replace function public.select_car(
  p_user_id uuid,
  p_car_id text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set selected = p_car_id
  where id = p_user_id
    and owned @> jsonb_build_array(p_car_id);

  if not found then raise exception 'Car not owned'; end if;
end;
$$;

create or replace function public.upgrade_car(
  p_user_id uuid,
  p_car_id text,
  p_part_id text,
  p_base_price integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  p public.profiles%rowtype;
  current_level integer;
  upgrade_price integer;
begin
  if p_part_id not in ('engine','handling','magnet') then
    raise exception 'Invalid part';
  end if;

  if p_base_price not in (100,150) then
    raise exception 'Invalid base price';
  end if;

  select * into p from public.profiles
  where id = p_user_id for update;

  if not found or not (p.owned @> jsonb_build_array(p_car_id)) then
    raise exception 'Car not owned';
  end if;

  current_level := coalesce(
    (p.upgrades #>> array[p_car_id,p_part_id])::integer, 0
  );

  if current_level < 0 or current_level >= 5 then
    raise exception 'Maximum level reached';
  end if;

  upgrade_price := p_base_price * (current_level + 1);
  if p.coins < upgrade_price then raise exception 'Insufficient coins'; end if;

  update public.profiles
  set coins = coins - upgrade_price,
      upgrades = jsonb_set(
        upgrades,
        array[p_car_id,p_part_id],
        to_jsonb(current_level + 1),
        true
      )
  where id = p_user_id;

  perform public.add_player_xp(p_user_id, 25 * (current_level + 1));
end;
$$;

create or replace function public.save_tuning(
  p_user_id uuid,
  p_car_id text,
  p_tuning jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (
    (
      p_tuning ->> 'paint' in
        ('#32b8ff','#ff426d','#ffc857','#b18cff','#62e6a7','#f3f6ff',
         '#ff9850','#54f5e2','#ff5de4','#a86445','#91a46a','#d59643',
         '#d3774e','#d7bc82','#ba7551','#78916a','#d6bd8a','#dcae52',
         '#d8838a','#58a6c7','#855b76','#667882','#ead9b8','#456b4f',
         '#ff2d6f','#1b1b22')
      or (
        p_tuning ->> 'paint' ~ '^#[0-9A-Fa-f]{6}$'
        and exists (
          select 1 from public.profiles
          where id = p_user_id
            and owned_paints @> jsonb_build_array(p_tuning ->> 'paint')
        )
      )
    )
    and p_tuning ->> 'neon' in
      ('#35d5f4','#ff426d','#a78bfa','#62e6a7','#ffc857')
    and p_tuning ->> 'style' in ('balanced','speed','control')
    and coalesce(p_tuning ->> 'wrap','none') in
      ('none','racing-stripes','flames','checker','side-stripe','camo','woodgrain','pinstripe','stars','prism')
    and coalesce(p_tuning ->> 'rimColor','#332d2a') in
      ('#332d2a','#ead9b8','#c38a47','#b14c40','#78916a','#718da5','#ffc857','#f3f6ff','#ff2d6f')
    and coalesce(p_tuning ->> 'spoiler','none') in
      ('none','ducktail','wing','tall-wing','vintage-lip','blade')
    and (
      coalesce(p_tuning ->> 'wrap','none') = 'none'
      or exists (
        select 1 from public.profiles
        where id = p_user_id
          and (
            owned_cosmetics @> jsonb_build_array('wrap-' || (p_tuning ->> 'wrap'))
            or tuning #>> array[p_car_id,'wrap'] = p_tuning ->> 'wrap'
          )
      )
    )
    and (
      coalesce(p_tuning ->> 'rimColor','#332d2a') = '#332d2a'
      or exists (
        select 1 from public.profiles
        where id = p_user_id
          and (
            owned_cosmetics @> jsonb_build_array(
              case p_tuning ->> 'rimColor'
                when '#ead9b8' then 'rim-cream'
                when '#c38a47' then 'rim-copper'
                when '#b14c40' then 'rim-brick'
                when '#78916a' then 'rim-sage'
                when '#718da5' then 'rim-slate'
                when '#ffc857' then 'rim-gold'
                when '#f3f6ff' then 'rim-pearl'
                when '#ff2d6f' then 'rim-ruby'
              end
            )
            or tuning #>> array[p_car_id,'rimColor'] = p_tuning ->> 'rimColor'
          )
      )
    )
    and (
      coalesce(p_tuning ->> 'spoiler','none') = 'none'
      or exists (
        select 1 from public.profiles
        where id = p_user_id
          and (
            owned_cosmetics @> jsonb_build_array('spoiler-' || (p_tuning ->> 'spoiler'))
            or tuning #>> array[p_car_id,'spoiler'] = p_tuning ->> 'spoiler'
          )
      )
    )
  ) then
    raise exception 'Invalid tuning';
  end if;

  update public.profiles
  set tuning = jsonb_set(tuning, array[p_car_id], p_tuning, true)
  where id = p_user_id
    and owned @> jsonb_build_array(p_car_id);

  if not found then raise exception 'Car not owned'; end if;
end;
$$;

-- Een race kan maar één keer worden verwerkt.
create or replace function public.finish_run(
  p_user_id uuid,
  p_run_id uuid,
  p_score integer,
  p_coins integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.game_runs%rowtype;
  elapsed_seconds numeric;
  max_score integer;
  max_coins integer;
  max_coin_multiplier numeric;
  progress_result jsonb;
  awarded_rubies integer;
  max_rubies integer;
begin
  if p_score < 0 or p_coins < 0 then
    raise exception 'Negative score';
  end if;

  select * into r from public.game_runs
  where id = p_run_id and user_id = p_user_id
  for update;

  if not found then raise exception 'Run not found'; end if;
  if r.finished_at is not null then raise exception 'Run already submitted'; end if;

  elapsed_seconds := extract(epoch from (clock_timestamp() - r.started_at));

  if elapsed_seconds < 5 then raise exception 'Run too short'; end if;

  -- De game scoort ongeveer 10 punten per seconde.
  -- Dit is een plausibiliteitslimiet, geen bewijs dat de speler eerlijk speelde.
  max_score := floor(elapsed_seconds * 13);

  -- Ruimte voor goudmunten om de 500 meter en bestaande muntbonussen.
  select greatest(1, coin_multiplier) into max_coin_multiplier
  from public.profiles where id = p_user_id;
  max_coins := ceil(elapsed_seconds * 80 * max_coin_multiplier);

  if p_score > max_score then raise exception 'Score exceeds time limit'; end if;
  if p_coins > max_coins then raise exception 'Coin limit exceeded'; end if;

  update public.game_runs
  set finished_at = clock_timestamp(), score = p_score, coins = p_coins
  where id = p_run_id;

  update public.profiles
  set coins = coins + p_coins,
      best_score = greatest(best_score, p_score),
      collision_count = collision_count + 1
  where id = p_user_id;

  progress_result := public.add_player_xp(p_user_id, p_score);

  return jsonb_build_object(
    'accepted', true,
    'score', p_score,
    'coins', p_coins,
    'rubies', coalesce((progress_result ->> 'bonusRubies')::integer, 0),
    'elapsedSeconds', floor(elapsed_seconds),
    'progress', progress_result
  );
end;
$$;

-- RPC-functies zijn uitsluitend via de vertrouwde server bedoeld.
revoke all on function public.buy_car(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.buy_paint(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.buy_cosmetic(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.add_player_xp(uuid,integer) from public, anon, authenticated;
revoke all on function public.select_car(uuid,text) from public, anon, authenticated;
revoke all on function public.upgrade_car(uuid,text,text,integer) from public, anon, authenticated;
revoke all on function public.save_tuning(uuid,text,jsonb) from public, anon, authenticated;
revoke all on function public.finish_run(uuid,uuid,integer,integer) from public, anon, authenticated;
revoke all on function public.buy_ruby_car(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.buy_ruby_paint(uuid,text,integer) from public, anon, authenticated;
revoke all on function public.buy_ruby_cosmetic(uuid,text,integer) from public, anon, authenticated;

grant execute on function public.buy_car(uuid,text,integer) to service_role;
grant execute on function public.buy_paint(uuid,text,integer) to service_role;
grant execute on function public.buy_cosmetic(uuid,text,integer) to service_role;
grant execute on function public.add_player_xp(uuid,integer) to service_role;
grant execute on function public.select_car(uuid,text) to service_role;
grant execute on function public.upgrade_car(uuid,text,text,integer) to service_role;
grant execute on function public.save_tuning(uuid,text,jsonb) to service_role;
grant execute on function public.finish_run(uuid,uuid,integer,integer) to service_role;
grant execute on function public.buy_ruby_car(uuid,text,integer) to service_role;
grant execute on function public.buy_ruby_paint(uuid,text,integer) to service_role;
grant execute on function public.buy_ruby_cosmetic(uuid,text,integer) to service_role;
