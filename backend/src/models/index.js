import mongoose from 'mongoose';
import { isMongo } from '../config/db.js';
import { CollectionModel } from '../config/store.js';
import {
  UserSchema,
  HouseholdSchema,
  VillagerSchema,
  HealthSurveySchema,
  RecommendationSchema,
  PregnancyRecordSchema,
  AntenatalAppointmentSchema,
  FollowUpSchema,
  AwarenessContentSchema,
  NotificationSchema,
  ConsentRecordSchema,
  SystemSettingSchema,
} from './mongooseSchemas.js';

// Register Mongoose models
export const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);
export const MongoHousehold = mongoose.models.Household || mongoose.model('Household', HouseholdSchema);
export const MongoVillager = mongoose.models.Villager || mongoose.model('Villager', VillagerSchema);
export const MongoHealthSurvey = mongoose.models.HealthSurvey || mongoose.model('HealthSurvey', HealthSurveySchema);
export const MongoRecommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
export const MongoPregnancyRecord = mongoose.models.PregnancyRecord || mongoose.model('PregnancyRecord', PregnancyRecordSchema);
export const MongoAntenatalAppointment = mongoose.models.AntenatalAppointment || mongoose.model('AntenatalAppointment', AntenatalAppointmentSchema);
export const MongoFollowUp = mongoose.models.FollowUp || mongoose.model('FollowUp', FollowUpSchema);
export const MongoAwarenessContent = mongoose.models.AwarenessContent || mongoose.model('AwarenessContent', AwarenessContentSchema);
export const MongoNotification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const MongoConsentRecord = mongoose.models.ConsentRecord || mongoose.model('ConsentRecord', ConsentRecordSchema);
export const MongoSystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);

// Store fallback collections
export const StoreUser = new CollectionModel('users');
export const StoreHousehold = new CollectionModel('households');
export const StoreVillager = new CollectionModel('villagers');
export const StoreHealthSurvey = new CollectionModel('surveys');
export const StoreRecommendation = new CollectionModel('recommendations');
export const StorePregnancyRecord = new CollectionModel('pregnancy_records');
export const StoreAntenatalAppointment = new CollectionModel('appointments');
export const StoreFollowUp = new CollectionModel('followups');
export const StoreAwarenessContent = new CollectionModel('awareness_contents');
export const StoreNotification = new CollectionModel('notifications');
export const StoreConsentRecord = new CollectionModel('consents');
export const StoreSystemSetting = new CollectionModel('settings');

const createModelProxy = (mongoModel, storeModel) => {
  return new Proxy(storeModel, {
    get(target, prop) {
      if (isMongo()) {
        const val = mongoModel[prop];
        if (typeof val === 'function') {
          return val.bind(mongoModel);
        }
        return val;
      }
      return target[prop];
    },
  });
};

export const User = createModelProxy(MongoUser, StoreUser);
export const Household = createModelProxy(MongoHousehold, StoreHousehold);
export const Villager = createModelProxy(MongoVillager, StoreVillager);
export const HealthSurvey = createModelProxy(MongoHealthSurvey, StoreHealthSurvey);
export const Recommendation = createModelProxy(MongoRecommendation, StoreRecommendation);
export const PregnancyRecord = createModelProxy(MongoPregnancyRecord, StorePregnancyRecord);
export const AntenatalAppointment = createModelProxy(MongoAntenatalAppointment, StoreAntenatalAppointment);
export const FollowUp = createModelProxy(MongoFollowUp, StoreFollowUp);
export const AwarenessContent = createModelProxy(MongoAwarenessContent, StoreAwarenessContent);
export const Notification = createModelProxy(MongoNotification, StoreNotification);
export const ConsentRecord = createModelProxy(MongoConsentRecord, StoreConsentRecord);
export const SystemSetting = createModelProxy(MongoSystemSetting, StoreSystemSetting);
