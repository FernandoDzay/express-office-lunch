#!/bin/sh

# Iniciar cron
cron

# Log cron output
tail -f /app/seed.log /app/cron-prueba.log &

# Ejecutar la app
npm start