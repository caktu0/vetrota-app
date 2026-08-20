export type UserRole = "USER" | "VET";

export interface UserProfile {
  id: string;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified?: boolean;
  title?: string;
  clinic?: string;
}

export interface PetItem {
  id: string;
  userId: string;
  name: string;
  species: "Kedi" | "Köpek" | "Kuş" | "Tavşan" | string;
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
  title: string;
  district: string;
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
  categoryId?: string;
  categoryTitle?: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration?: number;
  serviceIcon?: string;
  type: "home" | "online" | "order";
  petId?: string;
  petName?: string;
  petSpecies?: string;
  addressId?: string;
  addressSummary?: string;
  district?: string;
  neighborhood?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  userNotes?: string;
  vetNotes?: string;
  specialNotice?: string;
  createdAt: string;
}

export interface ChatMessageItem {
  id: string;
  sender: "user" | "assistant" | "operator";
  senderName: string;
  text: string;
  timestamp: string;
  actionType?: "BOOKING_LINK" | "LIVE_SUPPORT_CONNECTED" | "NONE";
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
  readTime: string;
  author: string;
}

// Mobile App Service Category Model
export interface SubServiceItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  unit?: string;
  image?: string;
  brand?: string;
  requiresNotice?: boolean;
  noticeText?: string;
  weightOptions?: string[];
  features?: string[];
  isPrescriptionNeeded?: boolean;
}

export interface MainCategoryItem {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  badgeIconName: string;
  bgColor: string; // Tailind class e.g. bg-[#FAF5FF]
  borderColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  iconColor: string;
  image: string;
  isFullWidth?: boolean;
  isComingSoon?: boolean;
  badgeTag?: string;
  subServices: SubServiceItem[];
}

export interface CartItem {
  subService: SubServiceItem;
  quantity: number;
  selectedWeight?: string;
}
