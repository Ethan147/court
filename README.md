## Trello board

Anyone with this [trello court link](https://trello.com/invite/b/oS5Fz6bN/ATTI19c9e6c96c15131570252a4aa7a76f805C031F15/court) can join as a member.

---

## Env variables

- 12 factor app compliant, gathered in `env_config.py`


## ~/.zshrc setup

- Some quality of life additions
```bash

export PYTHONPATH=~/court/backend/opt/python/lib/python3.10/site-packages/:$PYTHONPATH

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


## Docker cheat sheet

- Connecting to a running docker database
```
docker exec -it db_court psql -U postgres -d court
```

- Docker one-time setup
    - using `Docker version 20.10.17, build 100c70180f` installed with snap
    - must download [docker-credential-helpers v0.7.0](https://github.com/docker/docker-credential-helpers/releases)
        - Run the following in `~/Downloads/.`
            - `wget https://github.com/docker/docker-credential-helpers/releases/download/v0.7.0/docker-credential-secretservice-v0.7.0.linux-amd64`
            - `mv docker-credential-secretservice-v0.7.0.linux-amd64 docker-credential-secretservice`
            - `sudo mv docker-credential-secretservice /usr/local/bin/`
            - `sudo chmod +x /usr/local/bin/docker-credential-secretservice`

- Bring up the docker container
    1. `docker pull postgis/postgis`
    2. spring up docker container

```
docker run -d --name db_court -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=court -p 5432:5432 postgis/postgis
```

- Connect to the running instance as needed
    - `docker exec -it db_court psql -U emiller court`
    - `docker exec -it db_court bash`


## Docker network

Docker running on a local machine and local-run lambdas (which will use Docker) will each be in their isolated Docker network environments and thus will not be able to see or target eachother.

To resolve this:
- `docker network create network-court`
- `docker network connect network-court db_court`
- (when appropriate) `sam local start-api --docker-network network-court --env-vars env.json`
- (to find ip for env.json) `docker network inspect network-court`


## Database management with dbmate

- install (linux)
```
sudo curl -fsSL -o /usr/local/bin/dbmate https://github.com/amacneil/dbmate/releases/latest/download/dbmate-linux-amd64
sudo chmod +x /usr/local/bin/dbmate
```
- create a migration `dbmate --migrations-dir db/base/migrations new create_users_table`
- migrations
    - `dbmate --migrations-dir db/base/migrations up`
    - `dbmate --migrations-dir db/base/migrations rollback`
- migrations for testing
    - `dbmate --migrations-dir db/dev/migrations up`
    - `dbmate --migrations-dir db/dev/migrations rollback`

## Unit testing

- backend: python unittest `python -m unittest`
- frontend: jest test `npm test` from expo_app\.


## Test coverage reports
Coverage reports must be run manually.

- `coverage run -m unittest discover`
- `coverage report`


## Lambdas
`aws sso login --profile <profile_name>`
e.g. `aws sso login --profile emiller`

- to run locally
    - enter `court/backend/`
    - run `sam build`
    - in one terminal run `sam local start-api --profile <profile> --env-vars env.json`
    - in a second, run `curl http://127.0.0.1:3000/hello`
        - this will return `{"message": "Hello, World!"}`

- to handle lambdas requirements
    - `poetry` is handled at the project root
    - each project needs a dedicated `requirements.txt`
    - poetry should be exported to the intended .txt via the following command (then prune away unused packages)

```
poetry export -f requirements.txt --output court/lambdas/api_location/requirements.txt --without-hashes
```

- to get lambdas layers functioning correctly, must do the following (todo generalize)

`export PYTHONPATH=$PWD/local_layers`

and then things must be called as follows to begin the process

```
sam build
sam local start-api --profile <profile> --env-vars env.json
```


### Lambda layers

#### Basics
Deploy lambda layers via
- cd `layers/base` then `zip -r base.zip python/`
- cd `layers/location` then `zip -r location.zip python/`
- cd `layers/user` then `zip -r user.zip python/`

These layers should sit in their respected backend/layers folders.
The .zip files will be uploaded to AWS lambdas for production use.

#### Local Testing

The `backend/python/lib/python3.10/site-packages` directory is used to mimic the AWS structure for accessing the contents of layers

To set this up, run the following from the root directory
```
unzip backend/layers/base/base.zip -d backend/opt
unzip backend/layers/location/location.zip -d backend/opt
unzip backend/layers/user/user.zip -d backend/opt
```

## Secrets manger

This projcet uses AWS Parameter Store for storing secure, encrypted values for access within the lambdas ecosystem.

For local testing within the Parameter store framework a file will be kept at `court/backend/env.json` with local db testing environmental variables

NOTE: this may invalidate the "init_env_test" function within the "~/.zshrc setup" area (must investigate)
ip address of docker can be found via `docker network inspect network-court`
```
{
    "ApiHelloFunction": {
      "DB_NAME": "court",
      "DB_HOST": "172.19.0.2",
      "DB_PORT": "5432",
      "DB_PASS": "postgres",
      "DB_USER": "postgres",
      "DATABASE_URL": "postgres://postgres:postgres@172.19.0.2:5432/court?sslmode=disable",
      "ENV": "DEV"
    },
    "ApiUserFunction": {
      "DB_NAME": "court",
      "DB_HOST": "172.19.0.2",
      "DB_PORT": "5432",
      "DB_PASS": "postgres",
      "DB_USER": "postgres",
      "DATABASE_URL": "postgres://postgres:postgres@172.19.0.2:5432/court?sslmode=disable",
      "ENV": "DEV"
    },
    "ApiGooglePlacesFunction": {
      "PLACES_KEY": "google_places_api_key_here"
    }
}
```

## AWS cloudformation

`aws cloudformation deploy --template-file path/to/iam_ssm_access_role.yaml --stack-name <stack-name> --capabilities CAPABILITY_IAM --profile emiller`


## Expo setup

- nvm install
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
- install node
    - `nvm install 16.14.2`
- install expo
    - `npm install -g expo-cli`
- install assocated expo packages
    - `npx expo install react-native-web@~0.18.10 react-dom@18.2.0 @expo/webpack-config@^18.0.1`
- iOS setup
    - Install the "Expo Go" app on personal device (for propotyping against iOS)
- instructions (from expo-cli output):
```
To run your project, navigate to the directory and run one of the following npm commands.

- cd expo_app
- npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
- npm run android
- npm run ios # requires an iOS device or macOS for access to an iOS simulator
- npm run web
```
