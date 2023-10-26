-- migrate:up

do $$ begin
  create type platform as enum ('web', 'mobile');
exception
  when duplicate_object then null;
end $$;


create table user_session (
    id bigserial primary key,
    session_uuid uuid not null unique default uuid_generate_v4(),
    user_id integer not null references user_account(id),
    token varchar(255) not null unique,
    device_identifier varchar(255) not null,  -- mobile: expo installationid; web: generated session id
    platform platform not null,
    created_at timestamp not null default now(),
    expires_at timestamp not null,
    is_active boolean not null default true
);

create table user_session_history (
    id bigserial primary key,
    session_uuid uuid not null references user_session(session_uuid),
    extended_at timestamp not null default now(),
    previous_expires_at timestamp not null,
    new_expires_at timestamp not null,
    extension_reason varchar(255) not null
);

-- create table user_device (
--     device_id serial primary key,
--     user_id integer references users(user_id),
--     device_identifier varchar(255) unique not null,  -- should match the device_identifier in user_sessions.
--     device_type varchar(255),  -- e.g., "iphone 12", "samsung galaxy s21", "web browser", etc.
--     last_accessed timestamp default now(),
--     -- ... any other device-specific columns ...
-- );


-- migrate:down

drop table if exists user_session;
-- drop table if exists user_device;
