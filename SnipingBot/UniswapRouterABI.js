// This program is using 2 functions for your arbitrage bot to decide whether 
// to execute trades based on the estimated output amounts and to carry out those trades if conditions are favorable.
const uniswapRouterABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "name": "path",
                "type": "address[]"
            }
        ],
        "name": "getAmountsOut",
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "name": "path",
                "type": "address[]"
            },
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
