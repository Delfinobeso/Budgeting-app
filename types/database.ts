export interface DbUser {
  id: number
  email: string
  name: string | null
  password_hash: string
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
  description: string | null
  date: string
  created_at: string
  updated_at: string
}

export interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}
