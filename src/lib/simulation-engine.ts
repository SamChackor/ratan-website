// SME Service Business Simulation Engine
// Implements Operations Management and Game Theory calculations

export interface SimulationConfig {
  simulationId: string;
  title: string;
  rounds: Array<{
    id: number;
    name: string;
    type: 'practice' | 'real';
    duration_mins: number;
  }>;
  segments: string[];
  baseDemand: Record<string, number>;
  servTimeHours: Record<string, number>;
  priceBounds: { min: number; max: number };
  weights: {
    eta: Record<string, number>;
    mu: Record<string, number>;
    kappa: Record<string, number>;
    rho: Record<string, number>;
  };
  financial: {
    interest_rate: number;
    tax_rate: number;
    CE: number;
  };
  costs: {
    W_perm: number;
    W_temp: number;
    phi_ot: number;
    C_hire: number;
    C_fire: number;
    C_train: number;
    VarCost: number;
    FixedOverhead: number;
    C_outsrc: number;
  };
  scoring_weights: {
    w_profit: number;
    w_ms: number;
    w_csat: number;
    w_esat: number;
    w_roe: number;
  };
  defaults: {
    base_wait_days: number;
    SLA_days: number;
    decay_prod: number;
    decay_quality: number;
  };
}

export interface TeamDecision {
  permHeadcount: number;
  tempHours: number;
  trainingIntensity: number;
  payPremiumPct: number;
  outsourcedHours: number;
  otCapPct: number;
  priceBySegment: Record<string, number>;
  marketingBySegment: Record<string, number>;
  qualityInvestment: number;
  debtChange: number;
  dividend: number;
}

export interface TeamState {
  Prod: number;
  Q: number;
  Cash: number;
  Debt: number;
  prevHeadcount?: number;
}

export interface RoundResult {
  teamId: string;
  metrics: {
    Revenue: number;
    NetProfit: number;
    MarketShare: Record<string, number>;
    CSAT: number;
    ESAT: number;
    ROCE: number;
    ProfitPerEmployee: number;
    UnitsServed: Record<string, number>;
    CapacityUtilization: number;
  };
  breakdown: {
    SalaryCost: number;
    TempCost: number;
    OTCost: number;
    OutsourcingCost: number;
    MarketingCost: number;
    QualityCost: number;
    VarCost: number;
    FixedCost: number;
    InterestCost: number;
    HiringCost: number;
    TrainingCost: number;
  };
  roundScore: number;
  practice?: boolean;
}

// Utility functions
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

const eps = 1e-6;

/**
 * Main simulation engine function
 * Processes one round for all teams using game theory and operations management models
 */
