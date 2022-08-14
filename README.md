# Office Lunch Platform - Backend

A Node.js Backend server made with express.js

## About the project
If you want to know more about the context of the project, you can read it here: [https://github.com/FernandoDzay/office-lunch-react](https://github.com/FernandoDzay/office-lunch-react, 'Frontend of the project').

## Development setup
First, download dependencies.

```
npm install
```
Then, you need to create a **.env** file in the root directory.

The **.env** file should have the following structure:
```
ACCESS_TOKEN_SECRET=random_super_secret_string1
REFRESH_TOKEN_SECRET=random_super_secret_string2

NODE_ENV=dev
#NODE_ENV=production
#NODE_ENV=test

DEV_USERNAME=root
DEV_PASSWORD=
DEV_DATABASE=express-office-lunch
DEV_HOST=127.0.0.1
DEV_PORT=3306

TEST_USERNAME=root
TEST_PASSWORD=
TEST_DATABASE=express-office-lunch-testing
TEST_HOST=127.0.0.1
TEST_PORT=3306

PRODUCTION_USERNAME=
PRODUCTION_PASSWORD=
PRODUCTION_DATABASE=
PRODUCTION_HOST=
PRODUCTION_PORT=
```
Ensure the **NODE_ENV** variable is equal to dev.

Start MYSQL in your computer, and in the root directory, execute:
```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed --seed 20220627232058-settings.js
npx sequelize-cli db:seed --seed 20220628215202-groups.js
```
The "settings" and "groups" initial data are required by the project.

### Optional
If you want to insert multiple data in order to see how the project works. You can execute instead:
```
npx sequelize-cli db:seed:all
```
If you want to undo all the seeders data, you can execute:
```
npx sequelize-cli db:seed:undo:all
```

Finally, you just need to execute:
```
npm run dev
```
And the server will start on port 3001

## Production
You need to configure exactly the same as "dev mode". The difference is that you need to configure the **NODE_ENV** variable to "production", and instead of executing *npm run dev*, execute:
```
npm run start
```

## Environment
You can set all the **DEV_**, **TEST_**, **PRODUCTION_** variables with their corresponding values. The project will read whatever the environment configured in **NODE_ENV** is.

## Prerequisites
```
node@v16.15.0 or higher
npm@8.5.5 or higher
```

## Features
* Node Backend server with express.js
* RESTful API
* ORM project with sequelize
* Well organized project, with routes, controllers, middlewares, and models
* Crons functions
* Database seeders to fill the database with random data (for testing purposes)

## Technologies
* node.js with express.js framework
* JWT Authentication
* ORM with sequelize
* node-cron 
* MYSQL
* Database migrations
* Database seeders