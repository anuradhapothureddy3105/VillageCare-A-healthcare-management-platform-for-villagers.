import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Play,
  Video,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Droplets,
  Home,
  Trash2,
  Bug,
  Heart,
  Baby,
  Apple,
  UserCheck,
  ShieldCheck,
  X,
  Volume2,
} from 'lucide-react';
import { AudioPlayerMock } from '../../components/AudioPlayerMock.jsx';

export const TELUGU_HEALTH_VIDEOS = [
  {
    id: 'VID-01-HANDWASH',
    youtubeId: 'V5XG8i4dGg4',
    category: 'Handwashing',
    icon: Sparkles,
    duration: '3:45',
    channel: 'UNICEF India (Telugu) • స్వచ్ఛతా మిషన్',
    title: {
      en: '6 Steps of Proper Handwashing with Soap (Telugu)',
      te: 'సబ్బుతో చేతులు శుభ్రం చేసుకునే 6 సరైన పద్ధతులు - డయేరియా నివారణ',
    },
    description: {
      en: 'Learn the six critical handwashing steps using soap and flowing water before meals and after toilet use to prevent stomach infections.',
      te: 'భోజనానికి ముందు మరియు మరుగుదొడ్డి వాడిన తర్వాత సబ్బుతో 20 సెకన్ల పాటు చేతుల వేళ్లు, గోళ్లు శుభ్రం చేసుకునే విధానం.',
    },
    keyTakeaways: [
      { en: 'Rub palms, back of hands, and under fingernails for at least 20 seconds.', te: 'కనీసం 20 సెకన్ల పాటు అరచేతులు, వేళ్ల సందులు మరియు గోళ్ల కింద సబ్బుతో రుద్దండి.' },
      { en: 'Cuts diarrhea and cholera transmission by nearly 48%.', te: 'డయేరియా మరియు కలరా వంటి ప్రమాదకర వ్యాధుల వ్యాప్తిని 48% వరకు తగ్గిస్తుంది.' },
    ],
  },
  {
    id: 'VID-02-WATER',
    youtubeId: 'W3_K2v5lF_0',
    category: 'Safe Drinking Water',
    icon: Droplets,
    duration: '4:15',
    channel: 'Arogya Vani • జల్ జీవన్ మిషన్ ఆంధ్రప్రదేశ్',
    title: {
      en: 'Safe Drinking Water Storage & Disinfection in Villages',
      te: 'గ్రామాల్లో సురక్షిత తాగునీటి నిల్వ, కుళాయి కుండల వాడకం & మరిగించే పద్ధతి',
    },
    description: {
      en: 'Demonstrates why drinking water vessels must remain tightly covered and how boiling destroys waterborne pathogens during the rainy season.',
      te: 'తాగునీటి కుండలపై ఎల్లప్పుడూ మూత ఉంచడం, గ్లాసు ముంచకుండా కుళాయి ద్వారా నీరు తీసుకోవడం మరియు వర్షాకాలంలో నీటిని మరిగించి చల్లార్చే పద్ధతి.',
    },
    keyTakeaways: [
      { en: 'Never dip fingers or tumblers directly into drinking water vessels.', te: 'కుండలో నేరుగా చేతులు లేదా గ్లాసులను ముంచవద్దు; పొడవాటి గరిటె లేదా కుళాయి వాడండి.' },
      { en: 'Boil water vigorously for 1-2 minutes during monsoon floods.', te: 'వర్షాకాలంలో నీరు మసకగా ఉన్నప్పుడు కనీసం 1-2 నిమిషాలు బాగా మరిగించి చల్లార్చండి.' },
    ],
  },
  {
    id: 'VID-03-MOSQUITO',
    youtubeId: 'q8F9pBqWj7U',
    category: 'Mosquito Prevention',
    icon: Bug,
    duration: '5:10',
    channel: 'National Vector Borne Disease Control (NVBDCP Telugu)',
    title: {
      en: 'Dengue & Malaria Prevention: Friday Dry Day in Andhra Pradesh',
      te: 'డెంగ్యూ, మలేరియా నివారణ: ప్రతీ శుక్రవారం "డ్రై డే" పాటించండి',
    },
    description: {
      en: 'How Aedes mosquitoes breed in freshwater containers, flower pots, and uncleaned coolers around village houses and how to break the cycle.',
      te: 'ఇంటి చుట్టూ కొబ్బరి బొండాలు, కూలర్లు, తొట్లలో నిల్వ ఉన్న నీటిని తొలగించి వారానికి ఒకసారి డ్రై డే పాటించడం ద్వారా డెంగ్యూ దోమలను నివారించండి.',
    },
    keyTakeaways: [
      { en: 'Empty and dry all containers once a week to destroy mosquito larvae.', te: 'కూలర్లు, కుండీలలోని నిల్వ నీటిని వారానికి ఒకసారి పారబోసి ఎండబెట్టండి.' },
      { en: 'Pregnant mothers and children must sleep under bed nets.', te: 'గర్భిణీ స్త్రీలు మరియు చిన్నపిల్లలు తప్పనిసరిగా రాత్రి వేళల్లో దోమతెరలు వాడాలి.' },
    ],
  },
  {
    id: 'VID-04-MATERNAL',
    youtubeId: 'lZcQk3_8kP8',
    category: 'Maternal Health',
    icon: Heart,
    duration: '6:30',
    channel: 'AP Health & PMSMA (ఆంధ్రప్రదేశ్ వైద్య ఆరోగ్య శాఖ)',
    title: {
      en: 'Antenatal Care (ANC) & Nutrition for Pregnant Women (Telugu)',
      te: 'గర్భిణీ స్త్రీల జాగ్రత్తలు, పౌష్టికాహారం & 4 సార్లు తప్పనిసరి వైద్య తనిఖీలు',
    },
    description: {
      en: 'Official PMSMA guidance on 4 mandatory antenatal visits, daily iron-folic acid intake, managing blood pressure, and hospital deliveries.',
      te: 'పెంటపాడు ప్రాథమిక ఆరోగ్య కేంద్రంలో 4 సార్లు తప్పనిసరి వైద్య తనిఖీలు, ప్రతి నెలా 9వ తేదీన PMSMA ప్రత్యేక శిబిరం మరియు రక్తహీనత నివారణ సలహాలు.',
    },
    keyTakeaways: [
      { en: 'Attend PMSMA specialist check-ups on the 9th of every month at Pentapadu PHC.', te: 'ప్రతి నెలా 9వ తేదీన పెంటపాడు PHC లో జరిగే PMSMA క్లినిక్‌కు తప్పక హాజరుకండి.' },
      { en: 'Take Iron & Folic Acid tablets daily after the first trimester.', te: 'డాక్టరు సూచించిన విధంగా రోజూ ఐరన్ మరియు ఫోలిక్ యాసిడ్ మాత్రలు వేసుకోండి.' },
    ],
  },
  {
    id: 'VID-05-SANITATION',
    youtubeId: 'm4E2pW9cZ1Y',
    category: 'Household Sanitation',
    icon: Home,
    duration: '4:45',
    channel: 'Swachh Bharat Mission (Grameen Telugu)',
    title: {
      en: '100% Toilet Usage & Safe Waste Disposal in Villages',
      te: 'వ్యక్తిగత మరుగుదొడ్ల వినియోగం మరియు పరిసరాల పరిశుభ్రత ప్రాముఖ్యత',
    },
    description: {
      en: 'Why open defecation causes severe intestinal worm infections in children and how individual household latrines safeguard family dignity.',
      te: 'బహిరంగ మలవిసర్జన వల్ల సూక్ష్మక్రిములు వ్యాపించి పిల్లలలో ఎదుగుదల లోపిస్తుంది. ప్రతి ఇంట్లో మరుగుదొడ్డిని మాత్రమే ఉపయోగించాలి.',
    },
    keyTakeaways: [
      { en: 'Always wear slippers when using the latrine and wash with soap after.', te: 'మరుగుదొడ్డికి వెళ్లేటప్పుడు చెప్పులు వేసుకోండి, బయటకు వచ్చాక సబ్బుతో కడగండి.' },
      { en: 'Dispose child feces directly into the toilet pan, never in open fields.', te: 'చిన్నపిల్లల మలాన్ని కూడా మరుగుదొడ్డిలోనే వేయాలి; పొలాల్లో వేయకూడదు.' },
    ],
  },
  {
    id: 'VID-06-NUTRITION',
    youtubeId: 'b7T1zY8xK3Q',
    category: 'Nutrition & Balanced Diet',
    icon: Apple,
    duration: '5:20',
    channel: 'National Institute of Nutrition (ICMR-NIN Hyderabad)',
    title: {
      en: 'Affordable Village Nutrition: Drumstick Leaves, Millets & Pulses',
      te: 'తక్కువ ఖర్చుతో పౌష్టికాహారం: మునగాకు, రాగి జావ, ఆకుకూరలు మరియు పప్పులు',
    },
    description: {
      en: 'Explains how locally available moringa (drumstick leaves), amla, jaggery, and finger millets eradicate anemia and weakness without costly tonics.',
      te: 'ఖరీదైన టానిక్కులు అవసరం లేకుండా స్థానికంగా దొరికే మునగాకు, బెల్లం, రాగులు, జామకాయలతో సంపూర్ణ ఆరోగ్యం మరియు రక్తం ఎలా పెంచుకోవచ్చో చూపిస్తుంది.',
    },
    keyTakeaways: [
      { en: 'Moringa (drumstick leaves) provides 7x more vitamin C than oranges and 4x more iron than spinach.', te: 'మునగాకులో విటమిన్-సి, ఐరన్ మరియు కాల్షియం పుష్కలంగా లభిస్తాయి.' },
      { en: 'Drink ragi malt with jaggery for strong bones and hemoglobin.', te: 'రాగి జావ మరియు బెల్లం వాడకం వల్ల ఎముకలు దృఢంగా మారి రక్తహీనత తగ్గుతుంది.' },
    ],
  },
  {
    id: 'VID-07-WASTE',
    youtubeId: 'k9P3wX8zL1M',
    category: 'Waste Management',
    icon: Trash2,
    duration: '3:50',
    channel: 'Swachh Andhra Corporation • గ్రామ పంచాయతీ పారిశుధ్యం',
    title: {
      en: 'Wet & Dry Waste Segregation: Clean Streets for Pentapadu',
      te: 'తడి చెత్త మరియు పొడి చెత్త వేరుచేసి పంచాయతీ బండికి అందించే విధానం',
    },
    description: {
      en: 'Demonstrates home-level waste segregation into green (wet organic) and blue (dry plastic) bins, and explains why burning plastic damages child lungs.',
      te: 'ఆకుపచ్చ బుట్టలో కూరగాయ వ్యర్థాలు, నీలం బుట్టలో ప్లాస్టిక్ వేయాలి. ప్లాస్టిక్ కాల్చడం వల్ల పిల్లలకు ఊపిరితిత్తుల వ్యాధులు వస్తాయి.',
    },
    keyTakeaways: [
      { en: 'Hand over segregated waste directly to the morning panchayat cart.', te: 'ఉదయం వచ్చే పంచాయతీ పారిశుధ్య బండికే వేరుచేసిన చెత్తను ఇవ్వండి.' },
      { en: 'Do not dump plastic waste into canal banks or street corners.', te: 'కాలువల గట్లు లేదా రోడ్ల పక్కన చెత్తను ఎట్టిపరిస్థితుల్లోనూ పారవేయవద్దు.' },
    ],
  },
  {
    id: 'VID-08-MENSTRUAL',
    youtubeId: 'x6R2yV1zP4N',
    category: 'Menstrual Hygiene',
    icon: Heart,
    duration: '4:40',
    channel: 'UNICEF India Adolescent Health (Telugu)',
    title: {
      en: 'Safe Menstrual Hygiene & Dignified Sanitary Disposal (Telugu)',
      te: 'సురక్షిత ఋతుక్రమ పరిశుభ్రత, నాప్‌కిన్లు మార్చే సమయం & కాగితంలో చుట్టి పారవేత',
    },
    description: {
      en: 'Gentle, confidential guidance for village women and adolescent girls on changing sanitary pads every 4-6 hours and safe wrapping.',
      te: 'కిశోర బాలికలు మరియు మహిళలకు ఋతుక్రమ సమయంలో పాటించాల్సిన జాగ్రత్తలు, ప్రతి 4-6 గంటలకు నాప్‌కిన్ మార్చడం మరియు సూర్యరశ్మిలో బట్టలు ఆరబెట్టడం.',
    },
    keyTakeaways: [
      { en: 'Change sanitary pads every 4 to 6 hours to prevent bacterial infections.', te: 'ఇన్ఫెక్షన్లు రాకుండా ఉండటానికి ప్రతి 4 నుండి 6 గంటలకొకసారి ప్యాడ్ మార్చాలి.' },
      { en: 'Wrap used pads in newspaper before putting into waste bins.', te: 'వాడిన ప్యాడ్లను కాగితంలో చుట్టి మాత్రమే చెత్తబుట్టలో వేయాలి, కాలువల్లో వేయవద్దు.' },
    ],
  },
  {
    id: 'VID-09-CHILD',
    youtubeId: 'v8N4tY3xW2P',
    category: 'Child Health & Immunization',
    icon: Baby,
    duration: '5:15',
    channel: 'Universal Immunization Programme (UIP AP)',
    title: {
      en: 'National Child Immunization Schedule from Birth to 5 Years',
      te: 'పిల్లల టీకాల పట్టిక - పుట్టినప్పటి నుండి 5 సంవత్సరాల వరకు వేయించాల్సిన టీకాలు',
    },
    description: {
      en: 'Explains BCG, Polio, Pentavalent, Rotavirus, and Measles-Rubella vaccines given free of cost at Pentapadu Anganwadi centres.',
      te: 'పెంటపాడు అంగన్‌వాడీ కేంద్రాలలో ఉచితంగా ఇచ్చే పోలియో, పెంటావాలెంట్, రోటా వైరస్ మరియు తట్టు టీకాల సమగ్ర వివరాలు.',
    },
    keyTakeaways: [
      { en: 'Exclusive breastfeeding for the first 6 months is the child’s first vaccine.', te: 'మొదటి 6 నెలల వరకు తల్లిపాలు మాత్రమే పట్టించాలి; నీరు కూడా పట్టకూడదు.' },
      { en: 'Always bring the Mother-Child Protection (MCP) card to the village clinic.', te: 'గ్రామ ఆరోగ్య దినం నాడు తల్లి-పిల్లల సంరక్షణ కార్డును ఆశా వర్కర్‌కు చూపించండి.' },
    ],
  },
];

