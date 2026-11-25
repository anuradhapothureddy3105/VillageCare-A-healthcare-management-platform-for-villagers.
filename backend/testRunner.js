import { connectDB } from './src/config/db.js';
import { seedDatabase } from './src/data/seedData.js';
import { User, Household, HealthSurvey, Recommendation, PregnancyRecord, AntenatalAppointment } from './src/models/index.js';
import { generateRecommendationsForSurvey } from './src/services/recommendationEngine.js';

const runTests = async () => {
  console.log('\n======================================================');
  console.log('   RUNNING COMPREHENSIVE VILLAGECARE SYSTEM TESTS     ');
  console.log('======================================================\n');

  await connectDB();
  await seedDatabase();

  let passCount = 0;
  let totalTests = 0;

  const assert = (condition, title) => {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] Test ${totalTests}: ${title}`);
      passCount++;
    } else {
      console.error(`  [FAIL] Test ${totalTests}: ${title}`);
    }
  };

  // Test 1: Seeded Users
  const users = await User.find({});
  assert(users.length >= 3, `Seeded users found: ${users.length} (Admin, ASHA, Villager)`);

  // Test 2: Seeded Pentapadu Households
  const households = await Household.find({});
  assert(households.length === 20, `20 Pentapadu Households verified (found: ${households.length})`);

  // Test 3: Recommendation Engine Execution
  const testSurvey = {
    householdId: 'HH-TEST-999',
    sectionB_hygiene: { regularHandwashingWithSoap: 'rarely' },
    sectionC_water: { storedInCoveredContainer: false, waterTreatedIfUncertain: false },
    sectionD_sanitation: { wasteDisposalMethod: 'open_dumping' },
    sectionE_menstrual: { safeAwareness: 'needs_improvement' },
    sectionF_mosquito: { stagnantWaterNearHouse: true },
    sectionA_general: { existingConditionsDisclosed: 'Cough and fever' },
  };

  const generatedRecs = await generateRecommendationsForSurvey(testSurvey);
  assert(generatedRecs.length >= 5, `Rule Engine generated ${generatedRecs.length} recommendations for high-risk survey response`);

  const hasWaterRule = generatedRecs.some(r => r.category === 'water');
  const hasMosquitoRule = generatedRecs.some(r => r.category === 'mosquito');
  const hasHygieneRule = generatedRecs.some(r => r.category === 'hygiene');
  assert(hasWaterRule && hasMosquitoRule && hasHygieneRule, 'Water, Mosquito, and Hygiene rules successfully evaluated');

  // Test 4: Maternal Health Record & EDD calculation
  const maternalRecords = await PregnancyRecord.find({});
  assert(maternalRecords.length >= 3, `Confidential maternal health records verified (${maternalRecords.length} records)`);

  const sampleMother = maternalRecords[0];
  const lmp = new Date(sampleMother.lmpDate);
  const edd = new Date(sampleMother.eddDate);
  const diffDays = Math.round((edd - lmp) / (1000 * 60 * 60 * 24));
  assert(diffDays === 280, `Naegele's rule verified: LMP to EDD is exactly 280 days (40 weeks)`);

  // Test 5: Antenatal Check-up Appointments
  const appointments = await AntenatalAppointment.find({ beneficiaryId: sampleMother.beneficiaryId });
  assert(appointments.length >= 4, `Antenatal check-up schedule generated for beneficiary (count: ${appointments.length})`);

  // Test 6: Anonymized Village Analytics
  const surveyedCount = await HealthSurvey.countDocuments({});
  assert(surveyedCount >= 16, `Survey completion rate valid (16/20 households surveyed = 80%)`);

  console.log(`\n------------------------------------------------------`);
  console.log(`   TEST RESULT: ${passCount}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log(`------------------------------------------------------\n`);

  if (passCount === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
};

runTests();
