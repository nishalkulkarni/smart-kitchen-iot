#include "DHT.h"
#include <SoftwareSerial.h>

#define PIEZOPIN 7

#define DHTPIN 8
#define DHTTYPE DHT11

#define FANPIN 10

String server = "http://192.168.0.104:3000";
String uri = "/livefeed";

SoftwareSerial esp8266(2, 3); // RX, TX

#define serialCommunicationSpeed 9600

#define DEBUG true

int redLED = 12;
int greenLED = 11;

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

//    dht.begin();

    digitalWrite(greenLED, LOW);
}

void loop() {
//    Fan simulator
    digitalWrite(FANPIN, HIGH);
    Serial.println("fan high");
    delay(4000);
    digitalWrite(FANPIN, LOW);
    Serial.println("fan low");
    delay(4000);

// Gas Leak Detector
    float sensorVoltage; 
    float sensorValue;
   
    sensorValue = analogRead(A0);
    sensorVoltage = sensorValue/1024*5.0;
   
    Serial.print("sensor voltage = ");
    Serial.print(sensorVoltage);
    Serial.println(" V");
    delay(2000);

// Buzzer
  tone(PIEZOPIN, 1000, 500);

// Temperature and Humidity
  postHumidityTemp();
  delay(2000);

// TCP 
    if (esp8266.available()) {
        if (esp8266.find("+IPD,")) {
            delay(1000);
            int connectionId = esp8266.read() - 48;
            esp8266.find("pin=");
            int pinNumber = (esp8266.read() - 48) * 10;
            pinNumber = pinNumber + (esp8266.read() - 48);
            int statusLed = (esp8266.read() - 48);
            digitalWrite(pinNumber, statusLed);

            Serial.println(connectionId);
            Serial.print(pinNumber);
            Serial.print("      ");
            Serial.println(statusLed);
            String closeCommand = "AT+CIPCLOSE=";
            closeCommand += connectionId;
            closeCommand += "\r\n";
            sendData(closeCommand, 1000, DEBUG);
        }
    }
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
    sendData("AT+CWJAP=\"Nishal2.4\",\"Nishal2000\"\r\n", 2000,
             DEBUG); // connect to the WiFi network.
    delay(3000);
    sendData("AT+CWMODE=1\r\n", 1500,
             DEBUG); // set the ESP8266 WiFi mode to station mode.
    delay(1000);
    sendData("AT+CIFSR\r\n", 3500,
             DEBUG); // Show IP Address, and the MAC Address.
    delay(1000);
    sendData("AT+CIPMUX=1\r\n", 1500, DEBUG); // Multiple conections.
    delay(1000);
    sendData(
        "AT+CIPSERVER=1,80\r\n", 1500,
        DEBUG); 
}

void postHumidityTemp() {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow
    // sensor)
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

        String data = "temperature=" + String(t) + "&humidity=" + String(h) +
                      "&heatindex=" + String(hic);
        Serial.print(F("Humidity: "));
        Serial.print(h);
        Serial.print(F("%  Temperature: "));
        Serial.print(t);
        Serial.print(F("°C "));
        Serial.print(F(" Heat index: "));
        Serial.print(hic);
        Serial.println(F("°C "));

//        Serial.println(data);
//        httppost(data);
        delay(2000);
    }
}

void httppost(String data) {

    String postRequest = "POST " + uri + " HTTP/1.0\r\n" + "Host: " + server +
                         "\r\n" + "Accept: *" + "/" + "*\r\n" +
                         "Content-Length: " + data.length() + "\r\n" +
                         "Content-Type: application/x-www-form-urlencoded\r\n" +
                         "\r\n" + data;

    // determine the number of caracters to be sent.
    String sendCmd = "AT+CIPSEND=";

    esp8266.print(sendCmd);
    esp8266.println(postRequest.length());
    delay(500);

//    Serial.println(postRequest);

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
