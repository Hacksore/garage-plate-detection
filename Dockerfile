FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y openalpr openalpr-daemon openalpr-utils libopenalpr-dev ffmpeg curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN which ffmpeg

EXPOSE 8080

ENTRYPOINT node server.js