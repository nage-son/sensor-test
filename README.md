# BeagleBone Black, Raspberry Pi, Intel Edison별 센서 샘플 코드
## Raspberry Pi
### wiringPi 설치
[wiringPi](http://wiringpi.com/)는 Raspberry Pi에서 C로 개발시 사용하는 라이브러리로 아래의 설치방법을 참고 하시면 되며, 보다 자세한 내용은 [설치법](http://wiringpi.com/download-and-install/)에 기술되어 있습니다.

```bash
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install git-core
$ git clone git://git.drogon.net/wiringPi
$ cd wiringPi
$ git pull origin
$ sudo ./build
```

## Beaglebone Black
### BBBIOlib 설치
[BBBIOlib](https://github.com/VegetableAvenger/BBBIOlib)는 Beaglebone Black에서 C로 개발시 사용하는 라이브러리로 아래의 설치방법을 참고하시면 되며, 보다 자세한 내용은 [Github 페이지](https://github.com/VegetableAvenger/BBBIOlib)에 기술되어 있습니다.

```bash
# 아래의 명령어는 root 권한으로 실행하셔야 합니다.
$ git clone git@github.com:VegetableAvenger/BBBIOlib.git
$ cd BBBIOlib
$ make
$ cd BBBio_lib
$ cp libBBBio.a /usr/lib
$ cp *.h /usr/include
```