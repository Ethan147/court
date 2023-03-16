## Password manager

- gpg & pass (gpg has a master password)
  - tied to ethan.mill147@gmail.com
- pass insert `postgresql/court`

## Local setup for docker

1. `docker pull postgres`
2. `docker network create mynetwork` (used to connect containers together)
3. sping up docker container

```
docker run -d --name db_court --network mynetwork -e POSTGRES_USER=emiller -e POSTGRES_PASSWORD=$(pass postgres/court) -e POSTGRES_DB=court postgres
```

## Connect to a setup docker

- `docker exec -it db_court psql -U emiller court`
