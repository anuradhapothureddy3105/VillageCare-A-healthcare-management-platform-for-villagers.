import bcrypt from 'bcryptjs';
import {
  User,
  Household,
  HealthSurvey,
  Recommendation,
  PregnancyRecord,
  AntenatalAppointment,
  FollowUp,
  AwarenessContent,
  Notification,
  ConsentRecord,
  SystemSetting,
} from '../models/index.js';
import { INITIAL_AWARENESS_DATA } from './awarenessData.js';
import { DEFAULT_RULES, generateRecommendationsForSurvey } from '../services/recommendationEngine.js';

export const PENTAPADU_STREETS = [
  'Ramalayam Veedhi',
  'Gandhi Bomma Center',
  'Main Bazaar Road',
  'SC Colony',
  'BC Colony',
  'Canal Bund Road',
  'Subba Rao Peta',
  'ZP High School Road',
  'Rythu Sangham Street',
  'Panchayat Office Road',
];

export const DEMO_HOUSEHOLDS = [
  {
    householdId: 'HH-PTP-001',
    headOfHousehold: 'Venkata Ramana Rao',
    street: 'Ramalayam Veedhi',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 2, elderly: 1 },
    contactNumber: '9848011221',
    notes: 'Near Sri Ramalayam Temple, Pentapadu',
  },
  {
    householdId: 'HH-PTP-002',
    headOfHousehold: 'Koteswara Rao',
    street: 'Ramalayam Veedhi',
    totalMembers: 5,
    ageGroups: { children: 2, adults: 2, elderly: 1 },
    contactNumber: '9848011222',
    notes: 'Near community drinking water tap',
  },
  {
    householdId: 'HH-PTP-003',
    headOfHousehold: 'Suri Babu',
    street: 'Gandhi Bomma Center',
    totalMembers: 3,
    ageGroups: { children: 0, adults: 2, elderly: 1 },
    contactNumber: '9848011223',
    notes: 'Opposite Milk Collection Center',
  },
  {
    householdId: 'HH-PTP-004',
    headOfHousehold: 'Appa Rao',
    street: 'Gandhi Bomma Center',
    totalMembers: 6,
    ageGroups: { children: 3, adults: 2, elderly: 1 },
    contactNumber: '9848011224',
    notes: 'Joint agricultural family',
  },
  {
    householdId: 'HH-PTP-005',
    headOfHousehold: 'Satyanarayana Murthy',
    street: 'Main Bazaar Road',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 3, elderly: 0 },
    contactNumber: '9848011225',
    notes: 'Near Grama Sachivalayam',
  },
  {
    householdId: 'HH-PTP-006',
    headOfHousehold: 'Nageswara Rao',
    street: 'Main Bazaar Road',
    totalMembers: 5,
    ageGroups: { children: 1, adults: 3, elderly: 1 },
    contactNumber: '9848011226',
    notes: 'Near General Store',
  },
  {
    householdId: 'HH-PTP-007',
    headOfHousehold: 'Ramesh Varma',
    street: 'SC Colony',
    totalMembers: 4,
    ageGroups: { children: 2, adults: 2, elderly: 0 },
    contactNumber: '9848011227',
    notes: 'Near Community Hall',
  },
  {
    householdId: 'HH-PTP-008',
    headOfHousehold: 'Subba Rao',
    street: 'SC Colony',
    totalMembers: 5,
    ageGroups: { children: 2, adults: 2, elderly: 1 },
    contactNumber: '9848011228',
    notes: 'Near public borewell',
  },
  {
    householdId: 'HH-PTP-009',
    headOfHousehold: 'Bala Krishna',
    street: 'SC Colony',
    totalMembers: 3,
    ageGroups: { children: 1, adults: 2, elderly: 0 },
    contactNumber: '9848011229',
    notes: 'Young family with pregnant beneficiary',
  },
  {
    householdId: 'HH-PTP-010',
    headOfHousehold: 'Prasad Raju',
    street: 'BC Colony',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 2, elderly: 1 },
    contactNumber: '9848011230',
    notes: 'Weavers colony lane',
  },
  {
    householdId: 'HH-PTP-011',
    headOfHousehold: 'Krishna Murthy',
    street: 'BC Colony',
    totalMembers: 6,
    ageGroups: { children: 2, adults: 3, elderly: 1 },
    contactNumber: '9848011231',
    notes: 'Close to open drainage line',
  },
  {
    householdId: 'HH-PTP-012',
    headOfHousehold: 'Srinivasa Rao',
    street: 'BC Colony',
    totalMembers: 3,
    ageGroups: { children: 0, adults: 2, elderly: 1 },
    contactNumber: '9848011232',
    notes: 'Elderly care support required',
  },
  {
    householdId: 'HH-PTP-013',
    headOfHousehold: 'Veerabhadra Rao',
    street: 'Canal Bund Road',
    totalMembers: 5,
    ageGroups: { children: 2, adults: 2, elderly: 1 },
    contactNumber: '9848011233',
    notes: 'Next to irrigation canal bund',
  },
  {
    householdId: 'HH-PTP-014',
    headOfHousehold: 'Bhavani Prasad',
    street: 'Canal Bund Road',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 2, elderly: 1 },
    contactNumber: '9848011234',
    notes: 'High mosquito presence near canal',
  },
  {
    householdId: 'HH-PTP-015',
    headOfHousehold: 'Simhachalam',
    street: 'Subba Rao Peta',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 2, elderly: 1 },
    contactNumber: '9848011235',
    notes: 'Near Rythu Seva Kendram',
  },
  {
    householdId: 'HH-PTP-016',
    headOfHousehold: 'Dharma Rao',
    street: 'Subba Rao Peta',
    totalMembers: 5,
    ageGroups: { children: 2, adults: 2, elderly: 1 },
    contactNumber: '9848011236',
    notes: 'Agricultural workers household',
  },
  {
    householdId: 'HH-PTP-017',
    headOfHousehold: 'Mohan Rao',
    street: 'ZP High School Road',
    totalMembers: 4,
    ageGroups: { children: 2, adults: 2, elderly: 0 },
    contactNumber: '9848011237',
    notes: 'Near Government High School Pentapadu',
  },
  {
    householdId: 'HH-PTP-018',
    headOfHousehold: 'Gopala Krishna',
    street: 'ZP High School Road',
    totalMembers: 3,
    ageGroups: { children: 1, adults: 2, elderly: 0 },
    contactNumber: '9848011238',
    notes: 'Good sanitation compliance',
  },
  {
    householdId: 'HH-PTP-019',
    headOfHousehold: 'Pedda Venkateswarlu',
    street: 'Rythu Sangham Street',
    totalMembers: 5,
    ageGroups: { children: 1, adults: 3, elderly: 1 },
    contactNumber: '9848011239',
    notes: 'Near Paddy procurement shed',
  },
  {
    householdId: 'HH-PTP-020',
    headOfHousehold: 'Anjaneyulu',
    street: 'Panchayat Office Road',
    totalMembers: 4,
    ageGroups: { children: 1, adults: 2, elderly: 1 },
    contactNumber: '9848011240',
    notes: 'Close to Pentapadu PHC sub-center',
  },
];

