const express = require('express');
const app = express();
const { execSync } = require('child_process');
const { CAM_USER, CAM_PASS, CAM_ADDRESS } = process.env;

app.get('/', (req, res) => {
  const response = JSON.parse(execSync('alpr /tmp/output.jpg -j').toString());
  const detected = response.results.length > 0;
  
  return res.send({ 
    detected,
    plates: response.results[0].candidates
  });
});

const createImageFromStream = () => {
  const command = `ffmpeg -y -i rtsp://${CAM_USER}:${CAM_PASS}@${CAM_ADDRESS} -vframes 1 /tmp/output.jpg > /dev/null`;
  execSync(command);
}

// take image from stream
createImageFromStream();
setInterval(() => createImageFromStream(), 1000 * 60);

app.listen(8080, '0.0.0.0');