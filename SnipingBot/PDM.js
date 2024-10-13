// PDM: Price Discrepancy Monitor for MetaMask and Remix.ide

let web3;

// Define Uniswap and Sushiswap router ABIs (insert actual ABI JSONs here)
const uniswapRouterABI = [/* Uniswap Router ABI */];
const sushiswapRouterABI = [/* Sushiswap Router ABI */];

// Define router addresses for Uniswap and Sushiswap
const uniswapRouterAddress = 'UNISWAP_ROUTER_ADDRESS'; // Replace with actual address
const sushiswapRouterAddress = 'SUSHISWAP_ROUTER_ADDRESS'; // Replace with actual address

// Token addresses and discrepancy threshold
const tokenA = 'TOKEN_A_ADDRESS'; // Replace with token A address (for example: WETH)
const tokenB = 'TOKEN_B_ADDRESS'; // Replace with token B address (for example: DAI)
const threshold = 0.01; // Price discrepancy threshold (1%)

// Check if MetaMask is available
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);

    // Request access to MetaMask accounts
    async function connectMetaMask() {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask connected');
            checkPriceDiscrepancy(web3.utils.toWei('1', 'ether')); // Start monitoring
        } catch (error) {
            console.error('User denied account access', error);
        }
    }

    // Function to check price discrepancy
    async function checkPriceDiscrepancy(amount) {
        try {
            const uniswapRouter = new web3.eth.Contract(uniswapRouterABI, uniswapRouterAddress);
            const sushiswapRouter = new web3.eth.Contract(sushiswapRouterABI, sushiswapRouterAddress);

            const amountOutUniswap = await uniswapRouter.methods.getAmountsOut(amount, [tokenA, tokenB]).call();
            const amountOutSushiswap = await sushiswapRouter.methods.getAmountsOut(amount, [tokenA, tokenB]).call();

            const priceUniswap = web3.utils.fromWei(amountOutUniswap[1], 'ether');
            const priceSushiswap = web3.utils.fromWei(amountOutSushiswap[1], 'ether');

            const difference = Math.abs(priceUniswap - priceSushiswap);
            const percentageDifference = (difference / Math.min(priceUniswap, priceSushiswap)) * 100;

            console.log(`Uniswap Price: ${priceUniswap} | Sushiswap Price: ${priceSushiswap}`);

            if (percentageDifference > threshold * 100) {
                console.log(`Significant price discrepancy detected! Uniswap: ${priceUniswap}, Sushiswap: ${priceSushiswap}`);
            }
        } catch (error) {
            console.error('Error checking price discrepancy:', error);
        }
    }

    // Check for price discrepancies every 10 seconds for 1 unit of tokenA
    setInterval(() => {
        checkPriceDiscrepancy(web3.utils.toWei('1', 'ether')); // Monitor 1 unit of token
    }, 10000);

    // Connect to MetaMask on page load
    connectMetaMask();
} else {
    console.error('MetaMask is not installed. Please install it to use this feature.');
}
