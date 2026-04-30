// Federal Spending Bid/Grant/Contract Data
export interface FederalBid {
  id: string
  title: string
  description: string
  agency: string
  bidType: 'contract' | 'grant' | 'loan'
  amount: number
  postedDate: string
  deadline: string
  status: 'open' | 'closed' | 'awarded'
  awardee?: string
  awardDate?: string
  url: string
  naicsCode?: string
  naicsDescription?: string
  publicHealthCategory: boolean
  publicHealthReason?: string
  keywordMatches: string[]
  createdAt: string
  updatedAt: string
}

export interface PublicHealthKeywords {
  categories: string[]
  keywords: string[]
}

export interface BidAlert {
  id: string
  bidId: string
  title: string
  agency: string
  amount: number
  publicHealthScore: number // 0-100
  matchedKeywords: string[]
  alertDate: string
  read: boolean
}

export interface SearchFilters {
  agency?: string
  bidType?: 'contract' | 'grant' | 'loan'
  amountMin?: number
  amountMax?: number
  publicHealthOnly?: boolean
  sortBy?: 'date' | 'amount' | 'deadline'
  searchTerm?: string
}
