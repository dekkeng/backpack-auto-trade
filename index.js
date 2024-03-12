"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backpack_client_1 = require("./backpack_client");

require('dotenv').config()

/// EDIT HERE ///
const API_KEY = process.env.BACKPACK_API_KEY
const API_SECRET = process.env.BACKPACK_API_SECRET
const PRICE_DIFF = process.env.PRICE_DIFF*1
/////////////

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

let startBalance = 0;
let profit = 0;
let lastPriceAsk = 999;
let userbalance = {};

const worker = async (client) => {
    try {
        let GetOpenOrders = await client.GetOpenOrders({ symbol: "SOL_USDC" });
        if(GetOpenOrders.length > 0) {
            console.log(getNowFormatDate(), `Waiting to sell ${GetOpenOrders[0].quantity} SOL at $${GetOpenOrders[0].price} (${(GetOpenOrders[0].price * GetOpenOrders[0].quantity).toFixed(2)} USDC)...`);    
            while (GetOpenOrders.length > 0) {
                await delay(3000);
                GetOpenOrders = await client.GetOpenOrders({ symbol: "SOL_USDC" });
            }
        }

        userbalance = await client.Balance();
        let balanceSol = 0;
        if (userbalance.SOL) {
            balanceSol = userbalance.SOL.available
        }
        let balanceUsdc = 0;
        if (userbalance.USDC) {
            balanceUsdc = userbalance.USDC.available
        }

        console.log("\n============================")
        console.log(getNowFormatDate(), `My Account Infos: ${balanceSol} $SOL | ${balanceUsdc} $USDC`);

        if (balanceUsdc > 5) {
            await buyfun(client);
        } else {
            let {lastPrice: lastBuyPrice} = await client.Ticker({ symbol: "SOL_USDC" });
            await sellfun(client, lastBuyPrice);
        }
    } catch (e) {
        console.log(getNowFormatDate(), `Try again... (${e.message})`);

        await delay(3000);
        worker(client);

    }
}



const sellfun = async (client, lastBuyPrice) => {
    console.log("======= SELLING ======");
    userbalance = await client.Balance();    
    lastPriceAsk = (lastBuyPrice + PRICE_DIFF).toFixed(2);
    let quantitys = (userbalance.SOL.available).toFixed(2).toString();
    console.log(getNowFormatDate(), `Sell limit ${quantitys} SOL at $${lastPriceAsk} (${(lastPriceAsk * quantitys).toFixed(2)} USDC)`);
    let orderResultAsk = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastPriceAsk.toString(),
        quantity: quantitys,
        side: "Ask",
        symbol: "SOL_USDC",
        timeInForce: "GTC"
    })
    
    worker(client);
}

const buyfun = async (client) => {
    console.log("======= BUYING ======");
    let {lastPrice: lastBuyPrice} = await client.Ticker({ symbol: "SOL_USDC" });
    let quantitys = ((userbalance.USDC.available - 2) / lastBuyPrice).toFixed(2).toString();
    console.log(getNowFormatDate(), );
    let orderResultBid = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastBuyPrice.toString(),
        quantity: quantitys,
        side: "Bid",
        symbol: "SOL_USDC",
        timeInForce: "IOC"
    })
    if (orderResultBid?.status == "Filled" && orderResultBid?.side == "Bid") {
        console.log(getNowFormatDate(), `Bought ${quantitys} SOL at $${lastBuyPrice} USDC`, `Order number: ${orderResultBid.id}`);
        sellfun(client, lastBuyPrice*1);
    } else {
        if (orderResultBid?.status == 'Expired'){
            throw new Error(`Buying ${quantitys} SOL at $${lastBuyPrice} USDC Expired | Retrying...`);
        } else{
            throw new Error(orderResultBid?.status);
        }
    }
}

(async () => {
    const apisecret = API_SECRET;
    const apikey = API_KEY;
    const client = new backpack_client_1.BackpackClient(apisecret, apikey);
    worker(client);
})()
