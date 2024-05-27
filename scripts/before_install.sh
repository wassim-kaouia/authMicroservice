#!/bin/bash
# Update package references
sudo apt-get update -y

# Install Node.js (if not already installed)
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 to manage the Node.js process
sudo npm install -g pm2

# Clean up previous versions of the app
sudo rm -rf /home/ubuntu/app/*