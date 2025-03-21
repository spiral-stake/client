import { Base } from "./Base";
import { abi as TOKEN_ABI } from "../abi/ERC20.sol/ERC20.json";
import { formatUnits, parseUnits } from "../utils/formatUnits";

export default class ERC20 extends Base {
  constructor(address, name, symbol, decimals, ...extendedAbis) {
    super(address, [...TOKEN_ABI, ...extendedAbis]);

    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
  }

  ///////////////////////////
  // WRITE FUNCTIONS
  /////////////////////////

  async approve(spender, amount) {
    const parsedAmount = parseUnits(amount, this.decimals);
    return this.write("approve", [spender, parsedAmount]);
  }

  ///////////////////////////
  // READ FUNCTIONS
  /////////////////////////

  async allowance(owner, spender) {
    const allowance = await this.read("allowance", [owner, spender]);
    return formatUnits(allowance, this.decimals);
  }

  async balanceOf(account) {
    const balance = await this.read("balanceOf", [account]);
    return formatUnits(balance, this.decimals);
  }
}
