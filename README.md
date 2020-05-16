# garage-plate-detection

### Objective
Use a network camera and raspberry pi to detect if vehicle is present in a garage.

### Technologies 
- docker
- Wyze Cam V2 (Beta firmware for RTSP)
- openalpr
- express
- ffmpeg

# Running

```shell
docker run -d -p 8080:8080 -e CAM_USER="user" -e CAM_PASS="pass" -e CAM_ADDRESS="adress" seanboult/gpd
```

### Wyze Cam V2
So the beta has a flaw that it goes unstable and you need to restart the device the device to make work again. I'm getting around this by using IFTTT to restart the camera every hour.