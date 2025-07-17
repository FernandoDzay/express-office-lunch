FROM node:16-bullseye

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar el código fuente y el script de inicio
COPY . .
COPY start.sh .

# Instalar dependencias del proyecto y herramientas necesarias
RUN npm install
RUN npm install -g dotenv-cli
RUN apt-get update && apt-get install -y cron

# Configurar el cron job
RUN echo "0 1 * * * cd /app && /usr/local/bin/npx sequelize-cli db:seed:undo:all && /usr/local/bin/npx sequelize-cli db:seed:all >> /var/log/cron.log 2>&1" > /etc/cron.d/sequelize-cron

# Asignar permisos adecuados al archivo de cron
RUN chmod 0644 /etc/cron.d/sequelize-cron

# Registrar el cron job
RUN crontab /etc/cron.d/sequelize-cron

# Asegurarse de que el script tenga permisos de ejecución
RUN chmod +x /app/start.sh

RUN touch /var/log/cron.log

# Exponer el puerto de la aplicación
EXPOSE 3001

# Comando de inicio
CMD ["./start.sh"]

# docker build -t express-office-lunch .
# docker run -d -p 3012:3001 --name express-office-lunch express-office-lunch



# docker container stop express-office-lunch
# docker container rm express-office-lunch
# docker image rm express-office-lunch
# docker compose up -d