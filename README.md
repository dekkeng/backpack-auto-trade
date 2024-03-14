# Backpack Auto Trade by DK

----------------------------
ผู้พัฒนา
----------------------------

ฝากกดติดตามด้วยนะครับ https://twitter.com/dekkeng

ต้องการสนับสนุนผู้พัฒนา สามารถเลี้ยงข้าวได้ที่กระเป๋า 0x8518DeaBD60cf3d8876463DA1471F81fE583c1Cd

ยินดีรับทุกเหรียญหลัก ของทุกเชนครับ ขอบคุณครับ

----------------------------
วิธีการติดตั้ง
----------------------------

**สำหรับรันบน Windows**

1. โหลด [Nodejs](https://nodejs.org/en/download/) v18+ ถ้ามีแล้วข้ามได้ ลงให้เรียบร้อย Next รัวๆ

2. โหลด [Git](https://git-scm.com/downloads) ลงให้เรียบร้อย Next รัวๆ

3. สมัครเปิดกระเป๋า Backpack ที่ https://backpack.exchange/signup?referral=6ee71a32-9bf4-42fe-b13c-896c32745bc4

4. Identity Verification (KYC) กระเป๋า Backpack ตามขั้นตอนบนหน้าเว็บให้เรียบร้อย

5. Create API key ที่ https://backpack.exchange/settings/api-keys คัดลอก Key, Secret เก็บไว้ก่อน

6. เติมเงินเข้ากระเป๋า Backpack อย่างน้อย 50 USDC

7. เปิด Powershell โดยกดปุ่ม Start แล้วพิมพ์ powershell แล้ว Enter

8. พิมพ์คำสั่งแต่ละคำสั่งแล้ว Enter ไปทีละบรรทัด

```git clone https://github.com/dekkeng/backpack-auto-trade.git```

```cd backpack-auto-trade```

```cp .env.sample .env```

```notepad .env```

แก้ไข ```BACKPACK_API_KEY```=keyที่จดไว้ข้อ 5 แทนตรงคำว่า ```YourKeyFromBackpack```

แก้ไข ```BACKPACK_API_SECRET```=secretที่จดไว้ข้อ 5 แทนตรงคำว่า ```YourSecretFromBackpack```

9. Ctrl + S เพื่อบันทึก แล้วปิด Notepad ไป

10. กลับไปที่หน้าต่าง Powershell แล้วพิมพ์คำสั่ง

```npm i```

```npm start```

11. บอทจะเริ่มทำการซื้อขาย สลับไปมา ระหว่าง SOL USDC

* ห้ามปิดหน้าต่างนี้ (ย่อได้) ถ้าปิดไป บอทจะหยุดทำงาน

* หากต้องการหยุดบอท สามารถปิดหน้าต่าง Powershell หรือกด Ctrl + C 2 ครั้ง ได้ ถ้าต้องการรันอีกครั้งให้พิมพ์คำสั่ง npm start ใหม่

* ผมไม่รับประกันเงินต้นว่าจะลดลงเท่าไหร่ หรือกำไร เพราะมูลค่าขึ้นอยู่กับจังหวะ และราคาของเหรียญด้วย

----------------------------

**Requirement:**
- Recommend at least $50 value in backpack exchange
- Install [Nodejs](https://nodejs.org/en/download/) (Version >= v18.16.0) , [Git](https://git-scm.com/downloads) on your PC or VPS

----------------------------
How to use
----------------------------
1. Create account: [Backpack](https://backpack.exchange/refer/6ee71a32-9bf4-42fe-b13c-896c32745bc4)

2. Create backpack API: https://backpack.exchange/settings/api-keys

3. ```git clone https://github.com/dekkeng/backpack-auto-trade.git``` or download zip file from Github and extract

4. ```cd backpack-auto-trade```

5. ```cp .env.sample .env```

6. Edit ```.env``` file, change config and save file

7. Start

```
npm i
```
```
npm start
```

----------------------------
Config list
----------------------------

```BACKPACK_API_KEY```          = Your Key From Backpack

```BACKPACK_API_SECRET```       = Your Secret From Backpack

```PRICE_DIFF```                = Different price from buy price to be use for ask price

```PRICE_DECREASE_INTERVAL```   = Interval to decrease ask price (minutes)

```PRICE_DECREASE_PERCENT```    = Percentage of PRICE_DIFF to decrease ask price each interval

```SYMBOL```                    = Symbol to trad (eg. SOL_USDC)

```MIN_SYMBOL_1```              = Minimum amount of 1st token that should be available (eg. 0.1 for SOL, 5 for USDC)

```MIN_SYMBOL_2```              = Minimum amount of 2nd token that should be available (eg. 0.1 for SOL, 5 for USDC)

----------------------------
VPS additional information
----------------------------
If you want to run this script on Linux/Ubuntu server, you can use screen to run this.

```
sudo apt install -y screen
```

```
screen -S backpack
```

```
npm start
```

```
Ctrl + D + A
```
Then you can close your console and the script will continue running on your server. If you want to reaccess the screen, you can use ```screen -r backpack``` to reopen it.
