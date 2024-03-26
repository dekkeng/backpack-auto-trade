"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backpack_client_1 = require("./backpack_client");

require('dotenv').config()

/// EDIT HERE ///
const API_KEY = process.env.BACKPACK_API_KEY
const API_SECRET = process.env.BACKPACK_API_SECRET
const PRICE_DIFF = process.env.PRICE_DIFF*1
const PRICE_DECREASE_INTERVAL = process.env.PRICE_DECREASE_INTERVAL*1
const PRICE_DECREASE_PERCENT = process.env.PRICE_DECREASE_PERCENT*1
const SYMBOL = process.env.SYMBOL
const MIN_SYMBOL_1 = process.env.MIN_SYMBOL_1*1
const MIN_SYMBOL_2 = process.env.MIN_SYMBOL_2*1
const QUANTITY_DECIMAL_1 = process.env.QUANTITY_DECIMAL_1*1
const QUANTITY_DECIMAL_2 = process.env.QUANTITY_DECIMAL_2*1
/////////////

if(API_KEY == '' || API_SECRET == '' || PRICE_DIFF == '' || PRICE_DECREASE_INTERVAL == '' || PRICE_DECREASE_PERCENT == '') {
    throw new Error(`Invalid config..`);
}
let balance_1 = 0;
let balance_2 = 0;
let lastPriceAsk = 0;
let lastPriceTime = new Date().getTime();
let userbalance = {};
let symbol_1 = SYMBOL.split('_')[0].toUpperCase();
let symbol_2 = SYMBOL.split('_')[1].toUpperCase();


function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMinute = date.getMinutes();
    var strSecond = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
    }
    if (strMinute >= 0 && strMinute <= 9) {
        strMinute = "0" + strMinute;
    }
    if (strSecond >= 0 && strSecond <= 9) {
        strSecond = "0" + strSecond;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHour + seperator2 + strMinute
        + seperator2 + strSecond;
    return currentdate;
}
function showAccountInfo() {    
    console.log("============================")
    console.log(getNowFormatDate(), `My Balance: ${balance_1} ${symbol_1} | ${balance_2} ${symbol_2}`);
    console.log("============================")
}

const checkBalance = async (client) => {
    userbalance = await client.Balance();
    balance_1 = 0 
    if (userbalance[symbol_1]) {
        balance_1 = userbalance[symbol_1].available
    }
    balance_2 = 0;
    if (userbalance[symbol_2]) {
        balance_2 = userbalance[symbol_2].available
    }
}

const worker = async (client) => {
    try {
        let GetOpenOrders = await client.GetOpenOrders({ symbol: SYMBOL });
        if(GetOpenOrders.length > 0) {
            if(lastPriceAsk == 0) lastPriceAsk = GetOpenOrders[0].price;
            console.log(getNowFormatDate(), `Waiting ${PRICE_DECREASE_INTERVAL} mins | Selling ${GetOpenOrders[0].quantity} ${symbol_1} at $${GetOpenOrders[0].price} (${(GetOpenOrders[0].price * GetOpenOrders[0].quantity).toFixed(6)} ${symbol_2})...`);    
            while (GetOpenOrders.length > 0) {
                let now = new Date().getTime();
                if( (now - lastPriceTime) > (PRICE_DECREASE_INTERVAL*60000) ) {
                    lastPriceAsk = lastPriceAsk - (PRICE_DIFF * (PRICE_DECREASE_PERCENT) / 100);
                    console.log(`Cancel order, decrease sell price (${PRICE_DECREASE_PERCENT}%) to $${lastPriceAsk}`);
                    await client.CancelOpenOrders({ symbol: SYMBOL });
                } else {
                    await delay(3000);
                }
                GetOpenOrders = await client.GetOpenOrders({ symbol: SYMBOL });
            }
        }

        await checkBalance(client);

        if (balance_2 > MIN_SYMBOL_2) {
            await buyfun(client);
        } else {
            await sellfun(client);
        }
    } catch (e) {
        console.log(getNowFormatDate(), `Try again... (${e.message})`);

        await delay(3000);
        worker(client);

    }
}

const sellfun = async (client) => {
    console.log("======= SELLING ======");
    await checkBalance(client);
    if (balance_1 < MIN_SYMBOL_1) {
        throw new Error(`Insufficient balance (${balance_1} ${symbol_1}) | Retrying...`);
    } else {
        if(lastPriceAsk == 0) {
            let {lastPrice: ask} = await client.Ticker({ symbol: SYMBOL });
            lastPriceAsk = ask;
        }
        lastPriceAsk = (lastPriceAsk*1).toFixed(6);
        let quantitys = (userbalance[symbol_1].available - (MIN_SYMBOL_1/2)).toFixed(QUANTITY_DECIMAL_1).toString();
        console.log(getNowFormatDate(), `Sell limit ${quantitys} ${symbol_1} at $${lastPriceAsk} (${(lastPriceAsk * quantitys).toFixed(6)} ${symbol_2})`);
        let orderResultAsk = await client.ExecuteOrder({
            orderType: "Limit",
            price: lastPriceAsk.toString(),
            quantity: quantitys,
            side: "Ask",
            symbol: SYMBOL,
            timeInForce: "GTC"
        })
        lastPriceTime = new Date().getTime();
        worker(client);
    }
}

const buyfun = async (client) => {
    console.log("======= BUYING ======");
    await checkBalance(client);
    let {lastPrice: lastBuyPrice} = await client.Ticker({ symbol: SYMBOL });
    lastBuyPrice = (lastBuyPrice*1);
    let quantitys = ((userbalance[symbol_2].available - (MIN_SYMBOL_2/2)) / lastBuyPrice).toFixed(QUANTITY_DECIMAL_2).toString();
    let orderResultBid = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastBuyPrice.toString(),
        quantity: quantitys,
        side: "Bid",
        symbol: SYMBOL,
        timeInForce: "IOC"
    })
    if (orderResultBid?.status == "Filled" && orderResultBid?.side == "Bid") {
        console.log(getNowFormatDate(), `Bought ${quantitys} ${symbol_1} at $${lastBuyPrice} ${symbol_2}`, `Order number: ${orderResultBid.id}`);
        lastPriceAsk = lastBuyPrice + PRICE_DIFF;
        showAccountInfo();
        worker(client);
    } else {
        if (orderResultBid?.status == 'Expired'){
            throw new Error(`Buying ${quantitys} ${symbol_1} at $${lastBuyPrice} ${symbol_2} Expired | Retrying...`);
        } else{
            throw new Error(orderResultBid?.status);
        }
    }
}

(async () => {
    const apisecret = API_SECRET;
    const apikey = API_KEY;
    const client = new backpack_client_1.BackpackClient(apisecret, apikey);
    await checkBalance(client);
    showAccountInfo();
    worker(client);
})()
