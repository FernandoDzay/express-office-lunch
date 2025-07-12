FROM node:16
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g dotenv-cli
RUN apt-get update && apt-get install -y cron
RUN echo "0 1 * * * cd /app && /usr/local/bin/npx sequelize-cli db:seed:undo:all && /usr/local/bin/npx sequelize-cli db:seed:all" > /etc/cron.d/sequelize-cron
RUN chmod 0644 /etc/cron.d/sequelize-cron
RUN crontab /etc/cron.d/sequelize-cron
RUN dotenv -e .env -- node -e "console.log(process.env.PRODUCTION_HOST || 'NO HOST')"
RUN dotenv -e .env -- npx sequelize-cli db:migrate
RUN dotenv -e .env -- npx sequelize-cli db:seed:undo:all
RUN dotenv -e .env -- npx sequelize-cli db:seed:all

EXPOSE 3001

CMD cron && npm start

# docker build -t express-office-lunch .
# docker run -d -p 3012:3001 --name express-office-lunch express-office-lunch



# docker container stop express-office-lunch
# docker container rm express-office-lunch
# docker compose up