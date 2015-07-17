#include <SoftwareSerial.h>
#define rxPin 6 // connect to TX of other device now is 6
#define txPin 5 // connect to RX of other device now is 5

SoftwareSerial tesselBridge =  SoftwareSerial(rxPin, txPin);

char Data[64];
int Pointer = 0;

unsigned char i;
unsigned char j;

/*Port Definitions*/
int Max7219_pinCLK = 10;
int Max7219_pinCS = 9;
int Max7219_pinDIN = 8;

 
void Write_Max7219_byte(unsigned char DATA) 
{   
            unsigned char i;
	   digitalWrite(Max7219_pinCS,LOW);		
	   for(i=8;i>=1;i--)
          {		  
             digitalWrite(Max7219_pinCLK,LOW);
             digitalWrite(Max7219_pinDIN,DATA&0x80);// Extracting a bit data
             DATA = DATA<<1;
             digitalWrite(Max7219_pinCLK,HIGH);
           }                                 
}
 
 
void Write_Max7219(unsigned char address,unsigned char dat)
{
        digitalWrite(Max7219_pinCS,LOW);
        Write_Max7219_byte(address);           //addressï¼Œcode of LED
        Write_Max7219_byte(dat);               //dataï¼Œfigure on LED 
        digitalWrite(Max7219_pinCS,HIGH);
}

void StringToByteArray()
{
  int p;
  int s;
  
  //clear the variable
  unsigned char disp1[8] = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
  
  for (s = 0; s < 8; s++)
  {
    for(p = 0; p < 8; p++)
    {
      char Value = Data[s * 8 + p];
      
      //do nothing
      if(Value == '0')
      {
      }
      if(Value == '1')
      {
        disp1[s] = disp1[s] | (128 >> p);
      }
    }
  }
  
  //write to the bus
  int q;
  for(q = 0; q < 8; q++)
  {
    
    Serial.print(disp1[q]);
    Serial.print(", ");
    
    //dont break it
    Write_Max7219(q + 1, disp1[q]);
  }
  Serial.println(" ");
}
 
void Init_MAX7219(void)
{
 Write_Max7219(0x09, 0x00);       //decoding ï¼šBCD
 Write_Max7219(0x0a, 0x03);       //brightness 
 Write_Max7219(0x0b, 0x07);       //scanlimitï¼›8 LEDs
 Write_Max7219(0x0c, 0x01);       //power-down modeï¼š0ï¼Œnormal modeï¼š1
 Write_Max7219(0x0f, 0x00);       //test displayï¼š1ï¼›EOTï¼Œdisplayï¼š0
}


void setup()  
{
  // open serial port at 9600 baud
  Serial.begin(9600);
  Serial.println("Starting up...");

  // set the data rate for the SoftwareSerial port
  tesselBridge.begin(9600);
  
  //setup the led matrix
  pinMode(Max7219_pinCLK,OUTPUT);
  pinMode(Max7219_pinCS,OUTPUT);
  pinMode(Max7219_pinDIN,OUTPUT);
  delay(50);
  Init_MAX7219();
}

void loop() // run over and over
{
  if (tesselBridge.available())
  {
    char Read = tesselBridge.read();
    
    if(Read == 's')
    {
      Pointer = 0;
    }
    else if(Read == 'e')
    {
      //data is filled! execute some code!
      Serial.println(Data);
      
      StringToByteArray();
    }
    else
    {
      Data[Pointer] = Read;
      Pointer++;
      //add data to the 
    }
  }
}
