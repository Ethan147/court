-- migrate:up

do $$ begin
  create type platform as enum ('web', 'mobile');
exception
  when duplicate_object then null;
end $$;

create table user_session (
    id bigserial primary key,
    session_uuid uuid not null unique default uuid_generate_v4(), -- this functions as the 'session token'
    user_account_id integer not null references user_account(id),
    device_identifier varchar(255) not null,  -- mobile: expo installationid; web: generated session id
    device_type varchar(255),  -- e.g., "iphone 12", "web browser", etc. as much specificity as we can manage
    platform platform not null,
    created_at timestamp not null default now(),
    expires_at timestamp not null,
    is_active boolean not null default true
);

create index idx_user_session_active_user_session on user_session(user_account_id) WHERE is_active = true;


create table user_session_history (
    id bigserial primary key,
    session_uuid uuid not null references user_session(session_uuid),
    extended_at timestamp not null default now(),
    previous_expires_at timestamp not null,
    new_expires_at timestamp not null,
    extension_reason varchar(255) not null
);

create index idx_user_session_history on user_session_history(session_uuid);


-- migrate:down

drop table if exists user_session_history;
drop table if exists user_session;
