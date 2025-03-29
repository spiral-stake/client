// need css

import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useAccount } from "wagmi";
import { onboard } from "../utils/onboard";
import { handleAsync } from "../utils/handleAsyncFunction";
import "../Overlay.css";
import BtnFull from "./low-level/BtnFull";
import Loading from "./low-level/Loading";

function OnboardingOverlay({
  onboarding,
  setOnboarding,
}: {
  onboarding: boolean;
  setOnboarding: (value: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  const { address, chainId } = useAccount();

  const handleOnboarding = async () => {
    if (!chainId || !address) return;

    await onboard(chainId, address);
    setOnboarding(false);
  };

  return (
    onboarding && (
      <section className="overlay">
        <div className="overlay-content">
          <h2>Beta Users</h2>
          {!loading ? (
            <>
              <BtnFull
                text={"Claim Faucet & Test tokens"}
                onClick={handleAsync(handleOnboarding, setLoading)}
              />
            </>
          ) : (
            <Loading loadingText="Sending faucet" />
          )}
        </div>
      </section>
    )
  );
}

export default OnboardingOverlay;
