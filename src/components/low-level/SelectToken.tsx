// need css

import ERC20 from "../../contract-hooks/ERC20";
import { Token, Ybt } from "../../types";

const SelectToken = ({ tokens, handleTokenChange, selectedToken }: { tokens: Ybt[] | Token[] | ERC20[], handleTokenChange: (tokenSymbol: string) => void, selectedToken: Ybt | Token | ERC20 }) => {
    return (
        <div className="w-full flex flex-row p-1 bg-white bg-opacity-5 text-xs rounded-md justify-evenly">
            {tokens.map((token) => (<div onClick={() => handleTokenChange(token.symbol)} key={token.symbol} className={`w-full flex justify-center items-center p-1 px-5 rounded cursor-pointer hover:scale-110 transition-all duration-100 ${selectedToken.symbol === token.symbol ? "text-black bg-white" : ""
                }`}>
                <span>{token.symbol}</span>
            </div>
            ))}
        </div>
    );
}

export default SelectToken;