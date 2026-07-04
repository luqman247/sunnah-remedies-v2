export type PractitionerGender = "male" | "female";

export interface Clinic {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  availability: string;
  available: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface PatientDetails {
  firstName: string;
  surname: string;
  email: string;
  telephone: string;
  reason?: string;
  medicalConditions?: string;
  consentGiven: boolean;
}

export interface BookingState {
  practitioner: PractitionerGender | null;
  clinic: Clinic | null;
  date: Date | null;
  time: string | null;
  patient: PatientDetails;
}

export interface BookingSummaryData {
  practitioner: PractitionerGender | null;
  clinicName: string | null;
  date: Date | null;
  time: string | null;
  duration: string;
  price: string;
}
