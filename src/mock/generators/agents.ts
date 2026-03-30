import type { AgentStatus, AgentOperationalStatus } from "@/types/agents";
import { minutesAgo } from "../utils";

interface AgentDef {
  id: string;
  name: string;
  domain: string;
  status: AgentOperationalStatus;
  description: string;
}

const AGENT_DEFS: AgentDef[] = [
  {
    id: "agent-grid",
    name: "Grid Monitor",
    domain: "grid",
    status: "active",
    description: "Real-time grid monitoring, frequency and voltage tracking, event detection across all sectors.",
  },
  {
    id: "agent-trading",
    name: "Trading Engine",
    domain: "trading",
    status: "processing",
    description: "Automated energy market trading, order management, portfolio optimization, and counterparty risk assessment.",
  },
  {
    id: "agent-forecasting",
    name: "Forecast Analyst",
    domain: "forecasting",
    status: "active",
    description: "Multi-horizon demand, generation, and price forecasting using ensemble ML models with confidence intervals.",
  },
  {
    id: "agent-anomaly",
    name: "Anomaly Sentinel",
    domain: "anomalies",
    status: "active",
    description: "Continuous anomaly detection across grid telemetry, market data, and asset health using statistical and ML methods.",
  },
  {
    id: "agent-assets",
    name: "Asset Manager",
    domain: "assets",
    status: "idle",
    description: "Fleet health monitoring, predictive maintenance scheduling, work order management, and asset lifecycle optimization.",
  },
  {
    id: "agent-dispatch",
    name: "Dispatch Optimizer",
    domain: "dispatch",
    status: "processing",
    description: "Economic dispatch optimization, unit commitment scheduling, and real-time generation balancing using merit order.",
  },
];

export function seedAgentStatuses(): AgentStatus[] {
  return AGENT_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    domain: def.domain,
    status: def.status,
    lastUpdated: minutesAgo(Math.random() * 10),
    description: def.description,
  }));
}
