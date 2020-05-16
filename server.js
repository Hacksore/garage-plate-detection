const express = require('express');
const app = express();
const { spawn } = require('child_process');

const { CAM_USER, CAM_PASS, CAM_ADDRESS } = process.env;
const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || 60;

let detectedOutput = {
  results: [],
};
let lastUpdate = null;

app.get('/', (req, res) => {
  const results = detectedOutput.results;
  const detected = results.length > 0;
  const plates = detected > 0 ? results[0].candidates : [];

  return res.send({
    detected,
    plates,
    updated: lastUpdate,
  });
});

const createImageFromStream = () => {
  const screenshotCommand = spawn('ffmpeg', [
    '-hide_banner',
    '-loglevel',
    'panic',
    '-y',
    '-i',
    `rtsp://${CAM_USER}:${CAM_PASS}@${CAM_ADDRESS}`,
    '-vframes',
    '1',
    '/tmp/output.jpg',
  ]);

  screenshotCommand.on('exit', (exitCode) => {
    // don't do anything if we can't get an image from the stream
    if (exitCode > 0) {
      return;
    }

    processImage();
  });
};

const processImage = () => {
  const handle = spawn('alpr', ['/tmp/output.jpg', '-j']);
  handle.stdout.on('data', (data) => {
    detectedOutput = JSON.parse(data.toString());
    lastUpdate = Math.floor(new Date() / 1000);
  });
};

// take image from stream
createImageFromStream();

// update every minute
setInterval(() => createImageFromStream(), 1000 * REFRESH_INTERVAL);

app.listen(8080, '0.0.0.0');
