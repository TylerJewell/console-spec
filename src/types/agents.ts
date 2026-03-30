export type AgentOperationalStatus = "active" | "idle" | "processing";

export interface AgentStatus {
  id: string;
  name: string;
  domain: string;
  status: AgentOperationalStatus;
  lastUpdated: string;
  description: string;
}
