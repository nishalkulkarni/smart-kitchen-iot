#include "DHT.h"
#include <SoftwareSerial.h>

#define PIEZOPIN 7

#define DHTPIN 8
#define DHTTYPE DHT11

#define FANPIN 10

String server = "http://192.168.0.105:9000";
String uri = "/livefeed";

SoftwareSerial esp8266(2, 3); // RX, TX

#define serialCommunicationSpeed 9600

#define DEBUG true

int redLED = 12;
int greenLED = 11;

String postData = "";

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    pinMode(redLED, OUTPUT);
    pinMode(greenLED, OUTPUT);
    pinMode(FANPIN, OUTPUT);

    digitalWrite(redLED, HIGH);
    digitalWrite(greenLED, HIGH);

    Serial.begin(serialCommunicationSpeed);
    esp8266.begin(serialCommunicationSpeed);
    InitWifiModule();

    dht.begin();

    digitalWrite(greenLED, LOW);
}

void loop() {
    postData = "";
    
    // Gas and Voltage
    updateGasVoltage();

    // Temperature and Humidity
    updateHumidityTemp();
    delay(2000);

    if (esp8266.available()) { 
        Serial.println("esp is available");
        httppost(postData);
    }
    
//    // TCP
//    if (esp8266.available()) {
//        if (esp8266.find("+IPD,")) {
//            delay(1000);
//            int connectionId = esp8266.read() - 48;
//            esp8266.find("pin=");
//            int pinNumber = (esp8266.read() - 48) * 10;
//            pinNumber = pinNumber + (esp8266.read() - 48);
//            int statusLed = (esp8266.read() - 48);
//            digitalWrite(pinNumber, statusLed);
//
//            Serial.println(connectionId);
//            Serial.print(pinNumber);
//            Serial.print("      ");
//            Serial.println(statusLed);
//            String closeCommand = "AT+CIPCLOSE=";
//            closeCommand += connectionId;
//            closeCommand += "\r\n";
//            sendData(closeCommand, 1000, DEBUG);
//        }
//    }
}

String sendData(String command, const int timeout, boolean debug) {
    String response = "";
    esp8266.print(command);
    long int time = millis();
    while ((time + timeout) > millis()) // excute only whitin 1 second.
    {
        while (esp8266.available()) {
            char c = esp8266.read();
            response += c;
        }
    }
    if (debug) {
        Serial.print(response);
    }
    return response; // return the String response.
}

void InitWifiModule() {
    sendData("AT\r\n", 2000, DEBUG);
    sendData("AT+GMR\r\n", 2000, DEBUG);
//    sendData("AT+UART_DEF=9600,8,1,0,0\r\n", 2000, DEBUG);
//    sendData("AT+RST\r\n", 2000, DEBUG);
    delay(1000);

    // set the ESP8266 WiFi mode to station mode.
    sendData("AT+CWMODE=1\r\n", 1500, DEBUG); 
    delay(2000);

    sendData("AT+SLEEP=0\r\n", 1500, DEBUG); 
    delay(2000);

    sendData("AT+CWLAP\r\n", 6500, DEBUG); 
    delay(6500);
    
    // connect to the WiFi network.
    sendData("AT+CWJAP=\"Nishal2.4\",\"Nishal2000\"\r\n", 6000, DEBUG);
    delay(6000);
    
    // Show IP Address, and the MAC Address.
    sendData("AT+CIFSR\r\n", 3500, DEBUG); 
    delay(2000);
    
    // Multiple conections.
    sendData("AT+CIPMUX=1\r\n", 1500, DEBUG); 
    delay(1000);
    
//    sendData("AT+CIPSERVER=1,80\r\n", 1500, DEBUG);
}

void updateGasVoltage() {
  // Gas Leak Detector
    float sensorValue = analogRead(A0);
    float sensorVoltage = sensorValue / 1024 * 5.0;

    postData += "gasvolt: "+ String(sensorVoltage) + ",";

    if (sensorVoltage > 3.6) {
          // Buzzer
          tone(PIEZOPIN, 1000, 5000);
    
          //    Fan simulator
          digitalWrite(FANPIN, HIGH);
          Serial.println("fan high");
          delay(4000);
          digitalWrite(FANPIN, LOW);
          Serial.println("fan low");
          delay(4000);
    }
    delay(2000);

}

void updateHumidityTemp() {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();

    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t)) {
        Serial.println(F("Failed to read from DHT sensor!"));
        return;
    } else {
        // Compute heat index in Celsius (isFahreheit = false)
        float hic = dht.computeHeatIndex(t, h, false);

        postData += "temperature: " + String(t) + ",humidity: " + String(h) +
                      ",heatindex: " + String(hic);
    }
}

void httppost(String data) {

    String postRequest = "POST " + uri + " HTTP/1.1\r\n" + "Host: " + server +
                         "\r\n" + "Accept: *" + "/" + "*\r\n" +
                         "Content-Length: " + postData.length() + "\r\n" +
                         "Content-Type: application/json\r\n" +
                         "\r\n{" + postData + "}\r\n";

    // determine the number of caracters to be sent.
    String sendCmd = "AT+CIPSEND="+String(postRequest.length())+"\r\n";
    Serial.print(sendCmd);
    sendData(sendCmd, 2500, DEBUG); 
    delay(500);
        
//    esp8266.print(sendCmd);
//    esp8266.println(postRequest.length());


//        Serial.println(postRequest);
        Serial.println(postData);

    if (esp8266.find(">")) {
        Serial.println("Sending..");
        esp8266.print(postRequest);
    }
    delay(3000);

    if (esp8266.find("SEND OK")) {
        Serial.println("Packet sent");
    }

    delay(3000);
    
    while (esp8266.available()) {
        String tmpResp = esp8266.readString();
        Serial.println(tmpResp);
    }
    esp8266.println("AT+CIPCLOSE");
}