export const AwarenessCentre = () => {
  const { lang } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Handwashing',
    'Safe Drinking Water',
    'Mosquito Prevention',
    'Maternal Health',
    'Household Sanitation',
    'Nutrition & Balanced Diet',
    'Waste Management',
    'Menstrual Hygiene',
    'Child Health & Immunization',
  ];

  const filteredVideos = TELUGU_HEALTH_VIDEOS.filter((v) => {
    const matchCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchSearch =
      !search ||
      v.title.te.toLowerCase().includes(search.toLowerCase()) ||
      v.title.en.toLowerCase().includes(search.toLowerCase()) ||
      v.description.te.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-emerald-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
            <Video className="w-4 h-4 text-white" />
            <span>తెలుగు ఆరోగ్య అవగాహన వీడియోల కేంద్రం • Telugu Health Awareness Video Hub</span>
          </div>
          <span className="text-xs bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 px-3 py-1 rounded-full font-semibold">
            Pentapadu Village Community Service
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
          {lang === 'te'
            ? 'గ్రామీణ ఆరోగ్య & పరిశుభ్రత తెలుగు వీడియో గైడ్స్'
            : 'Telugu Health & Hygiene Awareness Video Library'}
        </h1>

        <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
          {lang === 'te'
            ? 'చదవలేని గ్రామ ప్రజల కోసం స్వచ్ఛ భారత్, ప్రపంచ ఆరోగ్య సంస్థ (WHO), జాతీయ ఆరోగ్య మిషన్ (NHM) మరియు నిపుణులైన వైద్యులు రూపొందించిన సులభమైన తెలుగు వీడియోలు.'
            : 'Curated, easy-to-understand Telugu health awareness videos covering handwashing, safe drinking water, mosquito control, maternal antenatal care, and balanced nutrition.'}
        </p>
      </div>

      {/* Audio Announcement Player Callout */}
      <AudioPlayerMock
        textEn="Welcome to Pentapadu Village Health Video Centre. Watch short Telugu educational videos to protect your family from seasonal illnesses."
        textTe="నమస్కారం! పెంటపాడు గ్రామ ఆరోగ్య వీడియో కేంద్రానికి స్వాగతం. క్రింద ఉన్న తెలుగు వీడియోలను చూసి పరిశుభ్రత అలవాట్లు మరియు గర్భిణీల సంరక్షణపై అవగాహన పొందండి."
        title={lang === 'te' ? 'ఆడియో హెచ్చరిక' : 'Voice Guidance'}
      />

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Telugu health videos by topic (e.g. తాగునీరు, డెంగ్యూ, గర్భిణీ, సబ్బు)..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const Icon = video.icon;
          return (
            <div
              key={video.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Video Thumbnail Canvas */}
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group-hover:opacity-95 transition"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80`}
                    alt={video.title.te}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
                    <Icon className="w-3 h-3" />
                    <span>{video.category}</span>
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-5 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span className="truncate">{video.channel}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedVideo(video)}
                    className="font-bold text-sm text-slate-900 group-hover:text-red-700 transition cursor-pointer line-clamp-2 leading-snug"
                  >
                    {video.title.te}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {video.description.te}
                  </p>

                  {/* Key Takeaways */}
                  <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] space-y-1.5 text-slate-700">
                    <span className="font-extrabold text-emerald-950 text-[10px] uppercase tracking-wider block">
                      ముఖ్య అంశాలు / Key Rules:
                    </span>
                    {video.keyTakeaways.map((takeaway, i) => (
                      <div key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3 h-3 text-brand-600 shrink-0 mt-0.5" />
                        <span>{lang === 'te' ? takeaway.te : takeaway.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-1">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'te' ? 'వీడియో చూడండి' : 'Watch Video'}</span>
                </button>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title.te)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-red-500" />
                <span className="font-bold text-xs truncate max-w-md">
                  {selectedVideo.title.te}
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title.te}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Modal Video Details */}
            <div className="p-6 space-y-4 max-h-60 overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 uppercase">
                  {selectedVideo.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {selectedVideo.title.te}
                </h3>
                <h4 className="text-xs text-slate-500 font-medium">
                  {selectedVideo.title.en}
                </h4>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedVideo.description.te}
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">
                  ఈ వీడియో ద్వారా గ్రామ ప్రజలు నేర్చుకోవాల్సినవి / Key Actions:
                </div>
                {selectedVideo.keyTakeaways.map((k, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-900">{k.te}</div>
                      <div className="text-slate-500 text-[11px]">{k.en}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                <span>Source: {selectedVideo.channel}</span>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedVideo.title.te)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline font-bold flex items-center space-x-1"
                >
                  <span>Watch on YouTube App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
