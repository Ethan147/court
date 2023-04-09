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

function init_env_test {
    export DB_NAME='court'
    export DB_HOST='127.0.0.2'
    export DB_PORT=5432
    export DB_PASS='postgres'
    export DB_USER='postgres'
    export DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/court?sslmode=disable
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

- Docker one-time setup
    - using `Docker version 20.10.17, build 100c70180f` installed with snap
    - must download [docker-credential-helpers v0.7.0](https://github.com/docker/docker-credential-helpers/releases)
        - Run the following in `~/Downloads/.`
            - `wget https://github.com/docker/docker-credential-helpers/releases/download/v0.7.0/docker-credential-secretservice-v0.7.0.linux-amd64`
            - `mv docker-credential-secretservice-v0.7.0.linux-amd64 docker-credential-secretservice`
            - `sudo mv docker-credential-secretservice /usr/local/bin/`
            - `sudo chmod +x /usr/local/bin/docker-credential-secretservice`

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


## lambdas
`aws sso login --profile <profile_name>`

- to run locally
    - in one terminal run `sam local start-api --profile <profile>`
    - in a second, run `curl http://127.0.0.1:3000/hello`
        - this will return `{"message": "Hello, World!"}`

## expo-setup

- nvm install
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
- install node
    - `nvm install 16.14.2`
- install expo
    - `npm install -g expo-cli`
- instructions (from expo-cli output):
```
To run your project, navigate to the directory and run one of the following npm commands.

- cd expo_app
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
- npm run android
- npm run ios # requires an iOS device or macOS for access to an iOS simulator
- npm run web
```
