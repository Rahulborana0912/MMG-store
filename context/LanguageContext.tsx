'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  topTrustMessage: {
    en: 'Natural Stone Slabs & Tiles Directly from Rajasthan & South India Quarries',
    hi: 'राजस्थान और दक्षिण भारत की खदानों से सीधे प्राकृतिक मार्बल और ग्रेनाइट पत्थर',
  },
  genuineStoneNotice: {
    en: '100% Genuine Natural Stone • No Ceramic',
    hi: '100% असली प्राकृतिक पत्थर • कोई सिरेमिक टाइल नहीं',
  },
  home: { en: 'Home', hi: 'होम' },
  marble: { en: 'Marble', hi: 'मार्बल' },
  granite: { en: 'Granite', hi: 'ग्रेनाइट' },
  stoneTiles: { en: 'Stone Tiles / Pieces', hi: 'पत्थर टाइल्स / टुकड़े' },
  collections: { en: 'Collections', hi: 'कलेक्शन' },
  compare: { en: 'Compare', hi: 'तुलना करें' },
  aboutUs: { en: 'About Us', hi: 'हमारे बारे में' },
  contact: { en: 'Contact', hi: 'संपर्क करें' },
  search: { en: 'Search', hi: 'खोजें' },
  login: { en: 'Login', hi: 'लॉग इन' },
  getQuote: { en: 'Get a Quote', hi: 'रेट पता करें' },
  callUs: { en: 'Call Us', hi: 'कॉल करें' },
  whatsappUs: { en: 'WhatsApp Us', hi: 'व्हाट्सएप करें' },
  whatsappShowroom: { en: 'WhatsApp Showroom', hi: 'व्हाट्सएप पर बात करें' },
  menu: { en: 'Menu', hi: 'मेनू' },

  // Back Button
  back: { en: 'Back', hi: 'वापस जाएं' },
  backToPrevious: { en: 'Back to Previous Page', hi: 'पिछले पेज पर वापस जाएं' },
  backToHome: { en: 'Back to Home', hi: 'होम पेज पर जाएं' },
  backToCatalogue: { en: 'Back to Catalogue', hi: 'कैटलॉग पर वापस जाएं' },

  // Hero Section
  heroTitle1: { en: 'Natural Stone.', hi: 'असली प्राकृतिक पत्थर।' },
  heroTitle2: { en: 'Timeless Spaces.', hi: 'खूबसूरत और टिकाऊ घर।' },
  heroSubtitle: {
    en: 'Direct suppliers of premium Indian and imported marble slabs, granites, and natural stone tiles. Sourced responsibly and delivered directly to your project site across India.',
    hi: 'भारत भर में घरों और प्रोजेक्ट्स के लिए सीधे खदानों से उच्च गुणवत्ता वाले मार्बल स्लैब, मजबूत ग्रेनाइट और प्राकृतिक पत्थर टाइलें। बिना किसी बिचौलिये के उचित दाम पर।',
  },
  exploreCollection: { en: 'Explore Collection', hi: 'सभी पत्थर देखें' },
  naturalStoneOnly: { en: '100% Natural Stone', hi: '100% असली पत्थर' },
  naturalStoneOnlySub: { en: 'Zero artificial or ceramic tiles', hi: 'कोई बनावटी या सिरेमिक टाइल नहीं' },
  gangsawCalibrated: { en: 'Full Gangsaw Slabs', hi: 'पूरे बड़े स्लैब' },
  gangsawCalibratedSub: { en: 'Standard 18mm & 20mm thickness', hi: 'पक्की 18mm और 20mm मोटाई' },
  physicalInspection: { en: 'Physical Inspection', hi: 'सामने देखकर पसंद करें' },
  physicalInspectionSub: { en: 'Kelwa showroom inventory', hi: 'केलवा यार्ड में लाइव स्टॉक उपलब्ध' },
  quarryPricing: { en: 'Direct Quarry Pricing', hi: 'सीधा खदान रेट' },
  quarryPricingSub: { en: 'Transparent rates in ₹/sq.ft.', hi: 'प्रति वर्ग फुट (sq.ft.) पारदर्शी दाम' },

  // Quick Categories
  explorePortfolio: { en: 'Explore Our Natural Stone Portfolio', hi: 'हमारे प्राकृतिक पत्थरों की किस्में' },
  explorePortfolioSub: {
    en: 'We exclusively process 100% natural earth-extracted stones. Choose from large gangsaw slabs or precision cut-to-size pieces.',
    hi: 'हम केवल धरती से निकले असली पत्थरों का काम करते हैं। आप बड़े पूरे स्लैब या तैयार साइज के कटे हुए पत्थर चुन सकते हैं।',
  },
  slabsAndTiles: { en: 'Slabs & Tiles', hi: 'स्लैब और टाइल्स' },
  marbleDesc: {
    en: 'Makrana White, Morwad, Italian Statuario, Rainforest Green, and classic Indian white & coloured marble.',
    hi: 'मकराना वाइट, मोरवाड़, इटैलियन स्टैचुआरियो, ग्रीन मार्बल और बेहतरीन भारतीय मार्बल पत्थर।',
  },
  graniteDesc: {
    en: 'Black Galaxy, Tan Brown, Steel Grey, Imperial Red, and high-strength granites for countertops & flooring.',
    hi: 'ब्लैक गैलेक्सी, टैन ब्राउन, स्टील ग्रे, रेड ग्रेनाइट - किचन प्लेटफॉर्म और मजबूत फर्श के लिए उत्तम।',
  },
  stoneTilesDesc: {
    en: 'Kota Stone, Jaisalmer Sandstone, and calibrated cut-to-size natural stone pieces. Strictly zero ceramic.',
    hi: 'कोटा स्टोन, जैसलमेर पीला पत्थर और कटिंग साइज प्राकृतिक टाइलें। 100% प्राकृतिक पत्थर, नो सिरेमिक।',
  },

  // Slab vs Tile Clarity
  formatClarity: { en: 'Format Clarity', hi: 'स्लैब और टाइल में अंतर' },
  slabsVsTilesTitle: { en: 'Understanding Slabs vs. Tiles at MMG', hi: 'आसान भाषा में समझें: स्लैब क्या है और टाइल क्या है?' },
  slabsVsTilesDesc: {
    en: 'Every product in our inventory is clearly marked as either a SLAB or a TILE / PIECE so you know exactly what you are ordering.',
    hi: 'हमारी वेबसाइट पर हर पत्थर पर स्पष्ट लिखा है कि वह बड़ा स्लैब है या कटा हुआ टाइल, ताकि आप अपनी जरूरत के अनुसार सही चुनाव कर सकें।',
  },
  largeSlabsTitle: { en: 'Large Gangsaw Slabs', hi: 'बड़े पूरे स्लैब (SLAB)' },
  largeSlabsDesc: {
    en: 'Cut from full rock blocks. Ideal for seamless living room flooring, bookmatch walls, and full kitchen platforms.',
    hi: 'बड़ी चट्टानों से कटे बड़े स्लैब। पूरे हॉल के फर्श, डिजाइनर दीवार और बिना जोड़ वाले किचन प्लेटफॉर्म के लिए सबसे अच्छे होते हैं।',
  },
  tilesTitle: { en: 'Calibrated Natural Tiles', hi: 'कटे हुए टाइल्स / टुकड़े (TILE)' },
  tilesDesc: {
    en: 'Pre-cut square or rectangular natural stone pieces. Faster to lay, minimal on-site cutting wastage, and easy to handle.',
    hi: 'तय साइज में कटे हुए प्राकृतिक पत्थर (जैसे 2×2 या 2×1 फुट)। लगाने में आसान और लेबर व कटिंग का खर्च कम होता है।',
  },

  // Product Card & Detail
  slab: { en: 'SLAB', hi: 'स्लैब' },
  tile: { en: 'TILE / PIECE', hi: 'टाइल / टुकड़ा' },
  available: { en: 'Available', hi: 'उपलब्ध है' },
  lowStock: { en: 'Low Stock', hi: 'कम स्टॉक बचा है' },
  soldOut: { en: 'Sold Out', hi: 'बिक चुका है' },
  onRequest: { en: 'On Request', hi: 'मांग पर उपलब्ध' },
  price: { en: 'Price', hi: 'दाम' },
  perSqft: { en: 'per sq.ft.', hi: 'प्रति वर्ग फुट' },
  perPiece: { en: 'Per piece', hi: 'प्रति टुकड़ा' },
  viewDetails: { en: 'View Details', hi: 'पूरी जानकारी देखें' },
  addToCompare: { en: 'Add to Compare', hi: 'तुलना में जोड़ें' },
  inCompare: { en: 'In Compare', hi: 'तुलना में जुड़ा है' },
  getQuoteNow: { en: 'Get Quote', hi: 'रेट पूछें' },

  // Detail Page Specs
  exFactoryRate: { en: 'Ex-Factory Quarry Rate', hi: 'खदान / यार्ड का सीधा रेट' },
  approxCostPerSlab: { en: 'Approx. Cost per Full Slab', hi: 'एक पूरे स्लैब का अनुमानित मूल्य' },
  specifications: { en: 'Stone Specifications', hi: 'पत्थर की पूरी जानकारी' },
  calibratedThickness: { en: 'Thickness', hi: 'मोटाई' },
  dimensions: { en: 'Dimensions (Length × Width)', hi: 'नाप (लंबाई × चौड़ाई)' },
  approxArea: { en: 'Approx. Area', hi: 'कुल क्षेत्रफल' },
  stockQuantity: { en: 'Stock Available', hi: 'उपलब्ध मात्रा' },
  dispatchLocation: { en: 'Dispatch Location', hi: 'माल रवाना होने का स्थान' },
  naturalVariationNotice: { en: 'Natural Stone Variation Notice', hi: 'प्राकृतिक पत्थर की खासियत (वेरिएशन)' },
  variationDetail: {
    en: 'Being 100% natural earth stone, veins and shade vary naturally from slab to slab. We provide live WhatsApp photos and video calls of actual slabs before dispatch.',
    hi: 'चूंकि यह 100% प्राकृतिक पत्थर है, इसलिए हर स्लैब की धारियां और रंग कुदरती तौर पर थोड़े अलग होते हैं। माल लोड करने से पहले हम आपको व्हाट्सएप पर लाइव फोटो और वीडियो दिखाते हैं।',
  },
  recommendedApplications: { en: 'Recommended Applications', hi: 'कहाँ इस्तेमाल कर सकते हैं' },
  requestFormalQuote: { en: 'Get a Formal Quotation', hi: 'पक्का कोटेशन प्राप्त करें' },
  whatsappTeam: { en: 'WhatsApp MMG Team', hi: 'व्हाट्सएप पर बात करें' },

  // Filters & Search
  filters: { en: 'Filters', hi: 'फ़िल्टर' },
  clearAll: { en: 'Clear All', hi: 'सभी फ़िल्टर हटाएं' },
  material: { en: 'Material', hi: 'पत्थर का प्रकार' },
  format: { en: 'Format', hi: 'आकार (स्लैब / टाइल)' },
  colour: { en: 'Colour', hi: 'रंग' },
  surfaceFinish: { en: 'Surface Finish', hi: 'सतह की फिनिश' },
  thicknessMm: { en: 'Thickness (mm)', hi: 'मोटाई (mm)' },
  maxPrice: { en: 'Max Price / sq.ft.', hi: 'अधिकतम रेट / sq.ft.' },
  sortBy: { en: 'Sort By', hi: 'क्रम में लगाएं' },
  featuredSlabs: { en: 'Featured Slabs', hi: 'खास चुने हुए स्लैब' },
  newArrivals: { en: 'New Arrivals', hi: 'नया माल (न्यू अराइवल)' },
  priceLowHigh: { en: 'Price: Low to High (₹)', hi: 'दाम: कम से ज्यादा (₹)' },
  priceHighLow: { en: 'Price: High to Low (₹)', hi: 'दाम: ज्यादा से कम (₹)' },
  recentlyAdded: { en: 'Recently Added', hi: 'हाल ही में जोड़े गए' },
  searchPlaceholder: { en: 'Search by stone name, code (MMG-...), colour, finish...', hi: 'पत्थर का नाम, कोड, रंग या फिनिश से खोजें...' },
  noMatchingStones: { en: 'No Matching Stones Found', hi: 'इस फ़िल्टर से कोई पत्थर नहीं मिला' },
  resetAllFilters: { en: 'Reset All Filters', hi: 'सभी फ़िल्टर रीसेट करें' },
  showing: { en: 'Showing', hi: 'दिख रहे हैं' },
  options: { en: 'natural stone options', hi: 'प्राकृतिक पत्थर के विकल्प' },

  // Enquiry Modal & Form
  directShowroomEnquiry: { en: 'Direct Showroom Enquiry', hi: 'शो-रूम से सीधा संपर्क' },
  requestStoneQuotation: { en: 'Request a Stone Quotation', hi: 'रेट व कोटेशन के लिए पूछताछ करें' },
  yourName: { en: 'Your Name *', hi: 'आपका नाम *' },
  mobileNumber: { en: 'Mobile Number *', hi: 'मोबाइल नंबर *' },
  whatsappNumber: { en: 'WhatsApp Number (For photos)', hi: 'व्हाट्सएप नंबर (फोटो देखने के लिए)' },
  emailAddress: { en: 'Email Address (Optional)', hi: 'ईमेल पता (वैकल्पिक)' },
  requirementQuantity: { en: 'Requirement / Quantity', hi: 'कितनी मात्रा चाहिए (उदा. 2 स्लैब या 500 sq.ft.)' },
  approxAreaSqft: { en: 'Approx Area (sq.ft.)', hi: 'लगभग क्षेत्रफल (वर्ग फुट)' },
  messageRequirement: { en: 'Message / Special Requirements', hi: 'अपनी बात या विशेष जरूरत लिखें' },
  sendEnquiry: { en: 'Send Enquiry', hi: 'पूछताछ भेजें' },
  sendingEnquiry: { en: 'Sending Enquiry...', hi: 'भेजा जा रहा है...' },
  whatsappDirectly: { en: 'WhatsApp Directly', hi: 'सीधे व्हाट्सएप पर पूछें' },
  enquiryReceived: { en: 'Enquiry Received Successfully!', hi: 'आपकी पूछताछ सफलतापूर्वक मिल गई है!' },
  enquirySuccessMsg: {
    en: 'Our sales representative at Mahadev Marble and Granite will contact you via WhatsApp/Phone shortly with pricing and slab pictures.',
    hi: 'महादेव मार्बल एंड ग्रेनाइट के सेल्स प्रतिनिधि जल्द ही आपको फोन या व्हाट्सएप पर फोटो और रेट भेजेंगे।',
  },

  // Comparison Matrix
  compareMatrixTitle: { en: 'Compare Natural Stones', hi: 'पत्थरों की आमने-सामने तुलना करें' },
  compareSubtitle: {
    en: 'Analyze specifications, thickness, finishes, and square foot pricing side-by-side.',
    hi: 'दोनों पत्थरों के नाप, मोटाई, फिनिश और प्रति वर्ग फुट रेट की आसानी से तुलना करें।',
  },
  clearComparison: { en: 'Clear Comparison', hi: 'तुलना खाली करें' },
  noStonesCompared: { en: 'No Stones Selected for Comparison', hi: 'तुलना के लिए कोई पत्थर नहीं चुना गया' },
  noStonesComparedDesc: {
    en: 'Browse our marble, granite, or natural stone catalogue and click the scale icon on any product card to compare up to 4 stones.',
    hi: 'कैटलॉग में किसी भी पत्थर के तराजू (स्केल) आइकन पर क्लिक करके आप 4 पत्थरों की तुलना कर सकते हैं।',
  },
  feature: { en: 'Feature', hi: 'विशेषता' },
  ratePerSqft: { en: 'Rate / sq.ft.', hi: 'रेट प्रति वर्ग फुट' },
  action: { en: 'Action', hi: 'कार्रवाई' },
  requestQuoteForStone: { en: 'Request Quote', hi: 'रेट पूछें' },

  // Contact Page
  contactTitle: { en: 'Contact Mahadev Marble and Granite', hi: 'महादेव मार्बल एंड ग्रेनाइट से संपर्क करें' },
  contactSubtitle: {
    en: 'Whether you need gangsaw slab photographs, pricing per sq.ft., or directions to visit our stockyard in Raghunathpura, Kelwa, our team is here to assist you.',
    hi: 'स्लैब की फोटो देखने, रेट जानने या रघुनाथपुरा (केलवा) हमारे यार्ड में आकर पत्थर देखने के लिए संपर्क करें।',
  },
  showroomYard: { en: 'Showroom & Yard', hi: 'शो-रूम व स्टॉक यार्ड' },
  showroomAddress: {
    en: 'Mahadev Marble and Granite, Raghunathpura, Kelwa',
    hi: 'महादेव मार्बल एंड ग्रेनाइट, रघुनाथपुरा, केलवा',
  },
  viewOnGoogleMaps: { en: 'View on Google Maps', hi: 'गूगल मैप पर रास्ता देखें' },
  operatingHours: { en: 'Operating Hours', hi: 'खुलने का समय' },
  hoursDetail: { en: 'Mon – Sat: 9:00 AM – 7:30 PM IST', hi: 'सोमवार से शनिवार: सुबह 9:00 से शाम 7:30 बजे तक' },
  sundayDetail: { en: 'Sunday: By Prior Appointment', hi: 'रविवार: पूर्व सूचना / अपॉइंटमेंट पर' },
  sendProjectReq: { en: 'Send a Project Requirement', hi: 'अपनी जरूरत हमें भेजें' },
  sendProjectReqSub: {
    en: 'Provide your square footage or stone requirement for an itemized quotation.',
    hi: 'कमरे या मकान का नाप लिखकर भेजें, हम पक्का कोटेशन देंगे।',
  },
  visitingGuideTitle: { en: 'Visiting Raghunathpura, Kelwa', hi: 'रघुनाथपुरा, केलवा कैसे पहुंचें?' },
  visitingGuideDesc: {
    en: 'Kelwa and Raghunathpura are situated along the National Highway marble belt in Rajasthan, with direct connectivity for freight trucks and visitors.',
    hi: 'रघुनाथपुरा (केलवा) राजस्थान की प्रसिद्ध मार्बल मंडी है, जो नेशनल हाईवे से सीधे जुड़ी हुई है।',
  },
  getDrivingDirections: { en: 'Get Driving Directions', hi: 'रास्ता (दिशानिर्देश) प्राप्त करें' },

  // Customer Portal
  customerPortal: { en: 'Customer Portal', hi: 'ग्राहक खाता' },
  myQuotations: { en: 'My Quotations', hi: 'मेरे कोटेशन' },
  myEnquiries: { en: 'My Enquiries', hi: 'मेरी पूछताछ' },
  profileDetails: { en: 'Profile Details', hi: 'मेरी प्रोफाइल' },
  signOut: { en: 'Sign Out', hi: 'लॉग आउट' },
  printPdf: { en: 'Print / Save PDF', hi: 'प्रिंट करें / PDF सेव करें' },

  // Footer
  footerDesc: {
    en: 'Established Indian natural stone company based in Rajasthan. We specialize in premier Makrana and imported marble slabs, South and North Indian granites, and natural stone tiles.',
    hi: 'राजस्थान की प्रतिष्ठित प्राकृतिक पत्थर कंपनी। हम मकराना वाइट, इटैलियन मार्बल स्लैब, दक्षिण व उत्तर भारत के मजबूत ग्रेनाइट और प्राकृतिक टाइल्स सीधे सप्लाई करते हैं।',
  },
  stoneCatalogue: { en: 'Stone Catalogue', hi: 'पत्थर कैटलॉग' },
  companyAndHelp: { en: 'Company & Help', hi: 'कंपनी और सहायता' },
  allRightsReserved: {
    en: '© MMG — Mahadev Marble and Granite Pvt. Ltd. All Rights Reserved.',
    hi: '© MMG — महादेव मार्बल एंड ग्रेनाइट प्रा. लि. सर्वाधिकार सुरक्षित।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mmg_lang');
      if (stored === 'hi' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mmg_lang', lang);
      window.dispatchEvent(new Event('mmg_lang_change'));
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
