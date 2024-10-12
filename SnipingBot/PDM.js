// PDM: Price Discrepancy Monitor
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const uniswapRouterABI = [...] // put here the ABI adress from uniswap
const sushiswapRouterABI = [...] // put here the ABI adrees from sushiswap
const uniswapRouterAddress = 'UNISWAP_ROUTER_ADDRESS';
const sushiswapRouterAddress = 'SUSHISWAP_ROUTER_ADDRESS';

const uniswapRouter = new web3.eth.Contract(uniswapRouterABI, uniswapRouterAddress);
const sushiswapRouter = new web3.eth.Contract(sushiswapRouterABI, sushiswapRouterAddress);

const tokenA = 'TOKEN_A_ADDRESS'; // replace with token address
const tokenB = 'TOKEN_B_ADDRESS'; // replace with token address
const threshold = 0.01; // set threshold for price discrepancy

async function checkPriceDiscrepancy(amount) {
    const amountOutUniswap = await uniswapRouter.methods.getAmountsOut(amount, [tokenA, tokenB]).call();
    const amountOutSushiswap = await sushiswapRouter.methods.getAmountsOut(amount, [tokenA, tokenB]).call();

    const priceUniswap = amountOutUniswap[1];
    const priceSushiswap = amountOutSushiswap[1];
    const difference = Math.abs(priceUniswap - priceSushiswap);

    if (difference / Math.min(priceUniswap, priceSushiswap) > threshold) {
        console.log(`Significant price discrepancy detected! Uniswap: ${priceUniswap}, Sushiswap: ${priceSushiswap}`);
    }
}

setInterval(() => {
    checkPriceDiscrepancy(web3.utils.toWei('1', 'ether')); // verify for 1 unit of token
}, 10000); // the default checks every 10 seconds
