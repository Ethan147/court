## Trello board

Anyone with this [trello court link](https://trello.com/invite/b/oS5Fz6bN/ATTI19c9e6c96c15131570252a4aa7a76f805C031F15/court) can join as a member.

---

## Env variables

- 12 factor app compliant, gathered in `env_config.py`


## ~/.zshrc setup

- Some quality of life additions
```bash
function poetry_activate {
    source "$(poetry env info --path)/bin/activate"
}

function test_env_init {
    export DB_NAME='court'
    export DB_HOST='127.0.0.2'
    export DB_PORT=5432
    export DB_PASS='postgres'
    export DB_USER='postgres'
    export DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/court?sslmode=disable
    export FLASK_DEBUG=1
    export FLASK_APP=court/app.py
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


## Unit testing

- all done via python unittest `python -m unittest`


## test coverage reports
Coverage reports must be run manually.

- `coverage run -m unittest discover`
- `coverage report`


## Flask (WIP - to remove)

- `python -m flask run`


## expo-setup (WIP)

- nvm install
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
- install node
    - `nvm install v19.8.1`
- `npm install -g expo-cli`
    - TODO: there v19 is past what Expo supports as stable release
