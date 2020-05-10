# garage-plate-detection

### Objective
Use a network camera and raspberry pi to detect if vehicle is present in a garage.

### Techonlogies 
- docker
- Wyze Cam V2 (Beta firmware for RTSP)
- openalpr
- express
- ffmpeg

# Running

```shell
docker run -it -p 8080:8080 -e CAM_USER="user" -e CAM_PASS="pass" -e CAM_ADDRESS="adress" seanboult/gpd
```