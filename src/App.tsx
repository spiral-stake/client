import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
// Components
import AppNetworkOverlay from "./components/AppNetworkOverlay";
import Navbar from "./components/Navbar";
import OnboardingOverlay from "./components/OnboardingOverlay";
// Pages
import CreatePool from "./pages/CreatePool";
import PoolPage from "./pages/Pool";
import Pools from "./pages/Pools";
import Market from "./pages/Market";
import Dashboard from "./pages/Dashboard";
import ERC20 from "./contract-hooks/ERC20";
import PoolFactory from "./contract-hooks/PoolFactory";
import { readYbts } from "./config/contractsData";
import { Ybt } from "./types";
import Test from "./pages/Test";
import DropdownMenu from "./components/DropdownMenu";

function App() {
  const [ybts, setYbts] = useState<Ybt[]>([]);
  const [poolFactory, setPoolFactory] = useState<PoolFactory>();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const [dropdown, setDropDown] = useState(false);

  // appChainId == only chains supported by the app
  const appChainId = useChainId();
  const { address, chainId } = useAccount();

  // Mainnet - Need to remove onboarding

  const showDropdown = (bool: boolean) => setDropDown(bool);

  useEffect(() => {
    /**
     * @dev Checks if the user's ybt balance is 0, and airdrop ybt and baseTokens for testnet onboarding
     */
    const onboardUser = async () => {
      if (!address || chainId !== appChainId || !ybts.length)
        return setOnboarding(false);

      const { address: tokenAddress, name, symbol, decimals } = ybts[0];
      const ybt = new ERC20(tokenAddress, name, symbol, decimals);
      const ybtBalance = await ybt.balanceOf(address);

      if (ybtBalance.isZero()) {
        setOnboarding(true);
      } else {
        setOnboarding(false);
      }
    };

    onboardUser();
  }, [address, chainId, appChainId, ybts]);

  useEffect(() => {
    /**
     * @dev on appChainId change, reset the ybts and poolFactory according to the chain
     */
    async function handleChainChange() {
      const [_ybts, _poolFactory] = await Promise.all([
        readYbts(appChainId),
        PoolFactory.createInstance(appChainId),
      ]);

      setYbts(_ybts);
      setPoolFactory(_poolFactory);
    }

    handleChainChange();
  }, [appChainId]);

  return (
    <div className="app">
      <Toaster />
      {!dropdown ? (
        <Navbar showDropdown={showDropdown} />
      ) : (
        <DropdownMenu showDropdown={showDropdown} />
      )}

      <div className="px-4 lg:px-16">
        <Routes>
          <Route
            path={"/pools/create"}
            element={
              <CreatePool
                poolFactory={poolFactory}
                ybts={ybts}
                setSwitchingNetwork={setSwitchingNetwork}
              />
            }
          />
          <Route path={"/pools/:address"} element={<PoolPage />} />
          {/* <Route path="/pools" element={<Test />} /> */}
          <Route
            path={"/pools"}
            element={<Pools ybts={ybts} poolFactory={poolFactory} />}
          />
          <Route path={"/marketPlace"} element={<Market />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="*" element={<Navigate to={"/pools"} />} />
        </Routes>
        <OnboardingOverlay
          onboarding={onboarding}
          setOnboarding={setOnboarding}
        />
      </div>
    </div>
  );
}

export default App;
