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
