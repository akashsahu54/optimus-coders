export const emotionKeywords = {
  angry: ['frustrated', 'angry', 'problem', 'nahi ho raha', 'din se', 'refund', 'complaint', 'koi response nahi'],
  happy: ['thank you', 'great', 'good', 'excellent', 'dhanyavaad', 'achha', 'perfect'],
  concerned: ['urgent', 'immediately', 'abhi', 'turant', 'emergency', 'help', 'please'],
};

export const responses = {
  angry: [
    "Main samajh sakta hoon aap frustrated hain. Main aapki madad karne ke liye yahan hoon.",
    "Mujhe afsos hai aapko problem ho rahi hai. Main ise turant resolve karunga.",
    "Aapki pareshani samajh raha hoon. Kripya mujhe details batayein."
  ],
  happy: [
    "Bahut achha! Main khush hoon ki aap satisfied hain.",
    "Dhanyavaad! Kya main aur kuch help kar sakta hoon?",
    "Great! Aapka feedback humein motivate karta hai."
  ],
  concerned: [
    "Main aapki urgency samajh raha hoon. Turant action le raha hoon.",
    "Ye urgent matter hai. Main ise priority pe handle karunga.",
    "Aapki help ke liye main yahan hoon. Batayein kya problem hai."
  ],
  neutral: [
    "Ji, main sun raha hoon. Aap apni baat continue karein.",
    "Kripya mujhe aur details batayein.",
    "Main aapki madad ke liye ready hoon."
  ]
};

export const avatarImages = {
  neutral: '🙂',
  happy: '😊',
  angry: '😟',
  concerned: '🤔'
};

export const initialStats = {
  totalCalls: 24,
  angryCalls: 5,
  neutralCalls: 15,
  urgentEscalations: 3
};

export const urgentAlerts = [
  { id: 1, user: '#1234', emotion: 'angry', message: 'Main 3 din se call kar raha hoon!', time: '2 min ago' },
  { id: 2, user: '#5678', emotion: 'urgent', message: 'Mera payment stuck hai!', time: '5 min ago' },
  { id: 3, user: '#9012', emotion: 'angry', message: 'Koi response nahi mil raha!', time: '8 min ago' },
];
