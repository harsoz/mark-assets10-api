export interface BoldError {
  message?: string;
}

export interface BoldStatus {
  link_id?: string;
  transaction_id?: string;
  total?: number;
  subtotal?: number;
  description?: string;
  reference_id?: string;
  payment_method?: string;
  payer_email?: string;
  transaction_date?: string;
  payment_status?: string;
  errors?: BoldError[];
}