export const DEMO_SURVEY_PROFILES = [
  // Profile 1: Good hygiene compliant household
  {
    sectionA_general: {
      familyMembersCount: 4,
      childrenCount: 1,
      elderlyCount: 1,
      generalHealthConcerns: [],
      existingConditionsDisclosed: 'None',
    },
    sectionB_hygiene: {
      regularHandwashingWithSoap: 'always',
      handwashBeforeEating: true,
      handwashAfterToilet: true,
      basicHygieneFollowed: true,
    },
    sectionC_water: {
      mainSource: 'piped_tap',
      storedInCoveredContainer: true,
      containerCleanedRegularly: true,
      waterTreatedIfUncertain: true,
      treatmentMethod: 'boiling',
    },
    sectionD_sanitation: {
      toiletAvailability: 'individual_household',
      wasteDisposalMethod: 'panchayat_collection',
      wetDrySegregation: true,
      wasteAccumulationNearHouse: false,
      drainageCondition: 'covered_drain',
    },
    sectionE_menstrual: {
      askedWithConsent: true,
      safeAwareness: 'good',
      accessToCleanMaterials: true,
      safeDisposalAwareness: true,
      notes: 'Safe disposal practiced regularly.',
    },
    sectionF_mosquito: {
      stagnantWaterNearHouse: false,
      waterInContainersDiscarded: true,
      drainCleanliness: 'clean',
      mosquitoNetsOrProtectionUsed: true,
    },
  },
  // Profile 2: Water & Mosquito hygiene needs
  {
    sectionA_general: {
      familyMembersCount: 5,
      childrenCount: 2,
      elderlyCount: 1,
      generalHealthConcerns: ['Seasonal fever'],
      existingConditionsDisclosed: 'Joint pains in elderly',
    },
    sectionB_hygiene: {
      regularHandwashingWithSoap: 'sometimes',
      handwashBeforeEating: true,
      handwashAfterToilet: true,
      basicHygieneFollowed: true,
    },
    sectionC_water: {
      mainSource: 'public_tap',
      storedInCoveredContainer: false, // Triggers safe drinking water storage guidance
      containerCleanedRegularly: false,
      waterTreatedIfUncertain: false, // Triggers boiling rule
      treatmentMethod: 'none',
    },
    sectionD_sanitation: {
      toiletAvailability: 'individual_household',
      wasteDisposalMethod: 'compost_pit',
      wetDrySegregation: false,
      wasteAccumulationNearHouse: false,
      drainageCondition: 'open_drain',
    },
    sectionE_menstrual: {
      askedWithConsent: true,
      safeAwareness: 'moderate',
      accessToCleanMaterials: true,
      safeDisposalAwareness: true,
      notes: '',
    },
    sectionF_mosquito: {
      stagnantWaterNearHouse: true, // Triggers dengue/mosquito source reduction
      waterInContainersDiscarded: false,
      drainCleanliness: 'choked',
      mosquitoNetsOrProtectionUsed: false,
    },
  },
  // Profile 3: Sanitation & Waste disposal needs
  {
    sectionA_general: {
      familyMembersCount: 4,
      childrenCount: 2,
      elderlyCount: 0,
      generalHealthConcerns: ['Cough and breathing issues from burning plastic'],
      existingConditionsDisclosed: 'Asthma in child',
    },
    sectionB_hygiene: {
      regularHandwashingWithSoap: 'rarely', // Triggers critical hand hygiene
      handwashBeforeEating: false,
      handwashAfterToilet: true,
      basicHygieneFollowed: false,
    },
    sectionC_water: {
      mainSource: 'borewell',
      storedInCoveredContainer: true,
      containerCleanedRegularly: true,
      waterTreatedIfUncertain: false,
      treatmentMethod: 'none',
    },
    sectionD_sanitation: {
      toiletAvailability: 'individual_household',
      wasteDisposalMethod: 'open_dumping', // Triggers waste segregation rule
      wetDrySegregation: false,
      wasteAccumulationNearHouse: true,
      drainageCondition: 'open_drain',
    },
    sectionE_menstrual: {
      askedWithConsent: true,
      safeAwareness: 'needs_improvement', // Triggers menstrual hygiene rule
      accessToCleanMaterials: false,
      safeDisposalAwareness: false,
      notes: 'Requested subsidized sanitary napkins from ASHA worker.',
    },
    sectionF_mosquito: {
      stagnantWaterNearHouse: true,
      waterInContainersDiscarded: false,
      drainCleanliness: 'moderate',
      mosquitoNetsOrProtectionUsed: true,
    },
  },
];

