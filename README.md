# legendary-remote-server
Server part of the legendary-remote

# Dependencies
Nodejs `18.18.0`

# Init before developing
1. Install dependencies
```shell
npm i
```

2. Create and configure `.env`
```shell
(ls .env && echo ".env is already exist") || more +2 .env.default > .env
```

3. Run a migration to create your database tables with Prisma Migrate
```shell
npx prisma migrate dev --name init
```

4. You can now run a development server
```shell
# dev server
npm run dev
```
