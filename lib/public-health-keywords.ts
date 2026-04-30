// Public Health Keywords for Contract/Grant Classification
export const PUBLIC_HEALTH_KEYWORDS = {
  categories: [
    'Healthcare Services',
    'Medical Equipment',
    'Pharmaceutical',
    'Public Health',
    'Disease Control',
    'Mental Health',
    'Biomedical Research',
    'Clinical Services',
    'Emergency Response',
    'Health Administration',
  ],
  
  keywords: [
    // Core healthcare
    'healthcare', 'health services', 'medical', 'clinical', 'hospital',
    'physician', 'nursing', 'emergency medical', 'paramedic',
    
    // Public health
    'public health', 'epidemiology', 'disease control', 'prevention',
    'health department', 'CDC', 'infection control', 'communicable disease',
    'disease surveillance', 'health screening', 'vaccination',
    
    // Specific services
    'mental health', 'behavioral health', 'psychiatry', 'counseling',
    'substance abuse', 'addiction treatment', 'telehealth', 'telemedicine',
    'emergency response', 'disaster relief', 'emergency preparedness',
    
    // Research & development
    'biomedical research', 'clinical research', 'medical research',
    'pharmaceutical development', 'vaccine development', 'drug testing',
    
    // Medical equipment
    'medical device', 'diagnostic equipment', 'surgical equipment',
    'lab equipment', 'imaging equipment', 'patient monitoring',
    
    // Health technology
    'electronic health record', 'EHR', 'health IT', 'medical software',
    'health information system', 'patient data',
    
    // Specific programs
    'Medicare', 'Medicaid', 'VA', 'veterans health', 'TRICARE',
    'Indian Health Service', 'community health center',
    
    // Public health specific
    'epidemiologist', 'public health nurse', 'health educator',
    'health promotion', 'wellness program', 'health equity',
    'maternal health', 'child health', 'pediatric',
    'elder care', 'geriatric', 'long-term care',
    'nursing home', 'assisted living',
    
    // Emergency/Crisis
    'pandemic response', 'epidemic response', 'health emergency',
    'disaster health', 'emergency preparedness', 'crisis management',
  ]
}

export function classifyAsPublicHealth(
  title: string,
  description: string,
  naicsDescription?: string
): { isPublicHealth: boolean; score: number; reasons: string[] } {
  const text = `${title} ${description} ${naicsDescription || ''}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  // Check for exact category matches
  for (const category of PUBLIC_HEALTH_KEYWORDS.categories) {
    if (text.includes(category.toLowerCase())) {
      reasons.push(`Matches category: ${category}`)
      score += 15
    }
  }

  // Check for keyword matches
  for (const keyword of PUBLIC_HEALTH_KEYWORDS.keywords) {
    if (text.includes(keyword.toLowerCase())) {
      reasons.push(`Contains keyword: ${keyword}`)
      score += 5
    }
  }

  // Cap score at 100
  score = Math.min(100, score)

  return {
    isPublicHealth: score >= 20,
    score,
    reasons
  }
}
