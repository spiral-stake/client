import {Toaster} from "react-hot-toast";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { useAccount, useChainId } from "wagmi";
import AppNetworkOverlay from "./components/AppNetworkOverlay";
import Navbar from "./components/Navbar";
import CreatePool from "./pages/CreatePool";
import PoolPage from "./pages/PoolPage";
import Pools from "./pages/Pools";
import Market from "./pages/Market";
import Dashboard from "./pages/Dashboard";
import OnboardingOverlay from "./components/OnboardingOverlay";

function App() {
  const [ybts, setYbts] = useState([]);
  const [poolFactory, setPoolFactory] = useState();
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [onboarding, setOnboarding] = useState(Boolean);

  const appChainId = useChainId();
  const { address, chainId } = useAccount();

  useEffect(() => {
    const onboardUser = async () => {
      
    };

    onboardUser();
  }, [address, chainId, appChainId, ybts] );

  useEffect(()=> {
    async function handleChainChanges() {
      
    }

    handleChainChanges();
  },[appChainId]);

  return (
    <div className="app">
       <AppNetworkOverlay 
        // switchingNetwork={switchingNetwork} 
        // setSwitchingNetwork={setSwitchingNetwork}
       />
       <Toaster/>
       <Navbar
        // setSwitchingNetwork={setSwitchingNetwork}
        />
       <div className="main">
         <Routes>
           <Route
            path={"/pools/create"}
            element={
              <CreatePool/>
            }
           />
           <Route path={"/pools/:address"} element={<PoolPage/>}/>
           <Route path={"/pools"} element={<Pools/>}/>
           <Route path={"/marketPlace"} element={<Market/>}/>
           <Route path="dashboard" element={<Dashboard/>}/>

           <Route 
           path="*"
           element={<Navigate to={"/pools"}/>}
           />
         </Routes>
         <OnboardingOverlay 
          // onboarding={onboarding}
          // setOnboarding={setOnboarding}
         />
       </div>
    </div>
  ) 
  
}

export default App;
