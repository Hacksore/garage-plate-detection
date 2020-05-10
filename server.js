const express = require('express');
const app = express();
const { spawn } = require('child_process');
const { CAM_USER, CAM_PASS, CAM_ADDRESS } = process.env;

let detectedOutput = {
  results: []
};

app.get('/', (req, res) => {
  const results = detectedOutput.results
  const detected = results.length > 0;
  const plates = detected > 0 ? results[0].candidates : [];
  
  return res.send({ 
    detected,
    plates,
    updated: Math.floor(new Date()/1000)
  });
});

const createImageFromStream = () => {
  const screenshotArgs = `-hide_banner -loglevel panic -y -i rtsp://${CAM_USER}:${CAM_PASS}@${CAM_ADDRESS} -vframes 1 /tmp/output.jpg`;
  const screenshotCommand = spawn('ffmpeg', screenshotArgs.split(' '));

  screenshotCommand.on('exit', (exitCode) => {
    const handle = spawn('alpr', ['/tmp/output.jpg', '-j']);
    handle.stdout.on('data', data => {
      detectedOutput = JSON.parse(data.toString());
    });
  })  

}

// take image from stream
createImageFromStream();

// update every minute
setInterval(() => createImageFromStream(), 1000 * 60);

app.listen(8080, '0.0.0.0');