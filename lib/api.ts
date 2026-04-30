import axios from 'axios'
import { FederalBid } from './types'
import { classifyAsPublicHealth } from './public-health-keywords'

// USAspending.gov API endpoint
const USASPENDING_API = 'https://api.usaspending.gov/api/v2'

// Mock data generator for demo
export const generateMockBid = (index: number): FederalBid => {
  const bidTypes = ['contract', 'grant', 'loan'] as const
  const statuses = ['open', 'closed', 'awarded'] as const
  const agencies = [
    'Department of Health & Human Services',
    'National Institutes of Health',
    'Centers for Disease Control',
    'Department of Veterans Affairs',
    'Department of Defense',
    'National Science Foundation',
    'EPA',
    'Department of Homeland Security',
  ]

  const titles = [
    'Healthcare IT System Development',
    'Emergency Response Equipment Supply',
    'Clinical Research Study',
    'Pandemic Preparedness Program',
    'Mental Health Services Contract',
    'Medical Device Testing',
    'Vaccine Development Research',
    'Hospital Supply Management',
    'Telemedicine Platform',
    'Disease Surveillance System',
  ]

  const title = titles[index % titles.length]
  const agency = agencies[index % agencies.length]
  const bidType = bidTypes[index % bidTypes.length]
  const status = statuses[index % statuses.length]
  const amount = 100000 + Math.random() * 5000000

  const classification = classifyAsPublicHealth(title, `${bidType} for federal program`)

  return {
    id: `BID-${index}`,
    title,
    description: `${bidType} opportunity for ${agency}. ${title}. Seeking qualified vendors.`,
    agency,
    bidType,
    amount,
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status,
    awardee: status === 'awarded' ? `Company ${Math.floor(Math.random() * 1000)}` : undefined,
    awardDate: status === 'awarded' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
    url: `https://usaspending.gov/award/${index}`,
    naicsCode: '621000',
    naicsDescription: 'Ambulatory Health Care Services',
    publicHealthCategory: classification.isPublicHealth,
    publicHealthReason: classification.reasons[0],
    keywordMatches: classification.reasons.slice(0, 3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Fetch from USAspending.gov API
export const fetchUSAspendingBids = async (
  limit: number = 50
): Promise<FederalBid[]> => {
  try {
    // In production, call actual API:
    // const response = await axios.get(`${USASPENDING_API}/awards/`, {
    //   params: {
    //     limit,
    //     ordering: '-date_signed',
    //     award_type: ['contracts', 'grants']
    //   }
    // })

    // For MVP, generate mock data
    return Array.from({ length: limit }, (_, i) => generateMockBid(i))
  } catch (error) {
    console.error('USAspending API error:', error)
    return []
  }
}

// Filter bids for public health relevance
export const filterPublicHealthBids = (bids: FederalBid[]): FederalBid[] => {
  return bids.filter((bid) => bid.publicHealthCategory)
}

// Search bids by keywords
export const searchBids = (bids: FederalBid[], query: string): FederalBid[] => {
  const lower = query.toLowerCase()
  return bids.filter((bid) => {
    return (
      bid.title.toLowerCase().includes(lower) ||
      bid.description.toLowerCase().includes(lower) ||
      bid.agency.toLowerCase().includes(lower) ||
      bid.keywordMatches.some((k) => k.toLowerCase().includes(lower))
    )
  })
}

// Alert on new high-value public health bids
export const identifyHighValueBids = (
  bids: FederalBid[],
  minAmount: number = 500000
): FederalBid[] => {
  return bids.filter((bid) => bid.publicHealthCategory && bid.amount >= minAmount)
}
