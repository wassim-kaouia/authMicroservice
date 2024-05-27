#!/bin/bash
# Navigate to the application directory
cd /home/ubuntu/app

# Stop any existing application instances
if [ -f app.pid ]; then
  sudo kill $(cat app.pid) || true
  rm app.pid
fi

# Start the application (modify according to your app's start command)
npm start &

# Save the PID of the application to a file
echo $! > app.pid