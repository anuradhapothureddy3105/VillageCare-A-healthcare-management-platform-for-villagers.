import { SystemSetting, Recommendation } from '../models/index.js';

// Default Transparent Rule Base for VillageCare
export const DEFAULT_RULES = [
  {
    id: 'RULE_WATER_STORAGE',
    conditionField: 'sectionC_water.storedInCoveredContainer',
    operator: 'equals',
    conditionValue: false,
    category: 'water',
    priority: 'high',
    icon: 'Droplets',
    title: {
      en: 'Safe Drinking Water Storage Guidance',
      te: 'సురక్షితమైన తాగునీటి నిల్వ మార్గదర్శకాలు',
    },
    description: {
      en: 'Store drinking water only in clean, tightly covered vessels with a ladle/tap to prevent airborne bacterial contamination.',
      te: 'దుమ్ము, సూక్ష్మక్రిములు చేరకుండా తాగునీటిని ఎల్లప్పుడూ మూత ఉన్న శుభ్రమైన పాత్రలలో లేదా కుళాయి ఉన్న కుండలలో మాత్రమే నిల్వ చేయండి.',
    },
    reason: {
      en: 'Survey indicated that household drinking water containers are left uncovered, which increases waterborne microbial contamination risk.',
      te: 'సర్వే ప్రకారం ఇంట్లో తాగునీటి పాత్రలపై సరైన మూత లేకపోవడం గమనించబడింది, ఇది నీటి ద్వారా వ్యాపించే వ్యాధుల ప్రమాదాన్ని పెంచుతుంది.',
    },
    suggestedPractices: [
      {
        en: 'Keep water containers elevated from the floor and always tightly covered with a clean lid.',
        te: 'నీటి పాత్రలను నేలపై కాకుండా ఎత్తైన బల్లపై ఉంచి, శుభ్రమైన మూతతో కప్పి ఉంచండి.',
      },
      {
        en: 'Use a long-handled ladle or a dispenser tap instead of dipping hands into the drinking water.',
        te: 'నీటిలో చేతులు ముంచకుండా పొడవాటి గరిటె లేదా కుళాయి (టాప్) ను ఉపయోగించండి.',
      },
      {
        en: 'Clean water storage vessels thoroughly every day with clean water and scrub.',
        te: 'ప్రతిరోజూ నీటి నిల్వ పాత్రలను బాగా రుద్ది శుభ్రం చేయండి.',
      },
    ],
  },
  {
    id: 'RULE_WATER_TREATMENT',
    conditionField: 'sectionC_water.waterTreatedIfUncertain',
    operator: 'equals',
    conditionValue: false,
    category: 'water',
    priority: 'medium',
    icon: 'ShieldCheck',
    title: {
      en: 'Household Water Disinfection & Boiling Practice',
      te: 'ఇంటి వద్ద నీటి శుద్ధి మరియు మరిగించే పద్ధతి',
    },
    description: {
      en: 'When drinking water purity is doubtful or during monsoon, boil water vigorously for at least 1-2 minutes before consumption.',
      te: 'వర్షాకాలంలో లేదా నీరు కలుషితమైనట్లు అనుమానం ఉన్నప్పుడు నీటిని కనీసం 1-2 నిమిషాలు బాగా మరిగించి, చల్లార్చి తాగండి.',
    },
    reason: {
      en: 'Household reported not treating or boiling drinking water when water clarity or safety is uncertain.',
      te: 'నీటి నాణ్యతపై సందేహం ఉన్నప్పుడు కూడా నీటిని మరిగించడం లేదా శుద్ధి చేయడం లేదని సర్వేలో తేలింది.',
    },
    suggestedPractices: [
      {
        en: 'Boil drinking water until rolling bubbles appear, cool naturally, and store safely.',
        te: 'నీటిని బాగా మరిగించి, మూత పెట్టి చల్లారిన తర్వాతే తాగడానికి వాడండి.',
      },
      {
        en: 'Participate in village chlorination drives organized by Pentapadu Gram Panchayat.',
        te: 'పెంటపాడు గ్రామ పంచాయతీ చేపట్టే క్లోరినేషన్ కార్యక్రమాలలో భాగస్వామ్యం అవ్వండి.',
      },
    ],
  },
  {
    id: 'RULE_HANDWASHING',
    conditionField: 'sectionB_hygiene.regularHandwashingWithSoap',
    operator: 'in',
    conditionValue: ['rarely', 'sometimes'],
    category: 'hygiene',
    priority: 'high',
    icon: 'Sparkles',
    title: {
      en: 'Critical Hand Hygiene with Soap & Water',
      te: 'సబ్బుతో చేతులు శుభ్రం చేసుకునే విధానం',
    },
    description: {
      en: 'Regular handwashing with soap before food preparation, before eating, and after using toilets cuts diarrheal illnesses by up to 48%.',
      te: 'ఆహారం తినే ముందు, వంట చేసే ముందు మరియు మరుగుదొడ్డి వాడిన తర్వాత సబ్బుతో చేతులు కడుక్కోవడం వల్ల అతిసార వ్యాధులు రాకుండా ఉంటాయి.',
    },
    reason: {
      en: 'Household members self-reported only occasional or rare use of soap for handwashing.',
      te: 'కుటుంబ సభ్యులు సబ్బుతో క్రమం తప్పకుండా చేతులు కడుక్కోవడం లేదని సర్వేలో వెల్లడైంది.',
    },
    suggestedPractices: [
      {
        en: 'Follow the 6 steps of handwashing for at least 20 seconds using soap and flowing water.',
        te: 'సబ్బుతో కనీసం 20 సెకన్ల పాటు చేతుల వెనుక భాగం, వేళ్ల మధ్య శుభ్రంగా రుద్ది కడగాలి.',
      },
      {
        en: 'Place soap and water near the kitchen and handwash stations for easy access.',
        te: 'వంటగది మరియు వాష్ బేసిన్ లేదా దొడ్డి వద్ద సబ్బును ఎల్లప్పుడూ అందుబాటులో ఉంచండి.',
      },
    ],
  },
  {
    id: 'RULE_MOSQUITO_STAGNANT_WATER',
    conditionField: 'sectionF_mosquito.stagnantWaterNearHouse',
    operator: 'equals',
    conditionValue: true,
    category: 'mosquito',
    priority: 'high',
    icon: 'Bug',
    title: {
      en: 'Dengue & Malaria Prevention: Source Reduction',
      te: 'డెంగ్యూ, మలేరియా నివారణ: నిల్వ నీటి తొలగింపు',
    },
    description: {
      en: 'Eliminate stagnant water puddles, coconut shells, and unsealed open tanks where Aedes and Anopheles mosquitoes breed.',
      te: 'ఇంటి పరిసరాల్లో నీరు నిల్వ ఉండకుండా చూడండి. కొబ్బరి బోండాలు, పాత టైర్లు, రోళ్లు మరియు తొట్లలో నీరు నిలవనీయకండి.',
    },
    reason: {
      en: 'Stagnant water was identified near the household premises, increasing vector-borne disease transmission risks.',
      te: 'ఇంటి చుట్టూ మురుగు లేదా నిల్వ నీరు ఉన్నట్లు గుర్తించబడింది, ఇది దోమల వృద్ధికి కారణమవుతుంది.',
    },
    suggestedPractices: [
      {
        en: 'Observe a weekly "Dry Day" by emptying and drying all water holding containers around the house.',
        te: 'వారానికి ఒక రోజు "డ్రై డే" గా పాటించి కూలర్లు, కుండీలు, తొట్లలోని నీటిని పారబోసి ఎండబెట్టండి.',
      },
      {
        en: 'Ensure smooth flow in drainage channels and sprinkle bleaching powder / abate where water cannot be drained.',
        te: 'మురుగు కాలువలు సాఫీగా పారేలా చూసుకోండి మరియు నిల్వ నీటిపై బ్లీచింగ్ పౌడర్ చల్లండి.',
      },
    ],
  },
  {
    id: 'RULE_WASTE_DISPOSAL',
    conditionField: 'sectionD_sanitation.wasteDisposalMethod',
    operator: 'in',
    conditionValue: ['open_dumping', 'burning'],
    category: 'sanitation',
    priority: 'high',
    icon: 'Trash2',
    title: {
      en: 'Safe Waste Disposal & Segregation (Swachh Pentapadu)',
      te: 'సురక్షిత చెత్త నిర్వహణ & తడి-పొడి చెత్త వేరుచేయుట',
    },
    description: {
      en: 'Segregate waste into wet (organic) and dry categories. Hand over waste directly to the village panchayat sanitation cart instead of open dumping or burning.',
      te: 'చెత్తను బహిరంగ ప్రదేశాలలో వేయడం లేదా తగలబెట్టడం ఆపండి. తడి మరియు పొడి చెత్తను వేరుచేసి పంచాయతీ పారిశుధ్య బండికి అందించండి.',
    },
    reason: {
      en: 'Household reported disposing waste via open dumping or burning, which generates foul odors, flies, and respiratory irritants.',
      te: 'ఇంట్లోని చెత్తను రోడ్డు పక్కన వేయడం లేదా కాల్చడం జరుగుతుందని సర్వేలో నమోదైంది. ఇది పరిసరాలను కలుషితం చేస్తుంది.',
    },
    suggestedPractices: [
      {
        en: 'Keep two separate dustbins: Green for vegetable/food waste and Blue for plastics/paper.',
        te: 'రెండు వేర్వేరు బుట్టలను ఉంచండి: ఆకుపచ్చ బుట్టలో తడి చెత్త, నీలం బుట్టలో పొడి చెత్త వేయండి.',
      },
      {
        en: 'Do not burn plastic or rubber waste as toxic smoke causes severe breathing difficulties.',
        te: 'ప్లాస్టిక్ చెత్తను ఎట్టిపరిస్థితుల్లోనూ కాల్చవద్దు; అది ఊపిరితిత్తులకు హానికరం.',
      },
    ],
  },
  {
    id: 'RULE_MENSTRUAL_HYGIENE',
    conditionField: 'sectionE_menstrual.safeAwareness',
    operator: 'equals',
    conditionValue: 'needs_improvement',
    category: 'menstrual',
    priority: 'medium',
    icon: 'Heart',
    title: {
      en: 'Safe Menstrual Health & Dignified Disposal Awareness',
      te: 'సురక్షిత ఋతుస్రావ పరిశుభ్రత మరియు సరైన పద్ధతులు',
    },
    description: {
      en: 'Promote safe, clean absorbent materials, frequent changes (every 4-6 hours), and hygienic paper-wrapped disposal to prevent pelvic infections.',
      te: 'ఋతుస్రావ సమయంలో శుభ్రమైన నాప్‌కిన్లు లేదా శుభ్రపరిచిన బట్టలను వాడండి. ప్రతి 4-6 గంటలకు మార్చుకోవడం ఆరోగ్యానికి ఎంతో ముఖ్యం.',
    },
    reason: {
      en: 'Survey feedback identified that the household would benefit from supportive awareness on safe menstrual hygiene practices.',
      te: 'సర్వేలో ఋతుక్రమ పరిశుభ్రత పట్ల అవగాహన మెరుగుపరచవలసిన అవసరం ఉందని గమనించబడింది.',
    },
    suggestedPractices: [
      {
        en: 'Always wash hands before and after changing absorbent materials.',
        te: 'నాప్‌కిన్ మార్చే ముందు మరియు తర్వాత చేతులను సబ్బుతో శుభ్రం చేసుకోండి.',
      },
      {
        en: 'Wrap used pads securely in paper before disposal; never flush down drains or throw in open fields.',
        te: 'వాడిన నాప్‌కిన్లను కాగితంలో చుట్టి చెత్తబుట్టలో వేయండి, మురుగు కాలువలలో వేయకండి.',
      },
    ],
  },
  {
    id: 'RULE_HEALTH_CONCERN_REFERRAL',
    conditionField: 'sectionA_general.existingConditionsDisclosed',
    operator: 'notEquals',
    conditionValue: 'None',
    category: 'general_health',
    priority: 'medium',
    icon: 'Stethoscope',
    title: {
      en: 'Pentapadu PHC Healthcare Consultation Guidance',
      te: 'పెంటపాడు ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) సంప్రదింపు మార్గదర్శకం',
    },
    description: {
      en: 'For any existing illness or recurring symptoms, visit the Pentapadu Primary Health Centre (PHC) or consult your assigned village ASHA/ANM worker.',
      te: 'కుటుంబంలో ఎవరికైనా అనారోగ్య సమస్యలు ఉన్నట్లయితే సమీపంలోని పెంటపాడు ప్రభుత్వ ప్రాథమిక ఆరోగ్య కేంద్రాన్ని (PHC) లేదా ఆశా కార్యకర్తను సంప్రదించండి.',
    },
    reason: {
      en: 'The household voluntarily reported general health concerns during the awareness survey.',
      te: 'సర్వే సమయంలో కుటుంబంలో ఆరోగ్య సమస్యలు ఉన్నట్లు స్వచ్ఛందంగా తెలియజేయబడింది.',
    },
    suggestedPractices: [
      {
        en: 'Visit the nearby Pentapadu PHC for free diagnostic checkups and certified medical advice.',
        te: 'ఉచిత వైద్య పరీక్షలు మరియు సలహాల కొరకు పెంటపాడు PHC కి వెళ్లండి.',
      },
      {
        en: 'Do NOT consume unprescribed medicines or self-medicate.',
        te: 'డాక్టరు చీటీ లేకుండా సొంతంగా మందులు వాడవద్దు.',
      },
    ],
  },
];

