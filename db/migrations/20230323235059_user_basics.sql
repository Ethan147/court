-- these can be addressed in future migrations
-- todo: should user signify primary address?
-- todo: a table for recording matches?
-- todo: how to record skill level?
-- todo: a table for tennis & pickleball locations?
-- todo: a table for rating a user or location?

-------------
-- migrate:up
-------------

create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

do $$ begin
  create type gender_category as enum ('male', 'female', 'other');
exception
  when duplicate_object then null;
end $$;


create table if not exists user_account (
    id bigserial primary key,
    user_uuid uuid unique not null default uuid_generate_v4(),
    cognito_user_id text unique not null,
    first_name text not null,
    last_name text not null,
    email text unique not null,
    gender_category gender_category not null,
    gender_self_specify text default null,
    dob date not null,
    created_at timestamp not null,
    updated_at timestamp not null default now()
);

create index idx_user_account_email on user_account(email);

create table user_play_location (
    id bigserial primary key,
    user_account_id integer not null references user_account(id) on delete cascade,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    country text not null,
    postal_code text not null,
    location geography(point, 4326), -- WGS 84 SRID
    created_at timestamp not null,
    updated_at timestamp not null default now()
);

create index idx_user_play_location on user_play_location using gist(location);
create index idx_user_play_location_user_id on user_play_location(user_account_id);

create table user_mailing_address (
    id bigserial primary key,
    user_account_id integer references user_account(id) on delete cascade,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    country text not null,
    postal_code text not null,
    created_at timestamp not null,
    updated_at timestamp not null default now()
);

create index idx_user_mailing_address_user_id on user_mailing_address(user_account_id);

create table interest (
    id bigserial primary key,
    name text not null unique,
    created_at timestamp not null,
    updated_at timestamp default now()
);

-- in the future can include pickleball_coach, tennis_coach
insert into interest (name, created_at) values ('pickleball', now()), ('tennis', now());

create table user_interest_mapping (
    user_account_id integer not null references user_account(id) on delete cascade,
    interest_id integer not null references interest(id) on delete cascade,
    created_at timestamp not null,
    updated_at timestamp not null default now(),
    primary key (user_account_id, interest_id)
);

create table terms_and_conditions (
    id bigserial primary key,
    version text not null unique,
    terms_text text not null,
    created_at timestamp not null,
    updated_at timestamp not null default now()
);

create table user_account_terms_consent (
    id bigserial primary key,
    user_account_id integer not null references user_account(id) on delete cascade,
    terms_and_conditions_id integer not null references terms_and_conditions(id) on delete cascade,
    consented_at timestamp not null,
    created_at timestamp not null,
    updated_at timestamp not null default now()
);

create index idx_terms_version on terms_and_conditions(version);
create index idx_user_terms_consent on user_account_terms_consent(user_account_id, terms_and_conditions_id);

---------------
-- migrate:down
---------------

drop table if exists user_account_terms_consent;
drop table if exists terms_and_conditions;
drop table if exists user_interest_mapping;
drop table if exists interest;
drop table if exists user_mailing_address;
drop table if exists user_play_location;
drop table if exists user_account;
drop type if exists gender_category;
