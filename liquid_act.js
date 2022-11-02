const Web3 = require('web3');
const env = require('dotenv');
const fs = require("fs");
env.config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.END_POINT));
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
web3.eth.accounts.wallet.add({
    address: account.address,
    privateKey: process.env.PRIVATE_KEY
});

const tokenData = fs.readFileSync("./ierc20.abi","utf-8");
const routerData = fs.readFileSync("./router.abi","utf-8");
// router Address
const routerAddr = "";
const router = new web3.eth.Contract(JSON.parse(routerData),routerAddr);
const Forever = "2000000000";

async function init() {
    await web3.eth.net.isListening();
    const chainId = await web3.eth.net.getId();
    console.log('Web3 is connected chainId:'+chainId)
    console.log(account.address);
    // get gasToken Balance
    console.log("gas balance:" + await web3.eth.getBalance(account.address));
}

// one of liquid token is native token
async function add_liquid_eth() {
    // token0 address
    const token0Addr = "";
    const token0 = new web3.eth.Contract(JSON.parse(tokenData),token0Addr);
    // token0 balance
    const token0Bal = "";

    await token0.methods.approve(routerAddr, token0Bal).send({
        from: account.address,
        gas: "50000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("approve token0 tx: " + hash);
    });

    await router.methods.addLiquidityETH(token0Addr, token0Bal, '0', '0', account.address, Forever).send({
        from: account.address,
        gas: "3000000",
        gasPrice: "200000000000",
        // gasToken balance
        value: "",
    }).on('transactionHash', function(hash){
        console.log("add liquid tx: " + hash);
    });

}

// one of liquid token is native token
async function rm_liquid_eth() {
    // token0 address
    const token0Addr = "";

    // lp address
    const lpAddr = "";
    const lp = new web3.eth.Contract(JSON.parse(tokenData),lpAddr);
    // lp balance
    const lpBal = "";

    const sign = "";

    await lp.methods.approve(routerAddr, lpBal).send({
        from: account.address,
        gas: "50000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("approve lp tx: " + hash);
    });

    await router.methods.removeLiquidityETH(token0Addr, lpBal, '0', '0', account.address, Forever, sign).send({
        from: account.address,
        gas: "300000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("remove liquid tx: " + hash);
    });

}

async function add_liquid() {
    //token0 address
    const token0Addr = "";
    const token0 = new web3.eth.Contract(JSON.parse(tokenData),token0Addr);
    const token0Bal = ""
    //token1 address
    const token1Addr = "";
    const token1 = new web3.eth.Contract(JSON.parse(tokenData),token1Addr);
    const token1Bal = ""

    await token0.methods.approve(routerAddr, token0Bal).send({
        from: account.address,
        gas: "100000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("approve token0 tx: " + hash)
    });
    await token1.methods.approve(routerAddr, token1Bal).send({
        from: account.address,
        gas: "100000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("approve token1 tx: " + hash)
    });

    await router.methods.addLiquidity(token0Addr,token1Addr,token0Bal,token1Bal,'0','0',account.address,Forever).send({
        from: account.address,
        gas: "3000000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("add liquid tx: " + hash)
    });

}

async function rm_liquid() {
    //token0 address
    const token0Addr = "";
    //token1 address
    const token1Addr = "";

    // lp address
    const lpAddr = "";
    const lp = new web3.eth.Contract(JSON.parse(tokenData),lpAddr);
    // lp balance
    const lpBal = "";

    await lp.methods.approve(routerAddr, lpBal).send({
        from: account.address,
        gas: "50000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("approve lp tx: " + hash);
    });

    const sign = ""

    await router.methods.removeLiquidity(token0Addr,token1Addr,lpBal,'0','0',account.address,Forever,sign).send({
        from: account.address,
        gas: "300000",
        gasPrice: "200000000000"
    }).on('transactionHash', function(hash){
        console.log("rm liquid tx: " + hash)
    });

}

async function main() {
    await init();
    // await add_liquid_eth();
    // await rm_liquid_eth();
    // await add_liquid();
    // await rm_liquid();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });