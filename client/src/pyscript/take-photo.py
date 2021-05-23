import pyrebase
from picamera import PiCamera
import os
from time import sleep
from datetime import datetime
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)


firebaseConfig = {
    'apiKey': "AIzaSyBfLfJ3i37XQtRMF1rfh6rtvSRW_RfakIk",
    'authDomain': "smart-kitchen-2100c.firebaseapp.com",
    'databaseURL': "https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app",
    'projectId': "smart-kitchen-2100c",
    'storageBucket': "smart-kitchen-2100c.appspot.com",
    'messagingSenderId': "155436361699",
    'appId': "1:155436361699:web:c01201c83ce4b568ec22d6",
    'measurementId': "G-2RR1Z9N3KR"
}

firebase = pyrebase.initialize_app(firebaseConfig)

storage = firebase.storage()


camera = PiCamera()
camera.resolution = (1280, 720)

while True:
    try:
        if GPIO.input(10) == GPIO.HIGH:
            print("pushed")
            now = datetime.now()
            dt = now.strftime("%d%m%Y%H:%M:%S")
            name = dt+".jpg"
            camera.capture(name)
            print(name+" saved")
            storage.child(name).put(name)
            print("Image sent")
            os.remove(name)
            print("File Removed")
            sleep(2)

    except:
        print("Error, Quiting.")
        camera.close()

for i in range(5):
    camera.capture('/home/pi/Desktop/smart-kitchen-iot/client/image%s.jpg' % i)
    sleep(2)
