export const addTokenToWallet = async (token) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: parseInt(token.decimals),
            image: "", // Optional: Add a URL to the token’s image here
          },
        },
      });
    } catch (error) {
      console.error(`Failed to add ${token.symbol} to wallet:`, error);
    }
  } else {
    console.error("Ethereum provider not found");
  }
};
