
// import { BusinessCard } from "./businessCard";
// import { RegisterByEnum, EventLockEnum, EventLanguageEnum } from "./enums"; // אם יש לך enums

export interface event {
  id: number;
  name: string;
  endDate: Date;
  startDate: Date;
  originalDate: Date;
  description: string;
  photographerId: string;
  registeredUser: number;
  totalImages: number;
  totalAllDetectedImages: number;
  excelUploded: string;
  excelRun: boolean;
  eventPhoto: string;
  // businessCard: BusinessCard;
  payOneEvent: string;
  needDetect: boolean;
  withPhotos: boolean;
  withSmartSms: boolean;
  photoUploaded: number;
  photoDetected: number;
  registerUser: number;
  // statusPhotosUploadeds: any;
  withCompress: boolean;
  needDetectToUploadPhotos: boolean;
  eventLink: string;
  isActive: boolean;
  isDeleted: boolean;
  photoToEvent?: File;
  isEventPhotoSame: boolean;
  eventPhotoComp: string;
  collactionId: string;
  eventNotification: string;
  isConfedinetialty: boolean;
  btFaceRecognitionText: string;
  btFaceRecognitionTextEN: string;
  userScreenType: number;
  registerBy: "PhoneNumber" | "Email";
  isAllPhotoEventLock: boolean;
  // eventPhotoLockType: EventLockEnum;
  // eventLanguage: EventLanguageEnum;
  galleryGridSize: number;
}
