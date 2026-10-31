import { WeddingData } from '@/types/wedding';

export const initialWeddingData: WeddingData = {
  groomName: "Hosni",
  groomNameAmharic: "ሆስኒ",
  groomFullName: "Hosni Mubarek",
  groomFullNameAmharic: "ሆስኒ ሙባረክ",
  groomParents: "Mubarek Family (የአቶ ሙባረክ ቤተሰቦች)",

  brideName: "Eyerusalem",
  brideNameAmharic: "እየሩሳሌም",
  brideFullName: "Eyerusalem Alemayehu",
  brideFullNameAmharic: "እየሩሳሌም አለማየሁ",
  brideParents: "Alemayehu Family (የአቶ አለማየሁ ቤተሰቦች)",

  weddingDate: "2026-11-15T15:00:00",
  weddingDateAmharic: "እሑድ፣ ህዳር 6፣ 2019 ዓ.ም (ከ9:00 እስከ 12:00)",
  weddingLocationCity: "ልደታ መካነየሱስ፣ አዲስ አበባ (Addis Ababa)",

  religiousQuote: "But I trust in your unfailing love; my heart rejoices in your salvation.",
  religiousQuoteAmharic: "እኔ ግን በቸርነትህ ታመንሁ፥ ልቤም በመድኃኒትህ ደስ ይለዋል።",
  quoteSource: "መዝሙረ ዳዊት 13:5 | Psalm 13:5",

  globalInvitationMessage:
    "We would be honored to have you join us on this beautiful occasion and share in our happiness. Your presence and blessings will mean a lot to us. With love and warm regards,",
  globalInvitationMessageAmharic:
    "በዚህ ውብ እና የተቀደሰ ቀን አብረውን በመሆን ደስታችንን እንድትጋሩ በታላቅ ክብር እንጋብዝዎታለን። መገኘትዎ እና ምርቃትዎ ለእኛ ትልቅ ዋጋ አለው። በፍቅር እና በአክብሮት፣",

  defaultTheme: "habesha-gold",
  backgroundMusicUrl: "/G&B wedding (6).mp3",
  backgroundMusicTitle: "Hosni & Eyerusalem Royal Melody (የሰርግ ዜማ)",

  heroImageUrl: "/images/ethiopian_wedding_couple.jpg",
  coupleAvatarUrl: "/images/ethiopian_couple_holding_hands.jpg",

  dressCode: {
    title: "Habesha Royal Elegance & Formal Attire",
    titleAmharic: "የአለባበስ ሥርዓት (ባህላዊ የሀበሻ ልብስ እና ፎርማል)",
    description: "We would be delighted to see our esteemed guests adorned in modern Habesha Kemis / Tilfi tibeb or elegant formal black-tie attire reflecting gold and royal jewel tones.",
    colors: [
      { name: "Royal Gold (ወርቃማ)", hex: "#D4AF37" },
      { name: "Deep Emerald (አረንጓዴ)", hex: "#064E3B" },
      { name: "Warm Champagne (ሻምፓኝ)", hex: "#F3E8D2" },
      { name: "Pure Ivory White (ነጭ)", hex: "#FDFBF7" },
      { name: "Velvet Burgundy (ቡርጉንዲ)", hex: "#4A0E17" }
    ],
    guidelines: [
      "Traditional Habesha Libs (ሀበሻ ልብስ) with gold/emerald tibeb patterns warmly encouraged.",
      "Gentlemen: Formal Suit / Tuxedo or Traditional Habesha Men's outfit.",
      "Kindly reserve pure white bridal gowns for the bride."
    ]
  },

  schedule: [
    {
      id: "sch-1",
      time: "ከ9:00 እስከ 12:00 (03:00 PM - 06:00 PM)",
      title: "Holy Matrimony & Worship Ceremony",
      titleAmharic: "የቃልኪዳን እና የአምልኮ ጊዜ",
      description: "በእግዚአብሔር ፊት የጋብቻ ቃልኪዳን መፈጸምና የምስጋና አምልኮ ሥነ-ሥርዓት።",
      location: "ልደታ መካነየሱስ (ከዲአፍሪክ ሆቴል ወረድ ብሎ አምስተኛ ፖሊስ ጣቢያ)",
      icon: "Church",
      eventType: "church"
    },
    // {
    //   id: "sch-2",
    //   time: "ከ12:30 ጀምሮ (06:30 PM Onwards)",
    //   title: "Dinner & Celebration",
    //   titleAmharic: "የእራት እና የደስታ መጋራት ፕሮግራም",
    //   description: "ከቤተሰብ እና ከወዳጅ ዘመድ ጋር የፍቅር እራት እና የደስታ ጊዜ።",
    //   location: "አዲስ አበባ (Addis Ababa)",
    //   icon: "UtensilsCrossed",
    //   eventType: "reception"
    // }
  ],

  venues: [
    {
      id: "ven-1",
      name: "Lideta Mekane Yesus Church",
      nameAmharic: "ልደታ መካነየሱስ",
      tag: "የቃልኪዳን እና የአምልኮ ጊዜ (Ceremony)",
      address: "📍ከዲአፍሪክ ሆቴል ወረድ ብሎ አምስተኛ ፖሊስ ጣቢያ አካባቢ፣ አዲስአበባ, ኢትዮጵያ",
      time: "ከ9:00 እስከ 12:00",
      imageUrl: "/images/ethiopian_couple_holding_hands.jpg",
      googleMapsUrl: "https://maps.google.com/?q=Lideta+Mekane+Yesus+Church+Addis+Ababa",
      coordinates: { lat: 9.0125, lng: 38.7410 }
    }
  ],

  bankAccounts: [
    {
      id: "bank-1",
      bankName: "Telebirr (ቴሌብር)",
      accountName: "Hosni Mubarek / Eyerusalem Alemayehu",
      accountNumber: "0911234567",
      logoType: "telebirr",
      branch: "Addis Ababa"
    },
    {
      id: "bank-2",
      bankName: "Commercial Bank of Ethiopia (CBE / ንግድ ባንክ)",
      accountName: "Hosni Mubarek & Eyerusalem Alemayehu",
      accountNumber: "1000456789123",
      logoType: "cbe",
      branch: "Finfine Branch (ፊንፊኔ ቅ/ፍ)"
    },
    {
      id: "bank-3",
      bankName: "Awash Bank (አዋሽ ባንክ)",
      accountName: "Hosni Mubarek",
      accountNumber: "01320894567100",
      logoType: "awash",
      branch: "Lideta Branch"
    },
    {
      id: "bank-4",
      bankName: "Bank of Abyssinia (አቢሲኒያ ባንክ)",
      accountName: "Eyerusalem Alemayehu",
      accountNumber: "45892134",
      logoType: "abyssinia",
      branch: "Mexico Branch"
    }
  ],

  gallery: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
      caption: "Our timeless commitment to love and togetherness.",
      category: "prewedding"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      caption: "Golden sunset moments in Entoto Hills.",
      category: "prewedding"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200&auto=format&fit=crop",
      caption: "Celebrating Ethiopian royal heritage & tradition.",
      category: "cultural"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      caption: "Vows inscribed in our hearts forever.",
      category: "ceremony"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
      caption: "Surrounded by peace, grace, and love.",
      category: "story"
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop",
      caption: "Joyful smiles ahead of our big day.",
      category: "prewedding"
    }
  ],

  loveStory: [
    {
      id: "ls-1",
      year: "2021",
      title: "When Stars Aligned",
      titleAmharic: "የመጀመሪያው የፍቅር ጅማሮ",
      description: "We crossed paths at a coffee summit in Addis Ababa. One shared Macchiato turned into hours of laughter and conversation that neither of us wanted to end.",
      imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ls-2",
      year: "2023",
      title: "Adventures Across Abyssinia",
      titleAmharic: "የጋራ ጉዞዎቻችን",
      description: "From exploring the historic obelisks of Axum to quiet sunsets in Langano, our bond deepened with every step and every shared dream.",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ls-3",
      year: "2025",
      title: "The Sunset Proposal in Wenchi",
      titleAmharic: "የጋብቻ ጥያቄ በወንጪ ሐይቅ",
      description: "Against the breathtaking crater lake of Wenchi, Abebe knelt down with a promise of forever. With tears of joy, Selamawit whispered 'Yes!'",
      imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "ls-4",
      year: "2026",
      title: "The Holy Union & Forever",
      titleAmharic: "የጋብቻ ቀንና ዘላለማዊ ቃልኪዳን",
      description: "Now we stand ready before God, our families, and our dearest friends to seal our eternal covenant.",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
    }
  ],

  guests: [
    {
      id: "guest-dawit",
      slug: "dr-dawit-solomon",
      name: "Dr. Dawit Solomon & Dr. Bethlehem",
      nameAmharic: "ዶ/ር ዳዊት ሰሎሞን እና ዶ/ር ቤተልሔም",
      phone: "+251 91 100 2233",
      email: "dawit.solomon@gmail.com",
      group: "VIP Guests",
      allowedPlusOnes: 2,
      tableNumber: "Royal Table #1 (VIP)",
      useCustomMessage: true,
      customMessage: "Dear Dr. Dawit & Dr. Bethlehem, your guidance, prayers, and heartfelt mentorship have shaped our personal and professional lives. It would be our highest honor to have you join us at our VIP head table as we exchange our vows.",
      customMessageAmharic: "የተከበሩ ዶ/ር ዳዊት እና ዶ/ር ቤተልሔም፡ በህይወታችን ላደረጋችሁልን ያልተቋረጠ ድጋፍና ምክር የላቀ ምስጋና እያቀረብን፤ በክብር እንግዳነት በመገኘት የጋብቻችንን ልዩ ቀን እንድታደምቁልን በታላቅ አክብሮት ጋብዘናችኋል።",
      themeId: "habesha-gold",
      invitedEvents: ["church", "reception", "melse"],
      rsvpStatus: "attending",
      attendingPlusOnes: 2,
      dietaryRestrictions: "Strict fasting vegetarian option for reception dinner",
      notes: "Looking forward to celebrating this glorious day!",
      rsvpUpdatedAt: "2026-10-01T10:00:00"
    },
    {
      id: "guest-yohannes",
      slug: "ato-yohannes-bekele",
      name: "Ato Yohannes Bekele & Family",
      nameAmharic: "አቶ ዮሐንስ በቀለ እና ባለቤታቸው ከነቤተሰባቸው",
      phone: "+251 91 234 5678",
      email: "yohannes.b@yahoo.com",
      group: "Groom Family",
      allowedPlusOnes: 4,
      tableNumber: "Family Pavilion A - Table #3",
      useCustomMessage: true,
      customMessage: "Dear Uncle Yohannes & Family, having you travel all the way from Hawassa to stand by our side brings immense joy to our hearts. We look forward to receiving your paternal blessings.",
      customMessageAmharic: "ውድ አጎታችን አቶ ዮሐንስ እና ቤተሰብዎ፡ ከሐዋሳ ድረስ በመጓዝ በጋብቻችን ቀን ከጎናችን በመሆን የበረከት እጃችሁን እንድትዘረጉልንና ደስታችንን እንድትጋሩ በታላቅ ፍቅርና አክብሮት ተጠርተዋል።",
      themeId: "emerald-velvet",
      invitedEvents: ["church", "reception", "melse", "kebero"],
      rsvpStatus: "attending",
      attendingPlusOnes: 3,
      notes: "Will arrive in Addis on Friday morning!",
      rsvpUpdatedAt: "2026-10-03T15:20:00"
    },
    {
      id: "guest-almaz",
      slug: "w-ro-almaz-tefera",
      name: "W/ro Almaz Tefera & Guest",
      nameAmharic: "ወ/ሮ አልማዝ ተፈራ ከነአጃቢያቸው",
      phone: "+251 92 888 9900",
      group: "Bride Family",
      allowedPlusOnes: 1,
      tableNumber: "Table #7 (Bride's Extended Family)",
      useCustomMessage: false, // Uses global invitation message
      themeId: "burgundy-luxury",
      invitedEvents: ["church", "reception", "melse"],
      rsvpStatus: "pending",
      attendingPlusOnes: 1
    },
    {
      id: "guest-samuel",
      slug: "samuel-kebede",
      name: "Samuel Kebede (Best Man Crew)",
      nameAmharic: "ሳሙኤል ከበደ",
      phone: "+251 93 456 7890",
      email: "samuel.k@outlook.com",
      group: "Friends",
      allowedPlusOnes: 1,
      tableNumber: "Table #12 (Friends & Groomsmen)",
      useCustomMessage: true,
      customMessage: "Sammy my brother! You've been there from day one through thick and thin. Get your dancing shoes ready, we are tearing down the dancefloor at Skylight!",
      customMessageAmharic: "ሳሚ ወንድሜ፡ ከመጀመሪያው ቀን ጀምሮ አብረኸን ነበርክ። በስካይላይት ሆቴል የሰርጉን ምሽት በደስታና በጭፈራ እናደምቀዋለን፤ ተዘጋጅተህ ጠብቀን!",
      themeId: "midnight-obsidian",
      invitedEvents: ["church", "reception", "melse", "afterparty"],
      rsvpStatus: "attending",
      attendingPlusOnes: 1,
      notes: "Suit is tailored and ready!",
      rsvpUpdatedAt: "2026-10-04T18:45:00"
    },
    {
      id: "guest-helen",
      slug: "helen-michael",
      name: "Helen Michael & Guest",
      nameAmharic: "ሄለን ሚካኤል",
      phone: "+251 94 555 1234",
      group: "Colleagues",
      allowedPlusOnes: 1,
      tableNumber: "Table #15 (Tech & Strategy Team)",
      useCustomMessage: true,
      customMessage: "Dear Helen, working alongside you has been a blessing. We are delighted to share this joyous personal milestone with you and our wonderful team!",
      customMessageAmharic: "ውድ ሄለን፡ በስራችን አብረን እንዳሳለፍነው ሁሉ በህይወቴ ትልቁን የደስታ ቀን ከአንቺና ከስራ ባልደረቦቼ ጋር ማክበር ትልቅ ደስታ ይሰጠኛል።",
      themeId: "champagne-pearl",
      invitedEvents: ["reception"],
      rsvpStatus: "pending",
      attendingPlusOnes: 1
    }
  ],

  wishes: [],
  showLoveStory: false,
  showGallery: false,
  autoScrollSpeed: 40,
  adminPasscode: "772019",
  storyCardDurationSeconds: 12,
  storyCardScrollHeightVh: 320,
  storyCardTransitionDuration: 0.75,
  storyCardAutoAdvance: true,
  storyCardPauseOnHover: true,
  dataVersion: 3,
};
