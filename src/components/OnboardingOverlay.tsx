// need css

import { useState } from "react";
import { ClipLoader } from "react-spinners"
import { useAccount } from "wagmi";
import { onboard } from "../utils/onboard";
import { handleAsync } from "../utils/handleAsyncFunction";
import "../Overlay.css"
import BtnFull from "./low-level/BtnFull";

function OnboardingOverlay({ onboarding, setOnboarding }: { onboarding: boolean, setOnboarding: (value: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();

  const handleOnboarding = async () => {
    if(!chainId || !address) return;

    await onboard(chainId, address);
    setOnboarding(false);
  };

  return (
    onboarding && (
      <section className="overlay">
        <div className="overlay-content">
          <h2>To Get Started</h2>
          <BtnFull text={"Claim Faucet & Test tokens"} disabled={loading} onClick={handleAsync(handleOnboarding, setLoading)}   />
        </div>
      </section>
    )
  )
}

export default OnboardingOverlay
