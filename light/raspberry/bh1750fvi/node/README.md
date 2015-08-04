# PWM library 설치
npm을 이용한 pi-blaster.js 설치전 pi-blaster daemon을 구동시켜야 합니다.

```bash
$ sudo apt-get install autoconf
$ git clone git@github.com:sarfata/pi-blaster.git
$ cd pi-blaster
$ ./autogen.sh
$ ./configure
$ make && sudo make install
```

해당 daemon을 삭제하기 위해서는 위의 폴더에서 `sudo make uninstall` 명령어를 실행하면 됩니다.    
위의 과정이 완료된 후 `npm install pi-blaster.js`를 실행하시면 됩니다.    
자세한 내용은 [공식 페이지](https://github.com/sarfata/pi-blaster)를 참고 바랍니다.