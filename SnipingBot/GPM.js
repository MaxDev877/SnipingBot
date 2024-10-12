// GPM: Gas Price Monitor
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const gasPriceThreshold = web3.utils.toWei('20', 'gwei'); // set gas price threshold

async function monitorGasPrice() {
    const gasPrice = await web3.eth.getGasPrice();
    const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei');

    console.log(`Current Gas Price: ${gasPriceInGwei} gwei`);

    if (parseFloat(gasPriceInGwei) < parseFloat(web3.utils.fromWei(gasPriceThreshold, 'gwei'))) {
        console.log('Gas price is low enough for profitable trading!');
    }
}

setInterval(monitorGasPrice, 10000); // verify price every 10 seconds