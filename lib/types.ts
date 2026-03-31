export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role_id: string;
  role_name?: string;
  status: "pending" | "active" | "suspended" | "inactive";
  email_verified: boolean;
  kyc_status: "pending" | "submitted" | "approved" | "rejected";
  language: string;
  timezone: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system: boolean;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance: number;
  locked_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: "deposit" | "withdrawal" | "investment" | "return" | "bonus" | "fee" | "refund" | "transfer";
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  reference?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  min_amount: number;
  max_amount?: number;
  roi_percentage: number;
  duration_days: number;
  payout_frequency: "daily" | "weekly" | "monthly" | "quarterly" | "maturity";
  is_active: boolean;
  features?: string[];
  sort_order: number;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name?: string;
  amount: number;
  expected_return: number;
  actual_return: number;
  status: "pending" | "active" | "completed" | "cancelled";
  start_date: string;
  maturity_date: string;
  last_payout_at?: string;
  next_payout_at?: string;
  auto_reinvest: boolean;
  created_at: string;
}

export interface FundingRequest {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  type: "deposit" | "withdrawal";
  method_id?: string;
  method_name?: string;
  amount: number;
  fee: number;
  net_amount: number;
  currency: string;
  status: "pending" | "processing" | "approved" | "rejected" | "completed" | "cancelled";
  proof_url?: string;
  admin_notes?: string;
  user_notes?: string;
  bank_details?: Record<string, unknown>;
  crypto_address?: string;
  crypto_txid?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface FundingMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "crypto" | "card" | "wire" | "other";
  details: Record<string, unknown>;
  instructions?: string;
  is_active: boolean;
  min_amount: number;
  max_amount?: number;
  fee_percentage: number;
  fee_fixed: number;
  processing_time?: string;
  sort_order: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category?: string;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name?: string;
  subject: string;
  message: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assigned_to?: string;
  resolved_at?: string;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
  category: string;
  description?: string;
  is_public: boolean;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_balance: number;
  total_invested: number;
  total_returns: number;
  pending_requests: number;
  active_investments: number;
}

export interface ClientDashboardStats {
  balance: number;
  total_invested: number;
  total_returns: number;
  active_investments: number;
  pending_deposits: number;
  pending_withdrawals: number;
}
