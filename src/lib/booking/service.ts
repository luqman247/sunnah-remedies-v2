import type { Clinic, TimeSlot, BookingState } from "./types";

export const CLINICS: Clinic[] = [
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    availability: "Available this week",
    available: true,
  },
  {
    id: "aarhus",
    name: "Aarhus",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    availability: "Available next week",
    available: true,
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    availability: "Coming soon",
    available: false,
  },
];

export function getAvailableDates(clinicId: string): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(date);
    }
  }

  return dates;
}

export function getAvailableTimeSlots(
  clinicId: string,
  date: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:45", available: false },
    { time: "10:30", available: true },
    { time: "11:15", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true },
  ];

  return slots;
}

export function getSessionPrice(clinicId: string): string {
  switch (clinicId) {
    case "london":
      return "£60";
    case "aarhus":
      return "450 DKK";
    case "riyadh":
      return "250 SAR";
    default:
      return "£60";
  }
}

export function getSessionDuration(): string {
  return "45 minutes";
}

export async function submitBooking(
  booking: BookingState
): Promise<{ success: boolean; referenceId?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    referenceId: `SR-${Date.now().toString(36).toUpperCase()}`,
  };
}
