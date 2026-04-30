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
  const [activeTab, setActiveTab] = useState<'all' | 'awarded' | 'departments'>('all')

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

  const awardedBids = publicHealthBids.filter((bid) => bid.status === 'awarded')

  const departmentBreakdown = publicHealthBids.reduce(
    (acc, bid) => {
      const dept = bid.agency
      if (!acc[dept]) {
        acc[dept] = { count: 0, total: 0, awardees: new Set<string>(), bids: [] }
      }
      acc[dept].count += 1
      acc[dept].total += bid.amount
      acc[dept].bids.push(bid)
      if (bid.awardee) {
        acc[dept].awardees.add(bid.awardee)
      }
      return acc
    },
    {} as Record<
      string,
      { count: number; total: number; awardees: Set<string>; bids: FederalBid[] }
    >
  )

  const filteredBids = publicHealthBids.filter((bid) => {
    const lower = searchTerm.toLowerCase()
    return (
      bid.title.toLowerCase().includes(lower) ||
      bid.agency.toLowerCase().includes(lower) ||
      bid.description.toLowerCase().includes(lower) ||
      (bid.awardee && bid.awardee.toLowerCase().includes(lower))
    )
  })

  const displayBids =
    activeTab === 'awarded'
      ? filteredBids.filter((b) => b.status === 'awarded')
      : filteredBids

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
      {/* Header */}
      <header className="bg-primary border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-accent mb-2">Federal Spending Monitor</h1>
          <p className="text-gray-400">Track bids, awards, and department breakdown for public health contracts</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Total Public Health Bids</p>
            <p className="text-3xl font-bold text-accent">{publicHealthBids.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Awarded Contracts</p>
            <p className="text-3xl font-bold text-green-500">{awardedBids.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">High Value (&gt;$500K)</p>
            <p className="text-3xl font-bold text-yellow-500">{highValueBids.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Departments</p>
            <p className="text-3xl font-bold text-blue-500">{Object.keys(departmentBreakdown).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'all'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            All Bids
          </button>
          <button
            onClick={() => setActiveTab('awarded')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'awarded'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Awarded Contracts
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'departments'
                ? 'text-accent border-b-2 border-accent'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Department Breakdown
          </button>
        </div>

        {/* Search */}
        {activeTab !== 'departments' && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by title, agency, awardee, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>
        )}

        {/* Content by Tab */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">Loading bids...</p>
              </div>
            ) : displayBids.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No bids found. Try a different search.</p>
              </div>
            ) : (
              displayBids.map((bid) => (
                <div key={bid.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{bid.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{bid.agency}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="badge badge-public-health">PUBLIC HEALTH</span>
                        {bid.status === 'awarded' && (
                          <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                            AWARDED
                          </span>
                        )}
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

                  <div className="grid grid-cols-4 gap-4 text-sm border-t border-gray-700 pt-4">
                    <div>
                      <p className="text-gray-500">Deadline</p>
                      <p className="font-semibold">{bid.deadline}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-semibold capitalize">{bid.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Awardee</p>
                      <p className="font-semibold text-blue-400">{bid.awardee || 'Pending'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Award Date</p>
                      <p className="font-semibold">{bid.awardDate || '-'}</p>
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
        )}

        {activeTab === 'awarded' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">Loading awarded contracts...</p>
              </div>
            ) : displayBids.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No awarded contracts found.</p>
              </div>
            ) : (
              displayBids.map((bid) => (
                <div key={bid.id} className="card border-l-4" style={{ borderLeftColor: '#22c55e' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{bid.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{bid.agency}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">AWARDED TO</p>
                          <p className="text-lg font-bold text-green-400">{bid.awardee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">AWARD DATE</p>
                          <p className="text-lg font-bold text-white">{bid.awardDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-3xl font-bold text-green-500">
                        ${(bid.amount / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4">{bid.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm border-t border-gray-700 pt-4">
                    <div>
                      <p className="text-gray-500">Contract Type</p>
                      <p className="font-semibold capitalize">{bid.bidType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Posted Date</p>
                      <p className="font-semibold">{bid.postedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Public Health Score</p>
                      <p className="font-semibold text-green-400">{bid.publicHealthReason}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">Loading department data...</p>
              </div>
            ) : (
              Object.entries(departmentBreakdown)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([dept, data]) => (
                  <div key={dept} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{dept}</h3>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">CONTRACTS</p>
                            <p className="text-2xl font-bold text-accent">{data.count}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">TOTAL VALUE</p>
                            <p className="text-2xl font-bold text-green-500">
                              ${(data.total / 1000000).toFixed(1)}M
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">AWARDEE COUNT</p>
                            <p className="text-2xl font-bold text-blue-500">{data.awardees.size}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {data.awardees.size > 0 && (
                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm font-bold text-gray-300 mb-3">Top Awardees</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(data.awardees).map((awardee) => (
                            <span
                              key={awardee}
                              className="px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full text-sm text-blue-300"
                            >
                              {awardee}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <details className="mt-4 pt-4 border-t border-gray-700">
                      <summary className="cursor-pointer text-sm font-semibold text-accent hover:text-accent/80">
                        View {data.count} Contracts from {dept}
                      </summary>
                      <div className="mt-4 space-y-2">
                        {data.bids.map((bid) => (
                          <div key={bid.id} className="text-sm pl-4 border-l border-gray-700 py-2">
                            <p className="font-semibold text-white">{bid.title}</p>
                            <p className="text-gray-400">
                              {bid.awardee && <span className="text-blue-400">{bid.awardee}</span>}
                              {bid.awardee && <span className="mx-2">•</span>}
                              <span className="text-accent">${(bid.amount / 1000000).toFixed(1)}M</span>
                              {bid.awardDate && <span className="mx-2">•</span>}
                              {bid.awardDate && <span>{bid.awardDate}</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
