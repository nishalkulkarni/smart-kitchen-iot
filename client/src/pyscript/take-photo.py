from picamera import PiCamera
from time import sleep

camera = PiCamera()
camera.resolution = (100, 100)

for i in range(5):
    camera.capture('/home/pi/Desktop/smart-kitchen-iot/client/image%s.jpg' % i)
    sleep(2)
