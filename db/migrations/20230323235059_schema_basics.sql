-- todo: should user signify primary address?
-- todo: a table for recording matches?
-- todo: how to record skill level?
-- todo: a table for tennis & pickleball locations?
-- todo: a table for rating a user or location?


-- migrate:up
-------------

create table user_accounts (
    user_id bigserial primary key,
    cognito_user_id varchar(255) unique not null,
    first_name text not null,
    last_name text not null,
    email text unique not null,
    gender text,
    dob date,
    terms_consent boolean,
    terms_version text,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

create index idx_user_email on user_accounts(email);

create table addresses (
    address_id bigserial primary key,
    user_id integer references user_accounts(user_id) on delete cascade,
    address_line_1 text not null,
    address_line_2 text,
    city text not null,
    state text not null,
    country text not null,
    postal_code text not null,
    location geography(point, 4326), -- todo: what does 4326 signify here?
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

create index idx_address_location on addresses using gist(location);
create index idx_address_user_id on addresses(user_id);

create table interests (
    interest_id bigserial primary key,
    name text unique not null
);

-- create the user-interest relationship table
create table user_interest_mapping (
    user_id integer references user_accounts(user_id) on delete cascade,
    interest_id integer references interests(interest_id) on delete cascade,
    created_at timestamptz default current_timestamp,
    primary key (user_id, interest_id)
);

insert into interests (name) values ('pickleball'), ('tennis');

-- migrate:down
---------------
drop table if exists user_accounts;
drop table if exists addresses;
drop table if exists interests;
drop table if exists user_interest_mapping;
