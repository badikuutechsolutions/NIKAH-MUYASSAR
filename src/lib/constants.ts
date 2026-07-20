export const BRAND = {
  name: 'Nikah Muyassar',
  nameAr: 'نكاح ميسر',
  tagline: 'Because every righteous soul deserves to complete half their Deen',
  slogan: 'Tende na Maji Adui ni Zina',
  description: 'A faith-driven digital platform connecting Kenyan Muslims with sponsors to facilitate marriage — because financial barriers should never stand between you and completing half your Deen.',
  email: 'hamoudybadi@gmail.com',
  supportEmail: 'hamoudybadi@gmail.com',
  phone: '+254742773562',
  social: {
    instagram: 'https://instagram.com/nikahmuyassar',
    twitter: 'https://twitter.com/nikahmuyassar',
    facebook: 'https://facebook.com/nikahmuyassar',
  },
} as const

export const COLORS = {
  primary: '#0D7377',
  secondary: '#F4A81D',
  accent: '#E8698A',
  background: '#FFFDF7',
  dark: '#1A1A2E',
  success: '#2ECC71',
  soft: '#FDE8EF',
  lightTeal: '#E8F5F5',
  goldLight: '#FEF3CD',
}

export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#6B7280' },
  { value: 'under_review', label: 'Under Review', color: '#3B82F6' },
  { value: 'info_requested', label: 'Info Requested', color: '#F59E0B' },
  { value: 'approved', label: 'Approved', color: '#10B981' },
  { value: 'sponsored', label: 'Sponsored', color: '#0D7377' },
  { value: 'partially_funded', label: 'Partially Funded', color: '#0D7377' },
  { value: 'fully_funded', label: 'Fully Funded', color: '#F4A81D' },
  { value: 'completed', label: 'Completed', color: '#F4A81D' },
  { value: 'rejected', label: 'Rejected', color: '#EF4444' },
  { value: 'withdrawn', label: 'Withdrawn', color: '#9CA3AF' },
] as const

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'normal', label: 'Normal', color: '#3B82F6' },
  { value: 'high', label: 'High', color: '#F59E0B' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
] as const

export const VERSE_OF_THE_DAY = {
  arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  translation: 'And among His signs is that He created for you from yourselves mates that you may find tranquility in them, and He placed between you affection and mercy.',
  surah: 'Ar-Rum',
  verse: '30:21',
}

export const VERSES_ON_MARRIAGE = [
  {
    arabic: 'وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ',
    translation: 'Marry the unmarried among you and the righteous of your male and female servants. If they should be poor, Allah will enrich them from His bounty.',
    surah: 'An-Nur',
    verse: '24:32',
    explanation: 'This verse is the foundational inspiration for Nikah Muyassar. It reminds us that financial hardship should not be a barrier to marriage, and that Allah Himself promises to enrich those who seek to marry for His sake.',
  },
  {
    arabic: 'هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ',
    translation: 'They are clothing for you and you are clothing for them.',
    surah: 'Al-Baqarah',
    verse: '2:187',
    explanation: 'The metaphor of clothing conveys intimacy, protection, comfort, and mutual adornment in marriage.',
  },
  {
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    translation: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.',
    surah: 'Al-Furqan',
    verse: '25:74',
    explanation: 'A beautiful du\'a asking Allah for the blessing of a spouse and children who bring peace and joy to our hearts.',
  },
  {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    translation: 'And among His signs is that He created for you from yourselves mates that you may find tranquility in them, and He placed between you affection and mercy.',
    surah: 'Ar-Rum',
    verse: '30:21',
    explanation: 'Marriage is described as one of the greatest signs of Allah\'s creation, built on tranquility (sakinah), love (mawaddah), and mercy (rahmah).',
  },
  {
    arabic: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا',
    translation: 'O mankind, fear your Lord, who created you from one soul and created from it its mate and dispersed from both of them many men and women.',
    surah: 'An-Nisa',
    verse: '4:1',
    explanation: 'This verse emphasizes the unity of humanity and the divine origin of the male-female relationship.',
  },
  {
    arabic: 'وَخَلَقْنَاكُمْ أَزْوَاجًا',
    translation: 'And We created you in pairs.',
    surah: 'An-Naba',
    verse: '78:8',
    explanation: 'Allah reminds us that being created in pairs is a fundamental part of our human nature.',
  },
]

