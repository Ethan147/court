## Password manager

- generate a local password

  - `sudo apt-get purge pass gnupg` (remove password)
  - `rm -rf ~/.gnupg`
  - `sudo apt-get install pass gnupg`
  - `gpg --full-generate-key`

- gpg & pass (gpg has a master password)
  - tied to ethan.mill147@gmail.com
- pass insert `postgres/court`
- also create some file `get_secrets.py` in the root directory of this project as follows (to keep insecure `subprocess` calls out of the project)

```
import subprocess


def get_db_pass() -> str:
    completed_process = subprocess.run(["pass", "postgres/court"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = completed_process.stdout.decode("utf-8").strip()  # Decode the output bytes and strip any whitespace
    if completed_process.returncode != 0:
        raise ValueError("Error getting database password")
    return output


def get_local_db_port() -> int:
    return 5432
```

## Poetry setup reference

- remove existing env
  - `poetry shell`
  - `poetry env remove <env_name>`
- startup new env
  - `poetry install` (first time)
- activate shell
  - `poetry env list`
  - `source /home/ethan/.cache/pypoetry/virtualenvs/court-9sax_Dbr-py3.10/bin/activate`

## docker cheat sheet

- Bring up the docker container
  1. `docker pull postgres`
  2. spring up docker container

```
docker run -d --name db_court -e POSTGRES_USER=emiller -e POSTGRES_PASSWORD=$(pass postgres/court) -e POSTGRES_DB=court postgres
```

- Connect to the running instance
  - `docker exec -it db_court psql -U emiller court`
- Start the postgres service in the container
  - `docker exec db_court pg_createcluster 15 main --start`
  - `docker exec db_court service postgresql start`
- Check the docker postgres service status
  - `docker exec db_court service postgresql status`