export const seedDatabase = async () => {
  console.log('[Seeder] Starting VillageCare Pentapadu Demo Data Seed...');

  // 1. Seed Roles and Users
  const adminSalt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', adminSalt);
  const ashaPassword = await bcrypt.hash('asha123', adminSalt);
  const villagerPassword = await bcrypt.hash('villager123', adminSalt);

  await User.deleteMany({});

  const adminUser = await User.create({
    username: 'admin',
    password: adminPassword,
    fullName: 'Dr. K. Sridevi (PHC Medical Officer / Admin)',
    role: 'admin',
    phone: '9849012345',
    householdId: 'ADMIN-PTP',
    consentGiven: true,
  });

  const ashaUser = await User.create({
    username: 'asha_pentapadu',
    password: ashaPassword,
    fullName: 'M. Padmavathi (Pentapadu ASHA Worker)',
    role: 'health_worker',
    phone: '9849067890',
    householdId: 'HH-PTP-001',
    consentGiven: true,
  });

  const villagerUser = await User.create({
    username: 'villager_ramu',
    password: villagerPassword,
    fullName: 'Venkata Ramana Rao',
    role: 'villager',
    phone: '9848011221',
    householdId: 'HH-PTP-001',
    consentGiven: true,
  });

  console.log('[Seeder] 3 Roles Seeded: admin, asha_pentapadu, villager_ramu');

  // 2. Seed System Settings & Rules
  await SystemSetting.deleteMany({});
  await SystemSetting.create({
    key: 'recommendation_rules',
    rules: DEFAULT_RULES,
    villageName: 'Pentapadu',
    mandal: 'Pentapadu',
    district: 'West Godavari',
  });

  // 3. Seed Awareness Data
  await AwarenessContent.deleteMany({});
  for (const item of INITIAL_AWARENESS_DATA) {
    await AwarenessContent.create(item);
  }

  // 4. Seed 20 Households
  await Household.deleteMany({});
  for (const hh of DEMO_HOUSEHOLDS) {
    await Household.create({
      ...hh,
      village: 'Pentapadu',
      mandal: 'Pentapadu',
      district: 'West Godavari',
      registeredBy: 'M. Padmavathi (ASHA)',
      registrationDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000),
      isDemoData: true,
    });
  }
  console.log(`[Seeder] 20 Pentapadu Households Seeded.`);

  // 5. Seed Surveys and Auto-generate Recommendations for 16 of the 20 households
  await HealthSurvey.deleteMany({});
  await Recommendation.deleteMany({});

  for (let i = 0; i < 16; i++) {
    const hh = DEMO_HOUSEHOLDS[i];
    const profile = DEMO_SURVEY_PROFILES[i % DEMO_SURVEY_PROFILES.length];

    const survey = await HealthSurvey.create({
      surveyId: `SRV-${hh.householdId}`,
      householdId: hh.householdId,
      surveyedBy: 'M. Padmavathi (ASHA)',
      surveyDate: new Date(Date.now() - (16 - i) * 86400000),
      ...profile,
      completionStatus: 'completed',
      isDemoData: true,
    });

    await generateRecommendationsForSurvey(survey);
  }
  console.log(`[Seeder] 16 Surveys and Rule-Based Recommendations Generated.`);

  // 6. Seed Maternal Health Records (Confidential & Consented)
  await PregnancyRecord.deleteMany({});
  await AntenatalAppointment.deleteMany({});

  const sampleMaternal = [
    {
      beneficiaryId: 'PREG-PTP-001',
      villagerName: 'Lakshmi Prasanna',
      householdId: 'HH-PTP-001',
      age: 23,
      contactNumber: '9848011221',
      lmpDate: new Date('2026-06-10'),
      eddDate: new Date('2027-03-17'),
      gravida: 1,
      para: 0,
      providerConfirmedHighRisk: false,
      highRiskReasons: [],
      currentTrimester: 2,
    },
    {
      beneficiaryId: 'PREG-PTP-002',
      villagerName: 'Bhavani Devi',
      householdId: 'HH-PTP-009',
      age: 27,
      contactNumber: '9848011229',
      lmpDate: new Date('2026-03-05'),
      eddDate: new Date('2026-12-10'),
      gravida: 2,
      para: 1,
      providerConfirmedHighRisk: true,
      highRiskReasons: ['Gestational Hypertension confirmed by PHC Doctor', 'Moderate Anemia (Hb: 8.4 g/dl)'],
      currentTrimester: 3,
    },
    {
      beneficiaryId: 'PREG-PTP-003',
      villagerName: 'Lavanya Kumari',
      householdId: 'HH-PTP-014',
      age: 21,
      contactNumber: '9848011234',
      lmpDate: new Date('2026-08-20'),
      eddDate: new Date('2027-05-27'),
      gravida: 1,
      para: 0,
      providerConfirmedHighRisk: false,
      highRiskReasons: [],
      currentTrimester: 1,
    },
  ];

  for (const m of sampleMaternal) {
    const preg = await PregnancyRecord.create({
      ...m,
      healthcareFacility: 'Pentapadu Primary Health Centre (PHC)',
      assignedHealthWorker: 'M. Padmavathi (ASHA)',
      consentGiven: true,
      consentDate: new Date(),
      registrationDate: new Date(),
      pregnancyStatus: 'active',
      isDemoData: true,
    });

    // Record DPDP Consent
    await ConsentRecord.create({
      consentId: `CSNT-${m.beneficiaryId}`,
      villagerName: m.villagerName,
      householdId: m.householdId,
      purpose: 'maternal_health',
      consentType: 'explicit_dpdp_2023',
      consentStatus: 'granted',
      details: 'Beneficiary explicitly consented to maternal follow-ups and PMSMA notifications.',
      recordedBy: 'M. Padmavathi (ASHA)',
    });

    // Antenatal Visits (ANC-1 to ANC-4 and PMSMA)
    const appointments = [
      {
        type: 'ANC-1',
        date: new Date(new Date(m.lmpDate).getTime() + 10 * 7 * 86400000),
        status: 'completed',
        obs: { bloodPressure: '118/76', weightKg: 52, hemoglobin: 11.2, ifaTabletsDistributed: 30, tetanusToxoidDose: 'TT-1 given' },
      },
      {
        type: 'ANC-2',
        date: new Date(new Date(m.lmpDate).getTime() + 20 * 7 * 86400000),
        status: m.currentTrimester >= 2 ? 'completed' : 'scheduled',
        obs: { bloodPressure: m.providerConfirmedHighRisk ? '142/92' : '120/78', weightKg: 55, hemoglobin: m.providerConfirmedHighRisk ? 8.4 : 11.0, ifaTabletsDistributed: 60, tetanusToxoidDose: 'TT-2 given' },
      },
      {
        type: 'PMSMA_Special',
        date: new Date('2026-12-09'),
        status: 'scheduled',
        obs: { bloodPressure: '', weightKg: 0, hemoglobin: 0, ifaTabletsDistributed: 0, tetanusToxoidDose: '' },
      },
      {
        type: 'ANC-3',
        date: new Date(new Date(m.lmpDate).getTime() + 30 * 7 * 86400000),
        status: m.currentTrimester >= 3 ? 'completed' : 'scheduled',
        obs: { bloodPressure: '', weightKg: 0, hemoglobin: 0, ifaTabletsDistributed: 0, tetanusToxoidDose: '' },
      },
    ];

    for (const apt of appointments) {
      await AntenatalAppointment.create({
        appointmentId: `APT-${m.beneficiaryId}-${apt.type}`,
        pregnancyRecordId: preg._id || preg.id,
        beneficiaryId: m.beneficiaryId,
        beneficiaryName: m.villagerName,
        appointmentType: apt.type,
        scheduledDate: apt.date,
        status: apt.status,
        facility: 'Pentapadu Primary Health Centre (PHC)',
        observations: apt.obs,
        healthcareProviderNotes: m.providerConfirmedHighRisk
          ? 'High-risk case flagged: Monitor BP weekly, IFA & Calcium compliance check.'
          : 'Normal progression. Advised nutritious diet and regular exercise.',
        healthWorkerNotes: 'ASHA home visit conducted.',
        isDemoData: true,
      });
    }
  }

  // 7. Seed Notifications
  await Notification.deleteMany({});
  await Notification.create({
    notificationId: 'NOTIF-DEMO-01',
    recipientRole: 'health_worker',
    title: {
      en: 'Upcoming PMSMA Clinic: 9th Dec 2026',
      te: 'రాబోయే PMSMA క్లినిక్: డిసెంబర్ 9, 2026',
    },
    message: {
      en: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) specialist clinic at Pentapadu PHC. Ensure high-risk beneficiaries attend.',
      te: 'పెంటపాడు PHC లో డిసెంబర్ 9న జరిగే PMSMA క్లినిక్‌కు గర్భిణీలను సకాలంలో తీసుకురావాలని ఆశా కార్యకర్తలకు సూచన.',
    },
    type: 'maternal_reminder',
    isRead: false,
    createdAt: new Date(),
  });

  await Notification.create({
    notificationId: 'NOTIF-DEMO-02',
    recipientRole: 'health_worker',
    title: {
      en: 'High-Risk Follow-up: Bhavani Devi (HH-PTP-009)',
      te: 'హై-రిస్క్ గర్భిణీ ఫాలో-అప్: భవాని దేవి (HH-PTP-009)',
    },
    message: {
      en: 'Doctor confirmed gestational hypertension. Scheduled for check-up this week.',
      te: 'వైద్యులచే నిర్ధారించబడిన అధిక రక్తపోటు (బీపీ). ఈ వారం తనిఖీకి హాజరు కావాలి.',
    },
    type: 'missed_appointment',
    isRead: false,
    createdAt: new Date(),
  });

  await Notification.create({
    notificationId: 'NOTIF-DEMO-03',
    recipientRole: 'all',
    title: {
      en: 'Pentapadu Village Monsoon Hygiene Campaign',
      te: 'పెంటపాడు గ్రామ వర్షాకాల పారిశుధ్య ప్రచారం',
    },
    message: {
      en: 'Clear all open water containers this Friday to prevent mosquito breeding. Gram Panchayat chlorination drive begins tomorrow.',
      te: 'దోమల నివారణకు శుక్రవారం "డ్రై డే" పాటించండి. తాగునీటి క్లోరినేషన్ డ్రైవ్ రేపటి నుంచి ప్రారంభం.',
    },
    type: 'awareness_campaign',
    isRead: false,
    createdAt: new Date(),
  });

  console.log('[Seeder] Pentapadu Demo Data Seed Completed Successfully!');
};

export const clearDemoData = async () => {
  await Household.deleteMany({ isDemoData: true });
  await HealthSurvey.deleteMany({ isDemoData: true });
  await Recommendation.deleteMany({ isDemoData: true });
  await PregnancyRecord.deleteMany({ isDemoData: true });
  await AntenatalAppointment.deleteMany({ isDemoData: true });
  console.log('[Seeder] Demo data cleared.');
};

// If run directly: node src/data/seedData.js
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  import('../config/db.js').then(async ({ connectDB }) => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  });
}
