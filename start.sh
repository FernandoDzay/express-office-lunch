#!/bin/sh

# Inicia cron en segundo plano
cron

# Cola los logs del cron al stdout del contenedor
touch /var/log/cron.log
tail -f /var/log/cron.log &

# Inicia tu app
npm start
