const express = require('express');
const app = express();
const { execSync } = require('child_process');
const { CAM_USER, CAM_PASS, CAM_ADDRESS } = process.env;

let detectedOutput = {
  results: []
};

app.get('/', (req, res) => {
  const results = detectedOutput.results
  const detected = results.length > 0;
  const plates = results.length > 0 ? results[0].candidates : [];
  
  return res.send({ 
    detected,
    plates
  });
});

const createImageFromStream = () => {
  const command = `ffmpeg -hide_banner -loglevel panic -y -i rtsp://${CAM_USER}:${CAM_PASS}@${CAM_ADDRESS} -vframes 1 /tmp/output.jpg > /dev/null`;
  execSync(command);
  detectedOutput = JSON.parse(execSync('alpr /tmp/output.jpg -j').toString());
}

// take image from stream
createImageFromStream();

// update every minute
setInterval(() => createImageFromStream(), 1000 * 60);

app.listen(8080, '0.0.0.0');