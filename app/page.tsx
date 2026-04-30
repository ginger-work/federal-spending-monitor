'use client'

import { useEffect, useState } from 'react'
import { fetchUSAspendingBids, filterPublicHealthBids, identifyHighValueBids } from '../lib/api'
import { FederalBid } from '../lib/types'

export default function Home() {
  const [bids, setBids] = useState<FederalBid[]>([])
  const [publicHealthBids, setPublicHealthBids] = useState<FederalBid[]>([])
  const [highValueBids, setHighValueBids] = useState<FederalBid[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadBids = async () => {
      setLoading(true)
      const allBids = await fetchUSAspendingBids(100)
      setBids(allBids)
      setPublicHealthBids(filterPublicHealthBids(allBids))
      setHighValueBids(identifyHighValueBids(allBids, 500000))
      setLoading(false)
    }

    loadBids()
  }, [])

  const filteredBids = publicHealthBids.filter((bid) => {
    const lower = searchTerm.toLowerCase()
    return (
      bid.title.toLowerCase().includes(lower) ||
      bid.agency.toLowerCase().includes(lower) ||
      bid.description.toLowerCase().includes(lower)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
      {/* Header */}
      <header className="bg-primary border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-accent mb-2">Federal Spending Monitor</h1>
          <p className="text-gray-400">Track bids, grants, and contracts. Filter for public health.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Total Bids</p>
            <p className="text-3xl font-bold text-accent">{bids.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Public Health Bids</p>
            <p className="text-3xl font-bold text-green-500">{publicHealthBids.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">High Value (&gt;$500K)</p>
            <p className="text-3xl font-bold text-yellow-500">{highValueBids.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, agency, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full"
          />
        </div>

        {/* Bids List */}
        <div className="space-y-4">
          {loading ? (
            <div className="card text-center py-12">
              <p className="text-gray-400">Loading bids...</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400">No public health bids found. Try a different search.</p>
            </div>
          ) : (
            filteredBids.map((bid) => (
              <div key={bid.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{bid.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{bid.agency}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="badge badge-public-health">PUBLIC HEALTH</span>
                      {bid.amount > 500000 && <span className="badge badge-high-value">HIGH VALUE</span>}
                      <span className="badge" style={{ background: '#334' }}>
                        {bid.bidType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-accent">
                      ${(bid.amount / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Posted: {bid.postedDate}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4">{bid.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-700 pt-4">
                  <div>
                    <p className="text-gray-500">Deadline</p>
                    <p className="font-semibold">{bid.deadline}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-semibold capitalize">{bid.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Public Health Reason</p>
                    <p className="font-semibold text-green-400 text-xs">{bid.publicHealthReason}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={bid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View on USAspending.gov →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
