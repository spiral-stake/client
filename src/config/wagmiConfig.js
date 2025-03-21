import { http } from "wagmi";
import { mainnet, bsc, bscTestnet, sepolia, anvil, arbitrumSepolia, mode } from "wagmi/chains";
import { chainConfig } from "../config/chainConfig";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const chains = Object.values(chainConfig);

export const wagmiConfig = getDefaultConfig({
  appName: "Spiral Stake",
  projectId: "49bdf41453b575598177350acab135bd",
  chains: [...chains],
  transports: {
    [31337]: http("http://127.0.0.1:8545"),
    [31338]: http("http://127.0.0.1:8546"),
    [2522]: http(chainConfig[2522]?.rpcUrls.default.http[0]),
    [89346162]: http("https://rpc.reya-cronos.gelato.digital"),
    [421614]: http("https://sepolia-rollup.arbitrum.io/rpc"),
  },
});
