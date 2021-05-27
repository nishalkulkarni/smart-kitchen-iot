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

dec_gv = [1.92,1.95,1.97,1.98,2.05,2.12,2.19,2.22,2.27,2.30,2.36,2.42,2.48,2.52]

dec_gv.reverse()

for i in range(len(dec_gv)):
    humidity = round(random.uniform(53,54),2)
    update_firebase(dec_gv[i], round(random.uniform(29.2, 29.8), 2), humidity, round(random.uniform(31.53, 31.88), 2))

while True:
    gasvolt = round(random.uniform(1.92, 1.95), 2)
    humidity = round(random.uniform(53, 54), 2)
    temperature = round(random.uniform(29.2, 29.8), 2)
    heatindex = round(random.uniform(31.53, 31.88), 2)
    update_firebase(gasvolt, temperature, humidity, heatindex)
    time.sleep(2)
