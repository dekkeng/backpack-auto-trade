# backpack_auto_trade


Backpack auto trade script:


**Requirement:**
- Have more than 10 $USDC in backpack exchange
- Currently support only $SOL/$USDC pair
- Install [Nodejs](https://www.geeksforgeeks.org/installation-of-node-js-on-windows) (Version >= v18.16.0) , Git on your PC or VPS

----------------------------
How to use
----------------------------
1. Create account: [Backpack](https://backpack.exchange/refer/6ee71a32-9bf4-42fe-b13c-896c32745bc4)

2. Create backpack API: https://backpack.exchange/settings/api-keys

3. ```git clone https://github.com/dekkeng/backpack-auto-trade.git```

4. ```cd backpack-auto-trade```

5. ```cp .env.sample .env```

6. Edit ```.env``` file, change ```BACKPACK_API_KEY```, ```BACKPACK_API_SECRET```, ```PRICE_DIFF```

7. Start

```
npm i
```
```
npm start
```

Source from: [catsats](https://github.com/catsats)
