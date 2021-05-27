import urllib
import http.client
import json
import os
from functools import partial
import random
import time
from firebase import firebase

firebase = firebase.FirebaseApplication('https://smart-kitchen-2100c-default-rtdb.asia-southeast1.firebasedatabase.app/', None)


def update_firebase(gasvolt, temperature, humidity, heatindex):
    if gasvolt is not None and humidity is not None and temperature is not None:
        time.sleep(4)
        str_gas = '{0:0.2f} V '.format(gasvolt)
        str_temp = '{0:0.2f} *C '.format(temperature)
        str_hum = '{0:0.2f} %'.format(humidity)
        str_hi = '{0:0.2f} *C'.format(heatindex)
        print("gasvolt:",str_gas,"temperature:",str_temp,"humidity:",str_hum,"heatindex:",str_hi)
    else:
        print('Failed to get reading. Try again!')
        time.sleep(4)

    data = {"gasvolt": gasvolt, "temperature": temperature, "humidity": humidity, "heatindex": heatindex}
    result = firebase.post('/sensor/data', data)
    print(result)

inc_temp = [30.2,30.4,30.5,30.8,31.2,31.7,32.5,33.1,33.6,34.0,34.1,34.2,34.5,34.7]
inc_hi = [31.3,31.1,31.4,31.6,32.3,32.6,33.3,34.0,34.4,35.2,35.2,35.4,35.5,35.7]

for i in range(len(inc_temp)):
    humidity = round(random.uniform(50,51),2)
    update_firebase(round(random.uniform(1.9, 1.95), 2), inc_temp[i], humidity, inc_hi[i])

while True:
    gasvolt = round(random.uniform(1.9, 1.95), 2)
    humidity = round(random.uniform(50,51),2)
    temperature = round(random.uniform(34.5,34.8),2)
    heatindex = round(random.uniform(32.53,32.88),2)
    update_firebase(gasvolt, temperature, humidity, heatindex)
    time.sleep(2)
