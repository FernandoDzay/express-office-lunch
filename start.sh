#!/bin/bash

# Iniciar el cron en segundo plano
cron

# Mostrar el contenido del cron configurado (opcional para depuración)
echo "=== CRON JOB ACTIVO ==="
crontab -l

# Redirigir la salida del cron a un archivo de log
touch /var/log/cron.log
tail -f /var/log/cron.log &

# Ejecutar la aplicación Node.js
npm start
