#!/bin/bash
# Validate that the application is running
# Example: Check if the port 5000 is open (adjust based on your app configuration)
if curl -s http://localhost:5000 > /dev/null; then
  echo "Application is running"
else
  echo "Application is not running"
  exit 1
fi