export function simulateRound(
  config: SimulationConfig,
  decisionsByTeam: Record<string, TeamDecision>,
  prevTeamStates: Record<string, TeamState>,
  roundInfo: { id: number; type: 'practice' | 'real' }
): Record<string, RoundResult> {
  
  const results: Record<string, RoundResult> = {};
  const teamIds = Object.keys(decisionsByTeam);
  
  // Step 1: Calculate updated productivity and quality for each team
  const updatedStates: Record<string, TeamState> = {};
  
  for (const teamId of teamIds) {
    const prevState = prevTeamStates[teamId] || { Prod: 1.0, Q: 50, Cash: 1000000, Debt: 0 };
    const decision = decisionsByTeam[teamId];
    
    // Productivity update
    const theta_train = 0.02; // training coefficient
    const newProd = Math.max(0.7, 
      prevState.Prod * (1 - config.defaults.decay_prod) + 
      theta_train * decision.trainingIntensity
    );
    
    // Quality update  
    const lambda_q = 0.001; // quality investment coefficient
    const zeta_train = 0.5; // training quality coefficient
    const newQ = clamp(0, 100,
      prevState.Q * (1 - config.defaults.decay_quality) +
      lambda_q * decision.qualityInvestment +
      zeta_train * decision.trainingIntensity
    );
    
    updatedStates[teamId] = {
      ...prevState,
      Prod: newProd,
      Q: newQ
    };
  }

  // Step 2: Calculate market scores and demand for each segment
  const marketScores: Record<string, Record<string, number>> = {};
  const totalDemand: Record<string, number> = {};
  
  for (const segment of config.segments) {
    marketScores[segment] = {};
    
    // Calculate base demand (simplified - no seasonal/trend factors for now)
    totalDemand[segment] = config.baseDemand[segment];
    
    // Calculate average price for relative pricing
    const prices = teamIds.map(teamId => decisionsByTeam[teamId].priceBySegment[segment]);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    // Calculate scores for each team in this segment
    for (const teamId of teamIds) {
      const decision = decisionsByTeam[teamId];
      const state = updatedStates[teamId];
      
      const relPrice = decision.priceBySegment[segment] / (avgPrice + eps);
      const waitPenalty = 0; // Simplified - would calculate based on capacity utilization
      
      const score = Math.exp(-config.weights.eta[segment] * relPrice) *
                   (1 + config.weights.mu[segment] * Math.log(1 + decision.marketingBySegment[segment] / 1000)) *
                   (1 + config.weights.kappa[segment] * state.Q / 100) *
                   (1 - config.weights.rho[segment] * waitPenalty);
      
      marketScores[segment][teamId] = Math.max(0, score);
    }
  }

  // Step 3: Calculate market shares and bookings
  const marketShares: Record<string, Record<string, number>> = {};
  const bookings: Record<string, Record<string, number>> = {};
  
  for (const segment of config.segments) {
    const totalScore = Object.values(marketScores[segment]).reduce((a, b) => a + b, 0);
    marketShares[segment] = {};
    bookings[segment] = {};
    
    for (const teamId of teamIds) {
      const share = totalScore > 0 ? marketScores[segment][teamId] / totalScore : 1 / teamIds.length;
      marketShares[segment][teamId] = share;
      bookings[segment][teamId] = share * totalDemand[segment];
    }
  }

  // Step 4: Calculate capacity and served units for each team
  for (const teamId of teamIds) {
    const decision = decisionsByTeam[teamId];
    const state = updatedStates[teamId];
    const prevState = prevTeamStates[teamId] || { Prod: 1.0, Q: 50, Cash: 1000000, Debt: 0, prevHeadcount: 10 };
    
    // Calculate required hours
    let reqHours = 0;
    for (const segment of config.segments) {
      reqHours += bookings[segment][teamId] * config.servTimeHours[segment];
    }
    
    // Calculate capacity
    const permHoursCap = decision.permHeadcount * 160 * state.Prod;
    const maxOTHours = permHoursCap * (decision.otCapPct / 100);
    const actualOTHours = Math.min(maxOTHours, Math.max(0, reqHours - permHoursCap));
    const totalCapHrs = permHoursCap + actualOTHours + decision.tempHours + decision.outsourcedHours;
    
    // Calculate served units
    const capacityRatio = totalCapHrs > 0 ? Math.min(1, totalCapHrs / reqHours) : 0;
    const servedUnits: Record<string, number> = {};
    let totalRevenue = 0;
    
    for (const segment of config.segments) {
      servedUnits[segment] = bookings[segment][teamId] * capacityRatio;
      totalRevenue += servedUnits[segment] * decision.priceBySegment[segment];
    }

    // Calculate costs
    const headcountChange = decision.permHeadcount - (prevState.prevHeadcount || 10);
    const hiringCost = Math.max(0, headcountChange) * config.costs.C_hire;
    const firingCost = Math.max(0, -headcountChange) * config.costs.C_fire;
    
    const salaryCost = decision.permHeadcount * config.costs.W_perm * (1 + decision.payPremiumPct / 100);
    const tempCost = decision.tempHours * config.costs.W_temp;
    const otCost = actualOTHours * config.costs.W_perm * config.costs.phi_ot / 160;
    const outsourcingCost = decision.outsourcedHours * config.costs.C_outsrc;
    const trainingCost = decision.permHeadcount * config.costs.C_train * decision.trainingIntensity;
    const marketingCost = Object.values(decision.marketingBySegment).reduce((a, b) => a + b, 0);
    const qualityCost = decision.qualityInvestment;
    const varCost = Object.values(servedUnits).reduce((a, b) => a + b, 0) * config.costs.VarCost;
    const fixedCost = config.costs.FixedOverhead;
    const interestCost = Math.max(0, state.Debt) * config.financial.interest_rate;
    
    const totalCosts = salaryCost + tempCost + otCost + outsourcingCost + trainingCost + 
                      marketingCost + qualityCost + varCost + fixedCost + interestCost + 
                      hiringCost + firingCost;
    
    const pbt = totalRevenue - totalCosts;
    const tax = Math.max(0, pbt) * config.financial.tax_rate;
    const netProfit = pbt - tax;

    // Calculate satisfaction metrics
    const csat = clamp(0, 100, 50 + (state.Q - 50) * 0.5 + (capacityRatio > 0.9 ? 10 : capacityRatio > 0.7 ? 5 : -10));
    const workloadFactor = reqHours / Math.max(permHoursCap, 1);
    const esat = clamp(0, 100, 50 + decision.payPremiumPct * 2 + decision.trainingIntensity * 2 - 
                      Math.max(0, workloadFactor - 1) * 20);
    
    // Calculate financial ratios
    const roce = config.financial.CE > 0 ? (netProfit / config.financial.CE) * 100 : 0;
    const profitPerEmployee = decision.permHeadcount > 0 ? netProfit / decision.permHeadcount : 0;
    const capacityUtilization = totalCapHrs > 0 ? (reqHours / totalCapHrs) * 100 : 0;
    
    // Overall market share (weighted average)
    const overallMarketShare = config.segments.reduce((sum, segment) => {
      return sum + marketShares[segment][teamId] * (totalDemand[segment] / Object.values(totalDemand).reduce((a, b) => a + b, 0));
    }, 0);

    results[teamId] = {
      teamId,
      metrics: {
        Revenue: totalRevenue,
        NetProfit: netProfit,
        MarketShare: { ...marketShares.Retail && { Retail: marketShares.Retail[teamId] }, ...marketShares.SME && { SME: marketShares.SME[teamId] } },
        CSAT: csat,
        ESAT: esat,
        ROCE: roce,
        ProfitPerEmployee: profitPerEmployee,
        UnitsServed: servedUnits,
        CapacityUtilization: capacityUtilization
      },
      breakdown: {
        SalaryCost: salaryCost,
        TempCost: tempCost,
        OTCost: otCost,
        OutsourcingCost: outsourcingCost,
        MarketingCost: marketingCost,
        QualityCost: qualityCost,
        VarCost: varCost,
        FixedCost: fixedCost,
        InterestCost: interestCost,
        HiringCost: hiringCost,
        TrainingCost: trainingCost
      },
      roundScore: 0, // Will be calculated in normalization step
      practice: roundInfo.type === 'practice'
    };

    // Update team state
    updatedStates[teamId] = {
      ...updatedStates[teamId],
      Cash: state.Cash + netProfit - decision.dividend + decision.debtChange,
      Debt: state.Debt + decision.debtChange,
      prevHeadcount: decision.permHeadcount
    };
  }

  // Step 5: Normalize scores across teams
  if (teamIds.length > 1) {
    const metrics = ['NetProfit', 'CSAT', 'ESAT', 'ROCE'];
    const normalizedMetrics: Record<string, Record<string, number>> = {};
    
    // Calculate min/max for each metric
    for (const metric of metrics) {
      const values = teamIds.map(teamId => {
        switch (metric) {
          case 'NetProfit': return results[teamId].metrics.NetProfit;
          case 'CSAT': return results[teamId].metrics.CSAT;
          case 'ESAT': return results[teamId].metrics.ESAT;
          case 'ROCE': return results[teamId].metrics.ROCE;
          default: return 0;
        }
      });
      
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const range = maxVal - minVal + eps;
      
      normalizedMetrics[metric] = {};
      for (const teamId of teamIds) {
        const value = values[teamIds.indexOf(teamId)];
        normalizedMetrics[metric][teamId] = (value - minVal) / range;
      }
    }
    
    // Calculate composite scores
    for (const teamId of teamIds) {
      const overallMarketShare = Object.values(results[teamId].metrics.MarketShare).reduce((a, b) => a + b, 0) / config.segments.length;
      
      const compositeScore = 
        config.scoring_weights.w_profit * normalizedMetrics.NetProfit[teamId] +
        config.scoring_weights.w_ms * overallMarketShare +
        config.scoring_weights.w_csat * (results[teamId].metrics.CSAT / 100) +
        config.scoring_weights.w_esat * (results[teamId].metrics.ESAT / 100) +
        config.scoring_weights.w_roe * normalizedMetrics.ROCE[teamId];
      
      results[teamId].roundScore = compositeScore * 100; // Scale to 0-100
    }
  }

  return results;
}

