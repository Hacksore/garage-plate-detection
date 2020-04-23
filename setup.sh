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
platform=$(uname -m)
if [[ $platform == "arm6l" ]]; then
  curl -o $HOME/node-v10.20.1-linux-armv6l https://nodejs.org/dist/latest-v10.x/node-v10.20.1-linux-armv6l.tar.gz
  tar -xzf $HOME/node-v10.20.1-linux-armv6l.tar.gz
  sudo ln -s $HOME/node-v10.20.1-linux-armv6l/bin/npm /usr/local/bin
  sudo ln -s $HOME/node-v10.20.1-linux-armv6l/bin/node /usr/local/bin
else 
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# install pm2
npm install -g pm2

# install deps
npm install 

# install pm2 script
pm2 start $CURRENT_DIR/server.js