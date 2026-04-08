create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'insight_category') then
    create type public.insight_category as enum ('economy', 'politics', 'jobs', 'migration');
  end if;

  if not exists (select 1 from pg_type where typname = 'risk_level') then
    create type public.risk_level as enum ('stable', 'caution', 'risk', 'critical');
  end if;

  if not exists (select 1 from pg_type where typname = 'interaction_kind') then
    create type public.interaction_kind as enum ('interested', 'ignored', 'saved', 'shared', 'explained');
  end if;

  if not exists (select 1 from pg_type where typname = 'flow_direction') then
    create type public.flow_direction as enum ('in', 'out');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_demand_level') then
    create type public.job_demand_level as enum ('surging', 'hot', 'steady', 'cooling');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  skill_profile text[] not null default '{}'::text[],
  preferred_countries text[] not null default '{Kerala}'::text[],
  career_interest text[] not null default '{}'::text[],
  interaction_history jsonb not null default '[]'::jsonb,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_skill_profile_limit check (cardinality(skill_profile) <= 64)
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  category public.insight_category not null,
  title text not null,
  short_summary text not null,
  full_summary text not null,
  vector_summary text not null default '',
  why_it_matters text not null,
  read_more text not null default '',
  source_name text not null,
  source_url text not null,
  source_trace jsonb not null default '[]'::jsonb,
  source_hash text not null unique,
  region text not null default 'Kerala',
  confidence_score numeric(4, 3) not null check (confidence_score between 0 and 1),
  trending_score integer not null default 0 check (trending_score between 0 and 100),
  metric_snapshot jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  industry text not null,
  company_type text not null default '',
  location_hub text not null default 'Kerala',
  openings_count integer not null default 0,
  avg_salary_kerala integer not null check (avg_salary_kerala >= 0),
  avg_salary_abroad integer not null check (avg_salary_abroad >= 0),
  salary_min_kerala integer not null default 0,
  salary_max_kerala integer not null default 0,
  salary_min_abroad integer not null default 0,
  salary_max_abroad integer not null default 0,
  demand_growth_pct numeric(8, 2) not null default 0,
  automation_risk_score integer not null check (automation_risk_score between 0 and 100),
  future_proof_score integer not null check (future_proof_score between 0 and 100),
  skill_tags text[] not null default '{}'::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.economic_metrics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  label text not null,
  value numeric(14, 2) not null default 0,
  display_value text not null,
  unit text not null,
  change_percentage numeric(8, 2) not null default 0,
  target_value numeric(14, 2),
  target_display_value text,
  last_updated timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.job_trends (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  demand_level public.job_demand_level not null default 'steady',
  avg_salary integer not null default 0,
  location_hub text not null,
  openings_count integer not null default 0,
  demand_growth_pct numeric(8, 2) not null default 0,
  company_type text not null default '',
  source_name text not null default '',
  focus_skills text[] not null default '{}'::text[],
  last_updated timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.migration_tracker (
  id uuid primary key default gen_random_uuid(),
  month date not null unique,
  gulf_outflow integer not null default 0,
  eu_outflow integer not null default 0,
  india_inflow integer not null default 0,
  remittance_index numeric(8, 2) not null default 0,
  brain_drain_score integer not null check (brain_drain_score between 0 and 100),
  gulf_decline_pct numeric(8, 2) not null default 0,
  eu_growth_pct numeric(8, 2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.migration_corridors (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  region text not null,
  corridor_label text not null,
  count integer not null default 0,
  flow_direction public.flow_direction not null,
  change_pct numeric(8, 2) not null default 0,
  opportunity_score integer not null default 0,
  source_name text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sentiment_pulse (
  id uuid primary key default gen_random_uuid(),
  region text not null unique,
  youth_mood_score integer not null check (youth_mood_score between 0 and 100),
  unemployment_stress integer not null check (unemployment_stress between 0 and 100),
  top_issue text not null,
  political_sentiment integer not null check (political_sentiment between 0 and 100),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rss_url text not null unique,
  language text not null,
  region text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.news_sources (id) on delete cascade,
  headline text not null,
  summary text not null default '',
  region text not null,
  topic text not null,
  sentiment_score numeric(6, 3) not null default 0,
  published_at timestamptz not null,
  source_hash text not null unique,
  url text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  insight_id uuid references public.insights (id) on delete cascade,
  career_id uuid references public.careers (id) on delete cascade,
  kind public.interaction_kind not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint interaction_target_present check (insight_id is not null or career_id is not null)
);

create table if not exists public.alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  channel text not null check (channel in ('push', 'email', 'whatsapp')),
  topic text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, channel, topic)
);

create index if not exists insights_category_created_idx on public.insights (category, created_at desc);
create index if not exists insights_published_trending_idx on public.insights (is_published, trending_score desc, created_at desc);
create index if not exists insights_title_trgm_idx on public.insights using gin (title gin_trgm_ops);
create index if not exists careers_industry_future_idx on public.careers (industry, future_proof_score desc, demand_growth_pct desc);
create index if not exists careers_skill_tags_gin_idx on public.careers using gin (skill_tags);
create index if not exists economic_metrics_slug_idx on public.economic_metrics (slug, last_updated desc);
create index if not exists job_trends_sector_idx on public.job_trends (sector, demand_growth_pct desc);
create index if not exists job_trends_focus_skills_gin_idx on public.job_trends using gin (focus_skills);
create index if not exists migration_tracker_month_idx on public.migration_tracker (month desc);
create index if not exists migration_corridors_flow_idx on public.migration_corridors (flow_direction, count desc);
create index if not exists news_items_published_idx on public.news_items (published_at desc);
create index if not exists news_items_source_hash_idx on public.news_items (source_hash);
create index if not exists user_interactions_user_created_idx on public.user_interactions (user_id, created_at desc);
create index if not exists alert_subscriptions_user_idx on public.alert_subscriptions (user_id, topic);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists set_insights_updated_at on public.insights;
create trigger set_insights_updated_at before update on public.insights for each row execute function public.set_updated_at();
drop trigger if exists set_careers_updated_at on public.careers;
create trigger set_careers_updated_at before update on public.careers for each row execute function public.set_updated_at();
drop trigger if exists set_economic_metrics_updated_at on public.economic_metrics;
create trigger set_economic_metrics_updated_at before update on public.economic_metrics for each row execute function public.set_updated_at();
drop trigger if exists set_job_trends_updated_at on public.job_trends;
create trigger set_job_trends_updated_at before update on public.job_trends for each row execute function public.set_updated_at();
drop trigger if exists set_migration_tracker_updated_at on public.migration_tracker;
create trigger set_migration_tracker_updated_at before update on public.migration_tracker for each row execute function public.set_updated_at();
drop trigger if exists set_migration_corridors_updated_at on public.migration_corridors;
create trigger set_migration_corridors_updated_at before update on public.migration_corridors for each row execute function public.set_updated_at();
drop trigger if exists set_sentiment_pulse_updated_at on public.sentiment_pulse;
create trigger set_sentiment_pulse_updated_at before update on public.sentiment_pulse for each row execute function public.set_updated_at();
drop trigger if exists set_news_sources_updated_at on public.news_sources;
create trigger set_news_sources_updated_at before update on public.news_sources for each row execute function public.set_updated_at();
drop trigger if exists set_news_items_updated_at on public.news_items;
create trigger set_news_items_updated_at before update on public.news_items for each row execute function public.set_updated_at();
drop trigger if exists set_alert_subscriptions_updated_at on public.alert_subscriptions;
create trigger set_alert_subscriptions_updated_at before update on public.alert_subscriptions for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.compute_crisis_score(
  gdp_gap_pct numeric,
  remittance_drop_pct numeric,
  youth_unemployment_pct numeric,
  debt_ratio_pct numeric
)
returns jsonb
language sql
stable
as $$
  with normalized as (
    select
      least(greatest(gdp_gap_pct * 7.5, 0), 100) as gdp_pressure,
      least(greatest(remittance_drop_pct * 6.6, 0), 100) as remittance_pressure,
      least(greatest(youth_unemployment_pct * 2.4, 0), 100) as unemployment_pressure,
      least(greatest((debt_ratio_pct - 20) * 3.8, 0), 100) as debt_pressure
  ),
  final_score as (
    select round(
      gdp_pressure * 0.22 +
      remittance_pressure * 0.23 +
      unemployment_pressure * 0.32 +
      debt_pressure * 0.23
    )::int as score
    from normalized
  )
  select jsonb_build_object(
    'score', score,
    'risk_level',
    case
      when score >= 78 then 'critical'
      when score >= 60 then 'risk'
      when score >= 42 then 'caution'
      else 'stable'
    end
  )
  from final_score;
$$;

create or replace function public.rank_feed_insights(
  requested_category public.insight_category default null,
  item_limit integer default 20
)
returns table (
  id uuid,
  category public.insight_category,
  title text,
  short_summary text,
  why_it_matters text,
  source_url text,
  confidence_score numeric,
  trending_score integer,
  created_at timestamptz,
  reality_score numeric
)
language sql
stable
as $$
  select
    i.id,
    i.category,
    i.title,
    i.short_summary,
    i.why_it_matters,
    i.source_url,
    i.confidence_score,
    i.trending_score,
    i.created_at,
    round(
      (i.trending_score * 0.44) +
      (i.confidence_score * 100 * 0.26) +
      (greatest(1, 72 - extract(epoch from timezone('utc', now()) - i.created_at) / 3600) / 72 * 24),
      2
    ) as reality_score
  from public.insights i
  where i.is_published = true
    and (requested_category is null or i.category = requested_category)
  order by reality_score desc, i.created_at desc
  limit greatest(item_limit, 1);
$$;

alter table public.users enable row level security;
alter table public.insights enable row level security;
alter table public.careers enable row level security;
alter table public.economic_metrics enable row level security;
alter table public.job_trends enable row level security;
alter table public.migration_tracker enable row level security;
alter table public.migration_corridors enable row level security;
alter table public.sentiment_pulse enable row level security;
alter table public.news_sources enable row level security;
alter table public.news_items enable row level security;
alter table public.user_interactions enable row level security;
alter table public.alert_subscriptions enable row level security;

drop policy if exists "users can read self" on public.users;
create policy "users can read self" on public.users for select to authenticated using (auth.uid() = id);
drop policy if exists "users can insert self" on public.users;
create policy "users can insert self" on public.users for insert to authenticated with check (auth.uid() = id);
drop policy if exists "users can update self" on public.users;
create policy "users can update self" on public.users for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "public can read insights" on public.insights;
create policy "public can read insights" on public.insights for select to anon, authenticated using (is_published = true);
drop policy if exists "public can read careers" on public.careers;
create policy "public can read careers" on public.careers for select to anon, authenticated using (is_active = true);
drop policy if exists "public can read economic metrics" on public.economic_metrics;
create policy "public can read economic metrics" on public.economic_metrics for select to anon, authenticated using (true);
drop policy if exists "public can read job trends" on public.job_trends;
create policy "public can read job trends" on public.job_trends for select to anon, authenticated using (true);
drop policy if exists "public can read migration tracker" on public.migration_tracker;
create policy "public can read migration tracker" on public.migration_tracker for select to anon, authenticated using (true);
drop policy if exists "public can read migration corridors" on public.migration_corridors;
create policy "public can read migration corridors" on public.migration_corridors for select to anon, authenticated using (true);
drop policy if exists "public can read sentiment pulse" on public.sentiment_pulse;
create policy "public can read sentiment pulse" on public.sentiment_pulse for select to anon, authenticated using (true);
drop policy if exists "public can read news sources" on public.news_sources;
create policy "public can read news sources" on public.news_sources for select to anon, authenticated using (is_active = true);
drop policy if exists "public can read news items" on public.news_items;
create policy "public can read news items" on public.news_items for select to anon, authenticated using (true);

drop policy if exists "users manage own interactions" on public.user_interactions;
create policy "users manage own interactions"
on public.user_interactions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users manage own alert subscriptions" on public.alert_subscriptions;
create policy "users manage own alert subscriptions"
on public.alert_subscriptions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.insights, public.careers, public.economic_metrics, public.job_trends, public.migration_tracker, public.migration_corridors, public.sentiment_pulse, public.news_sources, public.news_items to anon, authenticated;
grant select, insert, update on public.users to authenticated;
grant select, insert, update, delete on public.user_interactions to authenticated;
grant select, insert, update, delete on public.alert_subscriptions to authenticated;
grant execute on function public.compute_crisis_score(numeric, numeric, numeric, numeric) to anon, authenticated;
grant execute on function public.rank_feed_insights(public.insight_category, integer) to anon, authenticated;