// Helper to extract nested property
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
};

// Evaluate rule condition
const evaluateCondition = (survey, rule) => {
  const value = getNestedValue(survey, rule.conditionField);

  switch (rule.operator) {
    case 'equals':
      return value === rule.conditionValue;
    case 'notEquals':
      return value !== rule.conditionValue && value !== undefined && value !== '';
    case 'in':
      return Array.isArray(rule.conditionValue) && rule.conditionValue.includes(value);
    case 'truthy':
      return Boolean(value);
    default:
      return false;
  }
};

/**
 * Generate educational recommendations based on survey responses.
 * Strictly non-diagnostic and educational.
 */
export const generateRecommendationsForSurvey = async (survey) => {
  let activeRules = DEFAULT_RULES;

  try {
    const settings = await SystemSetting.findOne({ key: 'recommendation_rules' });
    if (settings && settings.rules && settings.rules.length > 0) {
      activeRules = settings.rules;
    }
  } catch (err) {
    console.warn('[Engine] Using default rules:', err.message);
  }

  const generatedList = [];

  for (const rule of activeRules) {
    if (evaluateCondition(survey, rule)) {
      const recDoc = {
        recommendationId: `REC-${survey.householdId}-${rule.id}-${Date.now().toString(36)}`,
        surveyId: survey.surveyId || survey._id,
        householdId: survey.householdId,
        title: rule.title,
        description: rule.description,
        reason: rule.reason,
        suggestedPractices: rule.suggestedPractices,
        category: rule.category,
        priority: rule.priority || 'medium',
        icon: rule.icon || 'HeartHandshake',
        status: 'pending',
        isDemoData: survey.isDemoData !== false,
      };

      const saved = await Recommendation.create(recDoc);
      generatedList.push(saved);
    }
  }

  return generatedList;
};
