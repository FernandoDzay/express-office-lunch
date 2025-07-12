FROM node:16
WORKDIR /app
COPY . .
RUN npm install
RUN apt-get update && apt-get install -y cron
RUN echo "0 1 * * * cd /app && /usr/local/bin/npx sequelize-cli db:seed:undo:all && /usr/local/bin/npx sequelize-cli db:seed:all" > /etc/cron.d/sequelize-cron
RUN chmod 0644 /etc/cron.d/sequelize-cron
RUN crontab /etc/cron.d/sequelize-cron
RUN export $(cat .env | xargs) && npx sequelize-cli db:migrate
RUN export $(cat .env | xargs) && npx sequelize-cli db:seed:undo:all
RUN export $(cat .env | xargs) && npx sequelize-cli db:seed:all

EXPOSE 3001

CMD cron && npm start

# docker build -t express-office-lunch .
# docker run -d -p 3012:3001 --name express-office-lunch express-office-lunch