export const HADITHS_ON_MARRIAGE = [
  {
    text: 'When a servant marries, he has completed half of his religion, so let him fear Allah regarding the remaining half.',
    narrator: 'Anas ibn Malik',
    source: "Shu'ab al-Iman",
    reference: 'no. 5486',
    grade: 'Hasan',
  },
  {
    text: 'Nothing has been seen for two who love one another like nikah (marriage).',
    narrator: 'Ibn Abbas',
    source: 'Sunan Ibn Majah',
    reference: 'no. 1847',
    grade: 'Sahih',
  },
  {
    text: 'There are three whose help is a right upon Allah: the one striving in the path of Allah, the contracted slave who intends to pay off his contract, and the one who marries wanting chastity.',
    narrator: 'Abu Hurayrah',
    source: 'Sunan at-Tirmidhi',
    reference: 'no. 1655',
    grade: 'Sahih',
  },
  {
    text: 'The best of you is the one who is best to his wife, and I am the best of you to my wives.',
    narrator: 'Ibn Abbas',
    source: 'Sunan at-Tirmidhi',
    reference: 'no. 3895',
    grade: 'Sahih',
  },
  {
    text: 'The world is enjoyment, and the best enjoyment in the world is a righteous wife.',
    narrator: 'Abdullah ibn Amr',
    source: 'Sahih Muslim',
    reference: 'no. 1467',
    grade: 'Sahih',
  },
  {
    text: 'Marry the loving, the fertile, for I will boast of your numbers before the nations on the Day of Resurrection.',
    source: 'Sunan Abu Dawud',
    reference: 'no. 2050',
    grade: 'Sahih',
  },
  {
    text: 'From the happiness of the son of Adam are three things: a righteous wife, a good dwelling, and a good conveyance.',
    narrator: "Sa'd ibn Abi Waqqas",
    source: 'Musnad Ahmad',
    grade: 'Sahih',
  },
  {
    text: 'The most blessed marriage is the one that is easiest (least burdensome).',
    source: 'Bayhaqi',
    grade: 'Hasan',
  },
  {
    text: 'O young men, whoever among you can afford it, let him get married, for it is more effective in lowering the gaze and guarding the private parts.',
    narrator: 'Ibn Mas\'ud',
    source: 'Sahih Bukhari & Sahih Muslim',
    reference: 'no. 5066',
    grade: 'Sahih',
  },
  {
    text: 'A dinar you spend in the way of Allah, a dinar you spend to free a slave, a dinar you give in charity to a poor person, and a dinar you spend on your family — the greatest of these in reward is the one you spend on your family.',
    source: 'Sahih Muslim',
    reference: 'no. 995',
    grade: 'Sahih',
  },
]

export const DUA_FOR_MARRIAGE = {
  arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
  transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqeena imama",
  translation: 'Our Lord, grant us from among our spouses and offspring comfort to our eyes and make us an example for the righteous.',
  reference: 'Surah Al-Furqan 25:74',
}

export const COUNTRIES = [
  'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi', 'South Sudan', 'Ethiopia', 'Somalia',
  'Sudan', 'Egypt', 'Nigeria', 'South Africa', 'Ghana', 'Senegal', 'Mali', 'Niger',
  'Algeria', 'Morocco', 'Tunisia', 'Libya', 'Mauritania', 'Sierra Leone', 'Gambia',
  'Afghanistan', 'Bahrain', 'Bangladesh', 'Indonesia', 'Iran', 'Iraq', 'Jordan',
  'Kuwait', 'Lebanon', 'Malaysia', 'Maldives', 'Oman', 'Pakistan', 'Palestine',
  'Qatar', 'Saudi Arabia', 'Syria', 'Tajikistan', 'Turkey', 'Turkmenistan', 'UAE',
  'Uzbekistan', 'Yemen', 'UK', 'USA', 'Canada', 'France', 'Germany', 'Netherlands',
  'Australia', 'India', 'China', 'Thailand', 'Singapore', 'Philippines', 'Myanmar',
  'Albania', 'Bosnia', 'Kosovo',
].sort(function(a, b) {
  if (a === 'Kenya') return -1;
  if (b === 'Kenya') return 1;
  return a.localeCompare(b);
})

export const CURRENCIES = [
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
]
