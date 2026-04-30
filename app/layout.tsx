import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Federal Spending Monitor',
  description: 'Track federal bids, grants, and contracts with public health company filtering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-primary">
          {children}
        </div>
      </body>
    </html>
  )
}
