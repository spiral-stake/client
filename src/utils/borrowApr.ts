import BigNumber from "bignumber.js";
import Pool from "../contract-hooks/Pool";
import { Cycle } from "../types";

function calculateBidAmountFromAPR(pool: Pool, APR: BigNumber, currentCycle: Cycle) {
  const remainingCycles = pool.totalCycles - currentCycle.count;
  const remainingCycleDeposits = pool.amountCycle.multipliedBy(remainingCycles);

  const cycleDuration = pool.cycleDuration; // In seconds
  const secondsInYear = new BigNumber(31536000); // 365 days in seconds
  const periodicRate = APR.dividedBy(secondsInYear).multipliedBy(cycleDuration);

  // Calculate the interest for each remaining cycle
  let totalInterest = new BigNumber(0);
  let outstandingPrincipal = remainingCycleDeposits;

  // For each cycle, we calculate interest on the reducing balance
  for (let i = 0; i < remainingCycles; i++) {
    // Calculate interest for this cycle on the current outstanding principal
    const cycleInterest = outstandingPrincipal.multipliedBy(periodicRate);
    totalInterest = totalInterest.plus(cycleInterest);

    // Reduce the outstanding principal for the next cycle
    outstandingPrincipal = outstandingPrincipal.minus(pool.amountCycle);
  }

  // The bid amount is the total interest that will be paid
  const bidAmount = totalInterest;

  return bidAmount;
}
