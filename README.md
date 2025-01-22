# About

RPI Petitions is a web application that is developed by the RPI Student Senate's Web Technologies Group. It aims to bridge the gap between the student body and the Student Senate, allowing the student body to bring up campus-wide concerns.

# Local Development
Docker and Node are required for local development.
Run a docker container for a postgres database

```shell
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=petitions -p 5432:5432 -d postgres
```

If you run the command exactly, the following will be needed to be added to .env

```
DATABASE_URL="postgres://postgres:password@localhost:5432/petitions"
```

In order to push the database schema, run the following command

```
npx drizzle-kit push
```

To add a user, in case I have not figured out how to add seeded users, 

```
npx drizzle-kit studio
```

You can insert a user into the users table.

# Server Deployment

## TODO