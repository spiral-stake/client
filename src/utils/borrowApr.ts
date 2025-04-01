import BigNumber from "bignumber.js";
import Pool from "../contract-hooks/Pool";
import { Cycle } from "../types";

function calculateSimpleBorrowAPR(pool: Pool, bidAmount: BigNumber, currentCycle: Cycle) {
  // Calculate the net borrowed amount (win amount minus winner's own contribution)
  const contributedSoFar = pool.amountCycle * currentCycle.count;
  const netBorrowed = bidAmount - contributedSoFar;

  // Calculate the repayment amount (remaining required deposits)
  const remainingCycles = pool.totalCycles - currentCycle.count;
  const totalRepayment = remainingCycles * pool.amountCycle;

  // Calculate the interest (what they pay beyond what they borrowed)
  const interest = totalRepayment - netBorrowed;

  // If interest is negative or zero, there's no effective borrowing cost
  if (interest <= 0) return 0;

  // Calculate the average loan duration in months
  // For simplicity, we'll use the midpoint of the remaining cycles
  const avgLoanDurationMonths = (remainingCycles * cycleDurationMonths) / 2;

  // Calculate the simple interest rate
  const simpleInterestRate = interest / netBorrowed;

  // Annualize the rate (convert from the loan period to annual)
  const annualizedRate = (simpleInterestRate * 12) / avgLoanDurationMonths;

  // Return as percentage
  return annualizedRate * 100;
}
