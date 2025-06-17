export interface DbUser {
  id: number
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface DbBudget {
  id: number
  user_id: number
  total_amount: number
  categories_json: any
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface DbExpense {
  id: number
  user_id: number
  budget_id: number
  amount: number
  category: string
  description?: string
  date: string
  created_at: string
  updated_at: string
}

// Tipi per le operazioni
export interface CreateUserData {
  email: string
  name?: string
}

export interface CreateBudgetData {
  user_id: number
  total_amount: number
  categories_json: any
  month: number
  year: number
}

export interface CreateExpenseData {
  user_id: number
  budget_id: number
  amount: number
  category: string
  description?: string
  date: string
}
