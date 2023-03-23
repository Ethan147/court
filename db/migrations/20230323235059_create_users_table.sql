-- migrate:up
create table if not exists account (
    id serial primary key,
    first_name text not null,
    last_name text not null,
    tennis boolean not null,
    pickleball boolean not null,
    racquetball boolean not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create index if not exists account_first_name_idx on account (first_name);
create index if not exists account_last_name_idx on account (last_name);
create index if not exists account_tennis_idx on account (tennis);
create index if not exists account_pickleball_idx on account (pickleball);
create index if not exists account_racquetball_idx on account (racquetball);

-- migrate:down
drop table if exists account;
