
  const countries = [
    { 
      code: "+972", 
      name: { he: "ישראל", en: "Israel" }, 
      flag: "🇮🇱",
      pattern: /^5[0-9]{8}$/
    },
    { 
      code: "+1", 
      name: { he: "ארה״ב", en: "United States" }, 
      flag: "🇺🇸",
      pattern: /^[2-9][0-9]{9}$/
    },
    { 
      code: "+44", 
      name: { he: "בריטניה", en: "United Kingdom" }, 
      flag: "🇬🇧",
      pattern: /^7[0-9]{9}$/
    },
    { 
      code: "+33", 
      name: { he: "צרפת", en: "France" }, 
      flag: "🇫🇷",
      pattern: /^[67][0-9]{8}$/
    },
    { 
      code: "+49", 
      name: { he: "גרמניה", en: "Germany" }, 
      flag: "🇩🇪",
      pattern: /^1[5-7][0-9]{8,9}$/
    },
    { 
      code: "+39", 
      name: { he: "איטליה", en: "Italy" }, 
      flag: "🇮🇹",
      pattern: /^3[0-9]{8,9}$/
    },
    { 
      code: "+34", 
      name: { he: "ספרד", en: "Spain" }, 
      flag: "🇪🇸",
      pattern: /^[67][0-9]{8}$/
    },
    { 
      code: "+31", 
      name: { he: "הולנד", en: "Netherlands" }, 
      flag: "🇳🇱",
      pattern: /^6[0-9]{8}$/
    },
    { 
      code: "+41", 
      name: { he: "שוויץ", en: "Switzerland" }, 
      flag: "🇨🇭",
      pattern: /^7[0-9]{8}$/
    },
    { 
      code: "+43", 
      name: { he: "אוסטריה", en: "Austria" }, 
      flag: "🇦🇹",
      pattern: /^6[0-9]{8,10}$/
    },
  ];
  export default countries;