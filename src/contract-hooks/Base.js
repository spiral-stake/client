import {
  readContract,
  prepareTransactionRequest,
  writeContract,
  simulateContract,
  getAccount,
  waitForTransactionReceipt,
  getBalance,
} from "wagmi/actions";
import { wagmiConfig as config } from "../config/wagmiConfig";
import { formatUnits } from "../utils/formatUnits";
const { connector } = getAccount(config);

export class Base {
  constructor(address, abi) {
    this.address = address;
    this.abi = abi;
  }

  async read(functionName, args = [], chainId) {
    const res = await readContract(config, {
      abi: this.abi,
      address: this.address,
      functionName,
      args,
      chainId,
    });

    // await this.wait(2);

    return res;
  }

  async simulate(functionName, args = [], value = "0", chainId) {
    return (
      await simulateContract(config, {
        abi: this.abi,
        address: this.address,
        functionName: functionName,
        args,
        account: connector || "0x0000000000000000000000000000000000000000",
        value,
        chainId,
      })
    ).result;
  }

  async write(functionName, args = [], value = "0") {
    const hash = await writeContract(config, {
      abi: this.abi,
      address: this.address,
      functionName,
      args,
      value,
      // __mode: "prepared", // Needs to be uncommented on local
    });

    // await this.wait(4);

    return waitForTransactionReceipt(config, { hash, confirmations: 1 });
  }

  // Need to remove this later (as this only for testing purposes)
  wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

  async getNativeBalance(account) {
    const { value } = await getBalance(config, {
      address: account,
    });

    return formatUnits(value, this.decimals);
  }
}
