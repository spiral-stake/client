import { ConnectButton } from "@rainbow-me/rainbowkit";
import dropdownSvg from "../../assets/Icons/arrowDown.svg";
import { chainConfig } from "../../config/chainConfig";
import { useChainId } from "wagmi";
import Btn from "../low-level/Btn";

// Need css fix

const ConnectWalletBtn = ({ networkOption, setSwitchingNetwork }: { networkOption?: boolean, setSwitchingNetwork?: (bool: boolean) => void }) => {
    const appChainId = useChainId();

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // If your app doesn't use authentication, remove 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");

                if (!connected) {
                    return (
                        <>
                            {networkOption && setSwitchingNetwork && (
                                <div onClick={() => setSwitchingNetwork(true)} className="navbar__network">
                                    <img className="logo" src={chainConfig[appChainId].logo} alt="Network Icon" />
                                    <img
                                        style={{ width: "25px" }}
                                        className="dropdown"
                                        src={dropdownSvg}
                                        alt="Dropdown Icon"
                                    />
                                </div>
                            )}

                            <Btn onClick={openConnectModal} text={"Connect"} />

                        </>
                    );
                }

                if (chain.unsupported) {
                    return (
                        <>
                            {networkOption && (
                                <div onClick={openChainModal} className="navbar__network">
                                    <img
                                        className="logo"
                                        src={
                                            (chain.hasIcon && chain.iconUrl) ||
                                            chainConfig[chain.id]?.logo ||
                                            chainConfig[appChainId].logo
                                        }
                                        alt="Network Icon"
                                    />
                                    <img
                                        style={{ width: "25px" }}
                                        className="dropdown"
                                        src={dropdownSvg}
                                        alt="Dropdown Icon"
                                    />
                                </div>
                            )}
                            <Btn text={"Wrong Network"} onClick={openChainModal} />
                        </>
                    );
                }

                return (
                    <>
                        {networkOption && (
                            <div onClick={openChainModal} className="navbar__network">
                                <img
                                    className="logo"
                                    src={
                                        (chain.hasIcon && chain.iconUrl) ||
                                        chainConfig[chain.id]?.logo ||
                                        chainConfig[appChainId].logo
                                    }
                                    alt="Network Icon"
                                />
                                <img
                                    style={{ width: "25px" }}
                                    className="dropdown"
                                    src={dropdownSvg}
                                    alt="Dropdown Icon"
                                />
                            </div>
                        )}
                        <Btn text={account.displayName} onClick={openAccountModal} />

                    </>
                );
            }}
        </ConnectButton.Custom >
    );
};

export default ConnectWalletBtn;
