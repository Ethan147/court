-- migrate:up


create table if not exists mock_cognito (
    id bigserial primary key,
    user_uuid uuid unique not null default uuid_generate_v4(),
    user_password text not null,  -- plaintext for testing
    user_email text not null,
    user_phone_number text,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

-- migrate:down

drop table if exists mock_cognito;
