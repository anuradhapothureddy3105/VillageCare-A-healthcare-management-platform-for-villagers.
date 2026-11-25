import mongoose from 'mongoose';

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'health_worker', 'villager'],
      default: 'villager',
    },
    phone: { type: String, trim: true },
    householdId: { type: String, trim: true },
    consentGiven: { type: Boolean, default: true },
    consentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const HouseholdSchema = new Schema(
  {
    householdId: { type: String, required: true, unique: true, trim: true },
    headOfHousehold: { type: String, required: true, trim: true },
    village: { type: String, default: 'Pentapadu' },
    mandal: { type: String, default: 'Pentapadu' },
    district: { type: String, default: 'West Godavari' },
    street: { type: String, required: true, trim: true },
    totalMembers: { type: Number, required: true, min: 1 },
    ageGroups: {
      children: { type: Number, default: 0 },
      adults: { type: Number, default: 0 },
      elderly: { type: Number, default: 0 },
    },
    contactNumber: { type: String, trim: true },
    registeredBy: { type: String, default: 'ASHA Worker' },
    registrationDate: { type: Date, default: Date.now },
    notes: { type: String },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const VillagerSchema = new Schema(
  {
    villagerId: { type: String, required: true, unique: true },
    householdId: { type: String, required: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    relationToHead: { type: String, default: 'Self' },
    voluntarilyReportedHealthConditions: { type: String, default: 'None' },
    consentRecords: [{ type: String }],
  },
  { timestamps: true }
);

export const HealthSurveySchema = new Schema(
  {
    surveyId: { type: String, required: true, unique: true },
    householdId: { type: String, required: true },
    surveyedBy: { type: String, default: 'ASHA Worker' },
    surveyDate: { type: Date, default: Date.now },
    sectionA_general: {
      familyMembersCount: { type: Number, default: 4 },
      childrenCount: { type: Number, default: 0 },
      elderlyCount: { type: Number, default: 0 },
      generalHealthConcerns: [{ type: String }],
      existingConditionsDisclosed: { type: String, default: 'None' },
    },
    sectionB_hygiene: {
      regularHandwashingWithSoap: {
        type: String,
        enum: ['always', 'sometimes', 'rarely'],
        default: 'sometimes',
      },
      handwashBeforeEating: { type: Boolean, default: true },
      handwashAfterToilet: { type: Boolean, default: true },
      basicHygieneFollowed: { type: Boolean, default: true },
    },
    sectionC_water: {
      mainSource: {
        type: String,
        enum: ['piped_tap', 'borewell', 'public_tap', 'canals_open', 'packaged_water'],
        default: 'public_tap',
      },
      storedInCoveredContainer: { type: Boolean, default: true },
      containerCleanedRegularly: { type: Boolean, default: true },
      waterTreatedIfUncertain: { type: Boolean, default: false },
      treatmentMethod: {
        type: String,
        enum: ['boiling', 'chlorination', 'filtration', 'none'],
        default: 'none',
      },
    },
    sectionD_sanitation: {
      toiletAvailability: {
        type: String,
        enum: ['individual_household', 'community_toilet', 'open_defecation'],
        default: 'individual_household',
      },
      wasteDisposalMethod: {
        type: String,
        enum: ['panchayat_collection', 'compost_pit', 'burning', 'open_dumping'],
        default: 'panchayat_collection',
      },
      wetDrySegregation: { type: Boolean, default: false },
      wasteAccumulationNearHouse: { type: Boolean, default: false },
      drainageCondition: {
        type: String,
        enum: ['covered_drain', 'open_drain', 'no_drainage', 'stagnant_drain'],
        default: 'open_drain',
      },
    },
    sectionE_menstrual: {
      askedWithConsent: { type: Boolean, default: false },
      safeAwareness: {
        type: String,
        enum: ['good', 'moderate', 'needs_improvement', 'not_applicable'],
        default: 'moderate',
      },
      accessToCleanMaterials: { type: Boolean, default: true },
      safeDisposalAwareness: { type: Boolean, default: true },
      notes: { type: String, default: '' },
    },
    sectionF_mosquito: {
      stagnantWaterNearHouse: { type: Boolean, default: false },
      waterInContainersDiscarded: { type: Boolean, default: true },
      drainCleanliness: {
        type: String,
        enum: ['clean', 'choked', 'moderate'],
        default: 'moderate',
      },
      mosquitoNetsOrProtectionUsed: { type: Boolean, default: true },
    },
    completionStatus: {
      type: String,
      enum: ['draft', 'completed'],
      default: 'completed',
    },
    generatedRecommendations: [{ type: String }],
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RecommendationSchema = new Schema(
  {
    recommendationId: { type: String, required: true },
    surveyId: { type: String },
    householdId: { type: String, required: true },
    title: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    reason: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    suggestedPractices: [
      {
        en: { type: String },
        te: { type: String },
      },
    ],
    category: {
      type: String,
      enum: ['water', 'hygiene', 'sanitation', 'mosquito', 'menstrual', 'general_health'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    icon: { type: String, default: 'HeartHandshake' },
    status: {
      type: String,
      enum: ['pending', 'shared', 'followed_up'],
      default: 'pending',
    },
    followedUpAt: { type: Date },
    followedUpBy: { type: String },
    notes: { type: String, default: '' },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PregnancyRecordSchema = new Schema(
  {
    beneficiaryId: { type: String, required: true, unique: true },
    villagerName: { type: String, required: true },
    householdId: { type: String, required: true },
    age: { type: Number, required: true },
    contactNumber: { type: String },
    consentGiven: { type: Boolean, required: true, default: true },
    consentDate: { type: Date, default: Date.now },
    registrationDate: { type: Date, default: Date.now },
    lmpDate: { type: Date, required: true },
    eddDate: { type: Date, required: true },
    healthcareFacility: {
      type: String,
      default: 'Pentapadu Primary Health Centre (PHC)',
    },
    assignedHealthWorker: { type: String, default: 'ASHA Worker' },
    gravida: { type: Number, default: 1 },
    para: { type: Number, default: 0 },
    providerConfirmedHighRisk: { type: Boolean, default: false },
    highRiskReasons: [{ type: String }],
    currentTrimester: { type: Number, default: 1 },
    pregnancyStatus: {
      type: String,
      enum: ['active', 'delivered', 'referred'],
      default: 'active',
    },
    deliveryDetails: {
      deliveryDate: { type: Date },
      outcome: { type: String },
      babyGender: { type: String },
      birthWeightKg: { type: Number },
      placeOfDelivery: { type: String },
    },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AntenatalAppointmentSchema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    pregnancyRecordId: { type: String, required: true },
    beneficiaryId: { type: String, required: true },
    beneficiaryName: { type: String, required: true },
    appointmentType: {
      type: String,
      enum: ['ANC-1', 'ANC-2', 'ANC-3', 'ANC-4', 'PMSMA_Special', 'Postnatal_Followup'],
      required: true,
    },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'missed', 'rescheduled'],
      default: 'scheduled',
    },
    facility: {
      type: String,
      default: 'Pentapadu Primary Health Centre (PHC)',
    },
    observations: {
      bloodPressure: { type: String, default: '' },
      weightKg: { type: Number },
      hemoglobin: { type: Number },
      fundalHeightCm: { type: Number },
      fetalHeartSound: { type: String, default: '' },
      ifaTabletsDistributed: { type: Number, default: 0 },
      tetanusToxoidDose: { type: String, default: '' },
    },
    healthcareProviderNotes: { type: String, default: '' },
    healthWorkerNotes: { type: String, default: '' },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FollowUpSchema = new Schema(
  {
    followUpId: { type: String, required: true },
    targetType: {
      type: String,
      enum: ['survey_recommendation', 'maternal_appointment', 'sanitation_check'],
      required: true,
    },
    referenceId: { type: String, required: true },
    householdId: { type: String },
    beneficiaryName: { type: String },
    assignedTo: { type: String, default: 'ASHA Worker' },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending',
    },
    remarks: { type: String, default: '' },
    completedDate: { type: Date },
    isDemoData: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AwarenessContentSchema = new Schema(
  {
    contentId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    title: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    summary: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    whyItMatters: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    preventivePractices: [
      {
        en: { type: String },
        te: { type: String },
      },
    ],
    faqs: [
      {
        question: {
          en: { type: String },
          te: { type: String },
        },
        answer: {
          en: { type: String },
          te: { type: String },
        },
      },
    ],
    dailyTip: {
      en: { type: String },
      te: { type: String },
    },
    audioTranscript: {
      en: { type: String },
      te: { type: String },
    },
    officialSources: [{ type: String }],
    posterDownloadUrl: { type: String },
    icon: { type: String, default: 'BookOpen' },
  },
  { timestamps: true }
);

export const NotificationSchema = new Schema(
  {
    notificationId: { type: String, required: true },
    recipientRole: {
      type: String,
      enum: ['all', 'admin', 'health_worker', 'villager'],
      default: 'all',
    },
    recipientUserId: { type: String },
    title: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    message: {
      en: { type: String, required: true },
      te: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ['maternal_reminder', 'missed_appointment', 'survey_pending', 'awareness_campaign', 'system'],
      default: 'system',
    },
    relatedId: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ConsentRecordSchema = new Schema(
  {
    consentId: { type: String, required: true, unique: true },
    villagerName: { type: String, required: true },
    householdId: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['survey', 'maternal_health', 'general_records'],
      default: 'survey',
    },
    consentType: { type: String, default: 'explicit_dpdp_2023' },
    consentStatus: {
      type: String,
      enum: ['granted', 'withdrawn', 'correction_requested'],
      default: 'granted',
    },
    details: { type: String, default: 'Informed voluntary consent recorded under DPDP Act 2023 guidelines' },
    recordedBy: { type: String, default: 'ASHA Worker' },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SystemSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    rules: { type: Array, default: [] },
    villageName: { type: String, default: 'Pentapadu' },
    mandal: { type: String, default: 'Pentapadu' },
    district: { type: String, default: 'West Godavari' },
  },
  { timestamps: true }
);
