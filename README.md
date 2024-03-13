# backpack_auto_trade


Backpack auto trade script:


**Requirement:**
- Have more than 10 $USDC in backpack exchange
- Currently support only $SOL/$USDC pair
- Install [Nodejs](https://www.geeksforgeeks.org/installation-of-node-js-on-windows) (Version >= v18.16.0) , [Git](https://git-scm.com/downloads) on your PC or VPS

----------------------------
How to use
----------------------------
1. Create account: [Backpack](https://backpack.exchange/refer/6ee71a32-9bf4-42fe-b13c-896c32745bc4)

2. Create backpack API: https://backpack.exchange/settings/api-keys

3. ```git clone https://github.com/dekkeng/backpack-auto-trade.git``` or download zip file from Github and extract

4. ```cd backpack-auto-trade```

5. ```cp .env.sample .env```

6. Edit ```.env``` file, change 

```BACKPACK_API_KEY```          = Your Key From Backpack

```BACKPACK_API_SECRET```       = Your Secret From Backpack

```PRICE_DIFF```                = Different price from buy price to be use for ask price

```PRICE_DECREASE_INTERVAL```   = Interval to decrease ask price (minutes)

```PRICE_DECREASE_PERCENT```    = Percentage of PRICE_DIFF to decrease ask price each interval

7. Start

```
npm i
```
```
npm start
```


----------------------------
VPS additional information
----------------------------
If you want to run this script on VPS or server, you can use screen to run this.

1. 
```
sudo apt install -y screen
```
2. 
```
screen -S backpack
```
3. 
```
npm start
```
4. 
```
Ctrl + D + A
```
Then you can close your console and the script will continue running on your server. If you want to reaccess the screen, you can use ```screen -r backpack``` to reopen it.

Source from: [catsats](https://github.com/catsats)
