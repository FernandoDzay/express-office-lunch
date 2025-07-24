FROM node:16-bullseye

WORKDIR /app
COPY . .

RUN npm install && npm install -g dotenv-cli
RUN apt-get update && apt-get install -y cron

# Logs y permisos
RUN touch /app/seed.log /app/cron-prueba.log /var/log/cron.log && chmod 666 /app/*.log

# Configurar cron job
RUN echo "0 1 * * * root cd /app && PATH=$PATH:/usr/local/bin /usr/local/bin/npx sequelize-cli db:seed:undo:all && PATH=$PATH:/usr/local/bin /usr/local/bin/npx sequelize-cli db:seed:all >> /app/seed.log 2>&1" > /etc/cron.d/sequelize-cron \
 && chmod 0644 /etc/cron.d/sequelize-cron

# NO uses crontab aquí. Cron escanea automáticamente /etc/cron.d/
# RUN crontab /etc/cron.d/sequelize-cron  <-- ELIMINAR

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3001
CMD ["./start.sh"]

# docker build -t express-office-lunch .
# docker run -d -p 3012:3001 --name express-office-lunch express-office-lunch



# docker container stop express-office-lunch
# docker container rm express-office-lunch
# docker image rm express-office-lunch
# docker compose up -d