// Default simulation configuration (AegisCare)
export const defaultSimulationConfig: SimulationConfig = {
  simulationId: "sim_aegis_01",
  title: "AegisCare SME Service Simulation",
  rounds: [
    { id: 1, name: "Practice", type: "practice", duration_mins: 20 },
    { id: 2, name: "Round 1", type: "real", duration_mins: 30 },
    { id: 3, name: "Round 2", type: "real", duration_mins: 30 }
  ],
  segments: ["Retail", "SME"],
  baseDemand: { Retail: 1000, SME: 600 },
  servTimeHours: { Retail: 2.5, SME: 3.5 },
  priceBounds: { min: 1000, max: 10000 },
  weights: {
    eta: { Retail: 1.0, SME: 1.2 },
    mu: { Retail: 0.35, SME: 0.25 },
    kappa: { Retail: 0.6, SME: 0.6 },
    rho: { Retail: 0.4, SME: 0.45 }
  },
  financial: {
    interest_rate: 0.01,
    tax_rate: 0.25,
    CE: 5000000
  },
  costs: {
    W_perm: 60000,
    W_temp: 400,
    phi_ot: 1.5,
    C_hire: 40000,
    C_fire: 20000,
    C_train: 5000,
    VarCost: 1000,
    FixedOverhead: 300000,
    C_outsrc: 1500
  },
  scoring_weights: {
    w_profit: 0.5,
    w_ms: 0.2,
    w_csat: 0.15,
    w_esat: 0.1,
    w_roe: 0.05
  },
  defaults: {
    base_wait_days: 0.2,
    SLA_days: 1.0,
    decay_prod: 0.05,
    decay_quality: 0.05
  }
};