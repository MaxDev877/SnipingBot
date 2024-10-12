// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ArbitrageBot
 * @info this contract enables automated arbitrage trading between Uniswap and Sushiswap.
 * It allows the owner to perform token swaps and captures profits from price discrepancies.
 */

interface IUniswapV2Router {
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function approve(address spender, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
}

contract ArbitrageBot {
    address public owner;
    IUniswapV2Router public uniswapRouter;
    IUniswapV2Router public sushiswapRouter;

    constructor(address _uniswapRouter, address _sushiswapRouter) {
        owner = msg.sender;
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        sushiswapRouter = IUniswapV2Router(_sushiswapRouter);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function approveToken(address token, address spender, uint amount) external onlyOwner {
        IERC20(token).approve(spender, amount);
    }

    function performArbitrage(
        address tokenA,
        address tokenB,
        uint amount
    ) external onlyOwner {
        // Swap tokenA for tokenB on Uniswap
        uint amountOutMin = getAmountOutMin(uniswapRouter, tokenA, tokenB, amount);
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;

        uniswapRouter.swapExactTokensForTokens(
            amount,
            amountOutMin,
            path,
            address(this),
            block.timestamp + 300
        );

        // Swap tokenB back to tokenA on SushiSwap
        uint tokenBAmount = IERC20(tokenB).balanceOf(address(this));
        amountOutMin = getAmountOutMin(sushiswapRouter, tokenB, tokenA, tokenBAmount);

        path[0] = tokenB;
        path[1] = tokenA;

        sushiswapRouter.swapExactTokensForTokens(
            tokenBAmount,
            amountOutMin,
            path,
            address(this),
            block.timestamp + 300
        );

        // Transfer profit to owner
        uint profit = IERC20(tokenA).balanceOf(address(this));
        IERC20(tokenA).transfer(owner, profit);
    }

    function getAmountOutMin(IUniswapV2Router router, address tokenIn, address tokenOut, uint amountIn) internal view returns (uint) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        uint[] memory amounts = router.getAmountsOut(amountIn, path);
        return amounts[amounts.length - 1];
    }
}
