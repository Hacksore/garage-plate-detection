#!/bin/bash
# script to setup the raspberry pi

# CURRENT_DIR
CURRENT_DIR=$(cwd)

# add config vars
cat .env >> $HOME/.bash_profile

sudo apt-get update -y

# install openalpr
sudo apt-get install -y openalpr openalpr-daemon openalpr-utils libopenalpr-dev

# install nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# install pm2
npm install -g pm2

# install pm2 script
pm2 start $CURRENT_DIR/server.js