const int led_1 = 10;     //green
const int led_2 = 11;     //red
const int led_3 = 9;      //blue
const int pirPin = 2;                 // PIR Out pin
const int isObstaclePin = 5; // This is our input pin
const int pingPin = 6; // Trigger Pin of Ultrasonic Sensor
const int echoPin = 7; // Echo Pin of Ultrasonic Sensor
const int buzzer = 3;//the pin of the active buzzer

bool range, sound, pass;
int isObstacle = HIGH; // HIGH MEANS NO OBSTACLE
int pirStat = 0;                   // PIR status
int val_comp = 0;
int count = 0, num = 0, cnt = 1;
int interval = 5000;
unsigned char x=0;
unsigned long previousMillis, currentMillis;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(led_1, OUTPUT);
  pinMode(led_2, OUTPUT);
  pinMode(led_3, OUTPUT);
  pinMode(buzzer,OUTPUT);//initialize the buzzer pin as an output
  pinMode(pingPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pirPin, INPUT);
  pinMode(isObstaclePin, INPUT);

  delay(1000);

}

void loop() {
  // put your main code here, to run repeatedly:
  pirStat = digitalRead(pirPin);
  delay(500);
  bool search = true;
  pass = true;

  int val_allow = filter(pirStat);
  num++;

  if(cnt!=count || num < 1000) {
    if(count<0) {
      count = 0;
    }
    Serial.print(count); Serial.print("\n");
    cnt = count;
    num = 0;
  }
  
  if (pirStat && val_allow) {
    previousMillis = millis();
    digitalWrite(led_3, HIGH);

    if(count >= 5) {
      sound = true;
      pass = false;
      siren();
    }
    
    while(search) {
      currentMillis = millis();
      isObstacle = digitalRead(isObstaclePin);
      range = ultraSonic();
      
      if(currentMillis - previousMillis < interval) {
        if(!isObstacle && pass) {
          digitalWrite(led_3,LOW);
          indLED(led_1);
          count++;
          search = false;
        }
        else if (range) {
          digitalWrite(led_3,LOW);
          indLED(led_2);
          count--;
          search = false;
        }
      }
      else {
        search = false;
        digitalWrite(led_3,LOW);
      }
    }
  }
}

bool ultraSonic() {
  long duration, cm;
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(pingPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  cm = duration/ 29 / 2;

  if (cm<10){
    return true;
  }
  else {
    return false;
  }
}

int filter(int param) {
  if (param == 1 && param!=val_comp) {
    val_comp = 1;
    return HIGH;
  }
  else if (param == 1 && param==val_comp) {
    return LOW;
  }
  else {
    val_comp = 0;
    return LOW;
  }
}

void indLED(int led) {
  digitalWrite(led, HIGH);
  delay(1000);
  digitalWrite(led, LOW);
}

void siren() {
  while(sound) {
    x++;
    for(int i=0;i<80;i++) {
      digitalWrite(buzzer,HIGH);
      delay(1);//wait for 1ms
      digitalWrite(buzzer,LOW);      
      delay(1);//wait for 1ms    
    }
  
    //output another frequency
  
    for(int i=0;i<100;i++) {    
        digitalWrite(buzzer,HIGH);      
        delay(5);//wait for 2ms      
        digitalWrite(buzzer,LOW);      
        delay(5);//wait for 2ms    
    }

    if(x>2) {
      sound = false;
      x = 0;
    }
  }
}
