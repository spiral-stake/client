import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useChainId } from "wagmi";

import { readYbt } from "../config/contractsData";
import PoolFactory from "../contract-hooks/PoolFactory";
import { Ybt } from "../types";
import Loader from "../components/low-level/Loader";
import PoolCard from "../components/low-level/PoolCard";
import YbtDropdown from "../components/low-level/YbtDropdown";
import tokenIcon from "../assets/icons/GroupDark.svg";

const Pools = ({ ybts, poolFactory }: { ybts: Ybt[]; poolFactory: PoolFactory | undefined }) => {
  const [selectedYbt, setSelectedYbt] = useState<Ybt>();
  const [ybtPoolAddresses, setYbtPoolAddresses] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (!poolFactory || ybts.length === 0) return;

    const fetchPoolAddresses = async () => {
      const _ybtPoolAddresses: Record<string, string[]> = {};

      const _allPoolAddresses = await Promise.all(
        ybts.map((ybt) => poolFactory.getSpiralPoolsForSYToken(ybt.syToken.address))
      );

      _allPoolAddresses.forEach((ybtPoolAddresses, index) => {
        _ybtPoolAddresses[ybts[index].symbol] = ybtPoolAddresses;
      });

      setYbtPoolAddresses(_ybtPoolAddresses);
    };

    fetchPoolAddresses();
  }, [poolFactory]);

  const handleYbtChange = (_ybt: Ybt | undefined) => {
    setSelectedYbt(_ybt);
  };

  return ybtPoolAddresses ? (
    <div className="min-h-[90.5vh] h-fit">
      {ybts.map((ybt: Ybt) => (
        <YbtDropdown
          key={ybt.symbol}
          ybt={ybt}
          selectedYbt={selectedYbt}
          tagMsg="2 pools live"
          tokenIcon={tokenIcon}
          poolAddresses={ybtPoolAddresses[ybt.symbol]}
          handleYbtChange={handleYbtChange}
        />
      ))}
    </div>
  ) : (
    <Loader />
  );
};

export default Pools;
