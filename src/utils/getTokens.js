const nativeAddress = "0x0000000000000000000000000000000000000000";

export const getTokens = async (chainId) => {
  const ybts = [];
  const baseTokens = [];
  const baseTokensObj = {};

  const data = await import(`../addresses/${chainId}.json`);

  Object.keys(data.ybts).forEach((ybtKey) => {
    const ybt = data.ybts[ybtKey];
    const baseToken = ybt.baseToken;

    ybts.push(ybt);

    if (!baseTokensObj[baseToken.address]) {
      if (baseToken.address !== nativeAddress) {
        baseTokens.push(baseToken);
        baseTokensObj[baseToken.address] = true;
      }
    }
  });

  return { ybts, baseTokens };
};
