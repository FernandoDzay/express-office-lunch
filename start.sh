#!/bin/sh

# Crear archivo de log si no existe
touch /var/log/cron.log

# Inicia cron en segundo plano y redirige stdout y stderr al log
cron

# Cola los logs del cron al stdout del contenedor
tail -f /var/log/cron.log &

# Inicia tu app
npm start