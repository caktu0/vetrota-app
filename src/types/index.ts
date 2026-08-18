export type UserRole = "USER" | "VET";

export interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
  title?: string; // For vets
  clinic?: string;
  emailVerified?: boolean;
}

export interface PetItem {
  id: string;
  userId: string;
  name: string;
  species: "Kedi" | "Köpek" | "Kuş" | "Tavşan" | "Diğer";
  breed?: string;
  age?: number;
  weight?: number;
  gender?: "Erkek" | "Dişi";
  notes?: string;
  image?: string;
}

export interface AddressItem {
  id: string;
  userId: string;
  title: string; // Ev, İş vb.
  district: "Kadıköy" | "Maltepe" | string;
  neighborhood: string;
  street: string;
  buildingNo?: string;
  apartmentNo?: string;
  fullAddress: string;
  isDefault?: boolean;
}

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED";

export interface AppointmentItem {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  vetId?: string;
  vetName?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  serviceIcon: string;
  type: "home" | "online";
  petId?: string;
  petName?: string;
  petSpecies?: string;
  addressId?: string;
  addressSummary?: string;
  district?: string;
  neighborhood?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  userNotes?: string;
  vetNotes?: string;
  createdAt: string;
}

export interface ChatMessageItem {
  id: string;
  sender: "user" | "assistant" | "system" | "operator";
  senderName: string;
  text: string;
  timestamp: string;
  actionType?: "BOOKING_LINK" | "LIVE_SUPPORT_CONNECTED" | "NONE";
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
}
