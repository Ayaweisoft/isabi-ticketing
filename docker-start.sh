#!/bin/sh
set -e

echo "Starting i-Sabi meta server..."
node /app/meta-server.js &

echo "Starting nginx..."
exec nginx -g "daemon off;"
