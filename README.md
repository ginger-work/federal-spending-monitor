# Federal Spending Monitor

Monitor federal spending bids, grants, and contracts - automatically filtered to identify public health companies and opportunities.

## Features

- **Real-time Bid Monitoring**: Track new federal contracts, grants, and loans
- **Public Health Filtering**: Automatically identifies public health-related opportunities
- **High-Value Alerts**: Flags bids over $500K for immediate attention
- **Comprehensive Search**: Search by title, agency, or keywords
- **Direct Links**: Links to USAspending.gov for full details
- **Classification System**: AI-powered public health relevance scoring

## Public Health Keywords Tracked

- Healthcare services
- Medical devices
- Pharmaceutical development
- Disease control & prevention
- Mental health services
- Clinical research
- Emergency response
- And 30+ more categories

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment

```bash
git add .
git commit -m "Initial federal spending monitor"
vercel --prod
```

## Data Sources

- **Primary**: USAspending.gov API
- **Backup**: SAM.gov Federal Procurement Data System

## API Integration

To connect real federal spending data:

1. Set `USASPENDING_API_KEY` environment variable
2. Update `lib/api.ts` `fetchUSAspendingBids()` function
3. Uncomment production API calls

## Customization

Edit `lib/public-health-keywords.ts` to:
- Add/remove keywords
- Adjust scoring thresholds
- Add industry classifications
- Customize NAICS codes

## Next Steps

1. Connect to real USAspending.gov API
2. Add email/Slack alerts for new bids
3. Create saved searches & watchlists
4. Add historical trend analysis
5. Build company profile matching
6. Add automated bid response recommendations
