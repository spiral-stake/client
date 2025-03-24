// Need css fix

import { useAccount, useSwitchChain } from "wagmi";
import { chainConfig } from "../../config/chainConfig";
import ConnectWalletBtn from "./ConnectWalletButton";

const ActionBtn = ({ expectedChainId, onClick, disabled, text }: { expectedChainId: number, onClick: () => void, disabled: boolean, text: string }) => {
    const { address, chainId } = useAccount();
    const { switchChain } = useSwitchChain();

    return address ? (
        chainId === expectedChainId ? (
            <button
                onClick={onClick}
                disabled={disabled}
                className="btn btn--primary"
            >
                {text}
            </button>
        ) : (
            <button
                disabled={false}
                onClick={() => switchChain({ chainId: expectedChainId })}
                className="btn btn--primary"
            >
                {`Switch to ${chainConfig[expectedChainId].name}`}
            </button>
        )
    ) : (
        <ConnectWalletBtn />
    );
}

export default ActionBtn;