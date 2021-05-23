import os
from time import sleep
from datetime import datetime
import pyrebase

arch_type = os.uname()[4][:3]
if (arch_type == 'arm'):
    from picamera import PiCamera
    import RPi.GPIO as GPIO
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(10, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
else:
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
    import pygame
    import pygame.camera
    pygame.camera.init()
    pygame.camera.list_cameras()

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


try:
    # print("pushed")
    now = datetime.now()
    dt = now.strftime("%d%m%Y%H:%M:%S")
    name = dt+".jpg"

    if (arch_type == 'arm'):
        camera = PiCamera()
        camera.resolution = (1280, 720)
        camera.capture(name)
        camera.close()
    else:
        cam = pygame.camera.Camera("/dev/video0", (640, 480))
        cam.start()
        img = cam.get_image()
        pygame.image.save(img, name)

    # print(name+" saved")
    arr = storage.child(name).put(name)
    downloadToken = arr['downloadTokens']
    print(storage.child(name).get_url(downloadToken))
    # print("Image sent")
    os.remove(name)
    # print("File Removed")
    sleep(2)

except:
    print("Error, Quiting.")
