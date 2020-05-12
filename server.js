const express = require('express');
const app = express();
const { spawn } = require('child_process');
const { CAM_USER, CAM_PASS, CAM_ADDRESS } = process.env;

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

  screenshotCommand.on('exit', () => processImage());
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
setInterval(() => createImageFromStream(), 1000 * 60);

app.listen(8080, '0.0.0.0');
