
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useChainId } from "wagmi";

import { readYbt } from "../config/contractsData";
import PoolFactory from "../contract-hooks/PoolFactory"
import { Ybt } from "../types"
import Loader from "../components/low-level/Loader";

const Pools = ({ ybts, poolFactory }: { ybts: Ybt[], poolFactory: PoolFactory | undefined }) => {
  const [ybt, setYbt] = useState<Ybt>();
  const [poolAddresses, setYbtPoolAddresses] = useState<Record<string, string[]>>({});

  const appChainId = useChainId();
  const ybtSymbol = useSearchParams()[0].get("ybt");

  useEffect(() => {
    async function initializeYbt() {
      if (ybtSymbol) {
        const _ybt = await readYbt(appChainId, ybtSymbol);
        return setYbt(_ybt);
      }
      return setYbt(ybts[0]);
    }

    initializeYbt();
  }, [ybts]);

  useEffect(() => {
    if (!poolFactory || ybts.length === 0) return;

    const fetchPoolAddresses = async () => {
      const _ybtPoolAddresses: Record<string, string[]> = {};

      // Promise.all returns an array of arrays of pool addresses
      const _allPoolAddresses = await Promise.all(
        ybts.map(ybt => poolFactory.getSpiralPoolsForSYToken(ybt.syToken.address))
      );

      // Process each array of pool addresses with its corresponding index
      _allPoolAddresses.forEach((poolAddresses, index) => {
        _ybtPoolAddresses[ybts[index].symbol] = poolAddresses;
      });

      setYbtPoolAddresses(_ybtPoolAddresses);
    };

    fetchPoolAddresses();
  }, [poolFactory]);

  const handleYbtChange = (_ybt: Ybt) => {
    setYbt(_ybt);
  };

  console.log(ybt && poolAddresses && true);

  return (
    <div>
      {ybt && poolAddresses[ybt.symbol] && poolAddresses[ybt.symbol].length > 0 ? (
        <div>
          {poolAddresses[ybt.symbol].map((poolAddress: string, index: number) => {

            return (
              <div>
                <Link
                  key={index}
                  to={`/pools/${poolAddress}?ybt=${ybt.symbol}&poolChainId=${appChainId}`}
                >
                  view
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Pools;


