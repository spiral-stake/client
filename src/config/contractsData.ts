import { Ybt } from "../types/types";
import { chainConfig } from "./chainConfig";

const nativeAddress = "0x0000000000000000000000000000000000000000";

interface YbtsObject {
  [symbol: string] : Ybt
}

export const readYbts = async (chainId: number):Promise<Ybt[]> => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`) as {ybts: YbtsObject};

  const ybtData = [];

  for (let ybt of Object.values(ybtsObj)) {
    if (ybt.baseToken.address !== nativeAddress) {
      ybtData.unshift({ ...ybt });
    } else {
      const native = chainConfig[chainId].nativeCurrency;

      ybtData.unshift({
        ...ybt,
        baseToken: { address: nativeAddress, name: native.name, symbol: native.symbol, decimals: native.decimals  },
      });
    }
  }

  return ybtData;
};

export const readYbt = async (chainId: number, ybtSymbol: string): Promise<Ybt> => {
  const { ybts: ybtsObj } = await import(`../addresses/${chainId}.json`);
  const ybt = { ...ybtsObj[ybtSymbol] };

  if (ybt.baseToken.address !== nativeAddress) {
    return ybt;
  } else {
    const native = chainConfig[chainId].nativeCurrency;
    return {
      ...ybt,
      baseToken: { address: nativeAddress, name: native.name, symbol: native.symbol, decimals: native.decimals  },
    };
  }
};
