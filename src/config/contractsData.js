import { chainConfig } from "../config/chainConfig";

const nativeAddress = "0x0000000000000000000000000000000000000000";

export const readYbts = async (chainId) => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`);

  const ybtData = [];

  for (let ybt of Object.values(ybtsObj)) {
    if (ybt.baseToken.address !== nativeAddress) {
      ybtData.unshift({ ...ybt });
    } else {
      ybtData.unshift({
        ...ybt,
        baseToken: { address: nativeAddress, ...chainConfig[chainId].nativeCurrency },
      });
    }
  }

  return ybtData;
};

export const readYbt = async (chainId, ybtSymbol) => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`);
  const ybt = { ...ybtsObj[ybtSymbol] };

  if (ybt.baseToken.address !== nativeAddress) {
    return ybt;
  } else {
    return {
      ...ybt,
      baseToken: { address: nativeAddress, ...chainConfig[chainId].nativeCurrency },
    };
  }
};
