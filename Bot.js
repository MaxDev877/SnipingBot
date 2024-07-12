require('dotenv').config();
const Web3 = require('web3');
const { abi } = require('./ArbitrageBot.json'); // Update the path to your ABI file if different

const web3 = new Web3(process.env.INFURA_API_URL);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const arbitrageBot = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);

async function checkArbitrage() {
    // Implement your logic to check for arbitrage opportunities
    const tokenA = 'TOKEN_A_ADDRESS';
    const tokenB = 'TOKEN_B_ADDRESS';
    const amount = web3.utils.toWei('1', 'ether'); // Adjust amount as necessary

    // Dummy condition to check for arbitrage opportunity
    const opportunityExists = true; // Replace with actual logic

    if (opportunityExists) {
        try {
            const tx = arbitrageBot.methods.performArbitrage(tokenA, tokenB, amount);
            const gas = await tx.estimateGas({ from: account.address });
            const gasPrice = await web3.eth.getGasPrice();
            const data = tx.encodeABI();
            const nonce = await web3.eth.getTransactionCount(account.address);

            const signedTx = await account.signTransaction({
                to: process.env.CONTRACT_ADDRESS,
                data,
                gas,
                gasPrice,
                nonce,
                chainId: 1 // Mainnet
            });

            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction successful with hash:', receipt.transactionHash);
        } catch (error) {
            console.error('Error performing arbitrage:', error);
        }
    }
}

// Run the check periodically
setInterval(checkArbitrage, 60000); // Check every 60 seconds
