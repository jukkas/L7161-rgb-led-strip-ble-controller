# Web Bluetooth example to control RGB Led Strip controller named L7161

This is a rough example how to control Bluetooth a Low Energy RGB Led Strip controller named L7161.

This uses [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) ,
which seems to be implemented only in some Chromium based browsers (and possibly only behind developer flags).

Install these files into a https enabled (or localhost) webserver, and use Chromium based browser to control
L7161 near your device.

**Implemented functions**

- On / Off
- Set static color red/green/blue/white

Controller seems to support also some "scenes", like Breath, Thunder, Candle, RainbowFade, which I have not
reverse engineered and implemented in this example.

## Background

So, I bought a cheap RGB Led Strip with a bluetooth controller from Aliexpress.
My intention was/is to some day integrate it to my home automation system, so
I wanted a controller that would have some documented protocol/source code to control it with my own
applications. And I ordered one that I thought was the same as documented in a Github
repository https://github.com/8none1/bj_led .

What I received was not the same model. Well, this happens a lot with cheap electronics purchases...

BLE name of the controller was L7161,
and GATT Services and Characteristics were different from that BJ_LED that I expected.
And a quick search of Github did not return any usable code.  

This one works with an Android app called "Hi Lighting" by Shenzhen Jianjiaweidu Technology Co Ltd.
So I used the method of installing the app, enabling HCI snooping in Android,
executing basic led control operations in the app and then staring the resulting dump file in Wireshark.

Luckily figuring the basic functions (on/off, static color) was rather easy.

## Bluetooth LE protocol

BLE Advertisement:
```
Complete local name: L7161
Manufacturer data: Company id: DFAF data: 99 02 01 23 4c 58 5a 4d 42 4c 4c 31 34 30
```

Relevant GATT Services and Characteristics:
```
Service 6e400001-b5a3-f393-e0a9-e50e24dcca9e (Nordic UART service)
    Characteristic: 6e400002-b5a3-f393-e0a9-e50e24dcca9e (write)
```

### Turn strip on and off

Write (not writeWithoutResponse) into that Characteristic above bytes (written here in hexadecimal): 

```
55 01 02 01 (on)
55 01 02 01 (off)
```

### Static color Red, Green, Blue

Write hexbytes `55 07 01` *red* *green* *blue*

where values of RGB are between 0-255 (0-0xFF). E.g. to set strip green send hexbytes `55 07 01 00 FF 00`
and to "white": `55 07 01 FF FF FF`
All other colors are of cause a mix of RGB.

### Others

Controller supports other modes too, but I have not reverse engineered them.
