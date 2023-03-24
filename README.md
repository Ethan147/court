## Env variables

- 12 factor app compliant, gathered in `env_configurations.py`


## ~/.zshrc setup

- Some quality of life additions
```
# This doesn't work (keep experimenting)
function poetry_activate {
    eval "$( poetry env list --full-path | grep Activated | cut -d' ' -f1 )/bin/activate"
}

function test_env_init {
    export DB_NAME='court'
    export DB_HOST='172.0.0.2'
    export DB_PORT=5432
    export DB_PASS='postgres'
    export DB_USER='postgres'
}
```

## Poetry setup reference

- remove existing env
    - `poetry env list`
    - `poetry env remove <env_name>`
- startup new env
    - `poetry install` (first time)
- activate shell
    - `poetry shell`
    - `source "$( poetry env list --full-path | grep Activated | cut -d' ' -f1 )/bin/activate"`

## docker cheat sheet

- Bring up the docker container
    1. `docker pull postgres`
    2. spring up docker container

```
docker run -d --name db_court -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=court -p 5432:5432 postgres
```

- Connect to the running instance as needed
    - `docker exec -it db_court psql -U emiller court`
    - `docker exec -it db_court bash`


## database management with dbmate

- install (linux)
```
sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
sudo chmod +x /usr/local/bin/dbmate
```
- create a migration `dbmate new create_users_table`
- migrations
    - `dbmate up`
    - `dbmate rollback`
