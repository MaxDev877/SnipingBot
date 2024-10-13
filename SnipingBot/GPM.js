// GPM: Gas Price Monitor (Updated for MetaMask and Remix.ide)
let web3;

// Set gas price threshold (in gwei)
const gasPriceThreshold = '20'; // Set threshold in gwei

// Check if MetaMask is available
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    
    // Requesting access function to MetaMask accounts
    async function connectMetaMask() {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask connected');
            monitorGasPrice(); // Start gas price monitoring
        } catch (error) {
            console.error('User denied account access', error);
        }
    }
    
    // Function to monitor gas prices
    async function monitorGasPrice() {
        try {
            const gasPrice = await web3.eth.getGasPrice();
            const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei');
            console.log(`Current Gas Price: ${gasPriceInGwei} gwei`);

            if (parseFloat(gasPriceInGwei) < parseFloat(gasPriceThreshold)) {
                console.log('Gas price is low enough for profitable trading!');
            }
        } catch (error) {
            console.error('Error fetching gas price:', error);
        }
    }

    // Checking gas price every 10 seconds
    setInterval(monitorGasPrice, 10000);
    
    // Connect to MetaMask on page load
    connectMetaMask();
} else {
    console.error('MetaMask is not installed. Please install it to use this feature.');
}