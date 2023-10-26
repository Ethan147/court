-- migrate:up

create table user_session (
    session_id uuid primary key default uuid_generate_v4(),
    user_id integer references user_account(id),
    created_at timestamp without time zone default current_timestamp,
    expires_at timestamp without time zone default current_timestamp + interval '1 hour',  -- default to 1 hour. adjust as needed.
    unique(user_id, session_id)
);


-- migrate:down

drop table if exists user_session;
