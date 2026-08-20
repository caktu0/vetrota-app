"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  PetItem,
  AddressItem,
  AppointmentItem,
  ChatMessageItem,
  BlogPostItem,
  AppointmentStatus,
  SubServiceItem,
  MainCategoryItem,
} from "@/types";
import {
  SUPPORTED_REGIONS,
  NeighborhoodOption,
  TIME_SLOTS,
  MAIN_CATEGORIES,
  BLOG_POSTS as INITIAL_BLOG_DATA,
} from "@/lib/constants";
import { askGemini } from "@/lib/gemini";

interface ToastInfo {
  message: string;
  type?: "success" | "info" | "warning";
  id: number;
}

interface AppContextType {
  currentUser: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  login: (user?: Partial<UserProfile>, roleOverride?: UserRole, isNewRegistration?: boolean) => void;
  logout: () => void;
  selectedRegion: NeighborhoodOption;
  setSelectedRegion: (region: NeighborhoodOption) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  toast: ToastInfo | null;
  showToast: (msg: string, type?: "success" | "info" | "warning") => void;
  
  // Active Mobile Navigation & Modals
  activeMobileCategory: MainCategoryItem | null;
  setActiveMobileCategory: (cat: MainCategoryItem | null) => void;

  // Pets
  pets: PetItem[];
  addPet: (pet: Omit<PetItem, "id" | "userId">) => void;
  updatePet: (id: string, pet: Partial<PetItem>) => void;
  removePet: (id: string) => void;

  // Addresses
  addresses: AddressItem[];
  addAddress: (addr: Omit<AddressItem, "id" | "userId">) => void;
  removeAddress: (id: string) => void;

  // Appointments / Mobile Orders
  appointments: AppointmentItem[];
  bookSubService: (data: {
    subService: SubServiceItem;
    categoryTitle?: string;
    selectedWeight?: string;
    petId?: string;
    addressId?: string;
    userNotes?: string;
    timeSlot?: string;
  }) => { success: boolean; appointment?: AppointmentItem; error?: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, vetNotes?: string) => void;
  cancelAppointment: (id: string) => void;

  // Blog Management
  blogPosts: BlogPostItem[];
  addBlogPost: (post: Omit<BlogPostItem, "id" | "publishedDate">) => void;
  updateBlogPost: (id: string, post: Partial<BlogPostItem>) => void;
  deleteBlogPost: (id: string) => void;

  // Chat
  messages: ChatMessageItem[];
  isChatLoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  isOperatorConnected: boolean;
  connectToOperator: () => void;

  // Newsletter
  newsletterEmails: string[];
  subscribeNewsletter: (email: string) => boolean;

  // Region Modal
  isRegionModalOpen: boolean;
  setIsRegionModalOpen: (open: boolean) => void;
  isTimeSlotModalOpen: boolean;
  setIsTimeSlotModalOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: "user-default",
  name: "Yasin",
  surname: "Demir",
  email: "yasin@vetrota.com",
  phone: "0532 555 0123",
  role: "USER",
  emailVerified: true,
};

const DEFAULT_VET: UserProfile = {
  id: "vet-1",
  name: "Dr. Selin",
  surname: "Aydın",
  email: "selin.aydin@vetrota.com",
  phone: "0533 444 9876",
  role: "VET",
  title: "Uzm. Veteriner Hekim",
  clinic: "VetRota Mobil Sağlık",
  emailVerified: true,
};

const INITIAL_MESSAGES: ChatMessageItem[] = [
  {
    id: "msg-1",
    sender: "assistant",
    senderName: "VetRota Ekibi",
    text: "Merhaba! VetRota mobil uygulamasından yazıyorum. Dostunla ilgili bir sağlık sorunu mu var, yoksa randevu ve siparişinle mi ilgili destek istiyorsun?",
    timestamp: "Şimdi",
    actionType: "NONE",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>("USER");
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [selectedRegion, setSelectedRegionState] = useState<NeighborhoodOption>(SUPPORTED_REGIONS[0]);
  const [selectedTimeSlot, setSelectedTimeSlotState] = useState<string>(TIME_SLOTS[0]);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  
  const [activeMobileCategory, setActiveMobileCategory] = useState<MainCategoryItem | null>(null);
  const [pets, setPets] = useState<PetItem[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(INITIAL_BLOG_DATA as any);
  const [messages, setMessages] = useState<ChatMessageItem[]>(INITIAL_MESSAGES);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isOperatorConnected, setIsOperatorConnected] = useState(false);
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const authSaved = localStorage.getItem("vetrota_auth");
      if (authSaved === "true") {
        setIsAuthenticated(true);
      }
      const savedRole = localStorage.getItem("vetrota_role");
      if (savedRole === "VET" || savedRole === "USER") {
        setRoleState(savedRole);
      }
      const savedUser = localStorage.getItem("vetrota_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedRegion = localStorage.getItem("vetrota_region");
      if (savedRegion) {
        const found = SUPPORTED_REGIONS.find((r) => r.id === savedRegion);
        if (found) setSelectedRegionState(found);
      }
      const savedPets = localStorage.getItem("vetrota_pets");
      if (savedPets) setPets(JSON.parse(savedPets));
      
      const savedAddrs = localStorage.getItem("vetrota_addresses");
      if (savedAddrs) setAddresses(JSON.parse(savedAddrs));
      
      const savedAppts = localStorage.getItem("vetrota_appts");
      if (savedAppts) setAppointments(JSON.parse(savedAppts));

      const savedBlogs = localStorage.getItem("vetrota_blogs");
      if (savedBlogs) setBlogPosts(JSON.parse(savedBlogs));
    } catch {
      // Ignore
    }
  }, []);

  const login = (userData?: Partial<UserProfile>, roleOverride?: UserRole, isNewRegistration: boolean = false) => {
    const targetRole = roleOverride || userData?.role || role;
    setIsAuthenticated(true);
    setRoleState(targetRole);

    const fullUser: UserProfile = {
      ...(targetRole === "VET" ? DEFAULT_VET : DEFAULT_USER),
      ...userData,
      role: targetRole,
      emailVerified: true,
    };

    setCurrentUser(fullUser);
    localStorage.setItem("vetrota_auth", "true");
    localStorage.setItem("vetrota_role", targetRole);
    localStorage.setItem("vetrota_user", JSON.stringify(fullUser));

    if (isNewRegistration) {
      setPets([]);
      setAddresses([]);
      setAppointments([]);
      localStorage.setItem("vetrota_pets", JSON.stringify([]));
      localStorage.setItem("vetrota_addresses", JSON.stringify([]));
      localStorage.setItem("vetrota_appts", JSON.stringify([]));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("vetrota_auth");
    localStorage.removeItem("vetrota_user");
    showToast("Başarıyla çıkış yapıldı.", "info");
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("vetrota_role", newRole);
  };

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const setSelectedRegion = (region: NeighborhoodOption) => {
    setSelectedRegionState(region);
    localStorage.setItem("vetrota_region", region.id);
    setIsRegionModalOpen(false);
    showToast(`Teslimat adresi güncellendi: ${region.name}, ${region.district}`, "success");
  };

  const setSelectedTimeSlot = (slot: string) => {
    setSelectedTimeSlotState(slot);
    setIsTimeSlotModalOpen(false);
    showToast(`Teslimat/Randevu zamanı seçildi: ${slot}`, "info");
  };

  // Pet management
  const addPet = (petData: Omit<PetItem, "id" | "userId">) => {
    const newPet: PetItem = {
      ...petData,
      id: `pet-${Date.now()}`,
      userId: currentUser.id,
    };
    const updated = [newPet, ...pets];
    setPets(updated);
    localStorage.setItem("vetrota_pets", JSON.stringify(updated));
    showToast(`${newPet.name} başarıyla kaydedildi! 🐾`, "success");
  };

  const updatePet = (id: string, petData: Partial<PetItem>) => {
    const updated = pets.map((p) => (p.id === id ? { ...p, ...petData } : p));
    setPets(updated);
    localStorage.setItem("vetrota_pets", JSON.stringify(updated));
    showToast("Patili dostunuzun bilgileri güncellendi.", "info");
  };

  const removePet = (id: string) => {
    const updated = pets.filter((p) => p.id !== id);
    setPets(updated);
    localStorage.setItem("vetrota_pets", JSON.stringify(updated));
    showToast("Patili dostunuz silindi.", "info");
  };

  // Address management
  const addAddress = (addrData: Omit<AddressItem, "id" | "userId">) => {
    const newAddr: AddressItem = {
      ...addrData,
      id: `addr-${Date.now()}`,
      userId: currentUser.id,
    };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    localStorage.setItem("vetrota_addresses", JSON.stringify(updated));
    showToast("Yeni adresiniz kaydedildi.", "success");
  };

  const removeAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("vetrota_addresses", JSON.stringify(updated));
    showToast("Adres kaldırıldı.", "info");
  };

  // Mobile SubService Booking / Ordering
  const bookSubService = (data: {
    subService: SubServiceItem;
    categoryTitle?: string;
    selectedWeight?: string;
    petId?: string;
    addressId?: string;
    userNotes?: string;
    timeSlot?: string;
  }) => {
    const slot = data.timeSlot || selectedTimeSlot;
    const pet = pets.find((p) => p.id === data.petId) || pets[0];
    const address = addresses.find((a) => a.id === data.addressId);

    const isOrderType = data.subService.categoryId.startsWith("eve-mama") || data.subService.categoryId.startsWith("eve-petshop") || data.subService.categoryId.startsWith("eve-takviye");

    const newAppt: AppointmentItem = {
      id: `appt-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.surname || ""}`.trim(),
      userPhone: currentUser.phone,
      vetId: "vet-1",
      vetName: "Dr. Selin Aydın",
      categoryId: data.subService.categoryId,
      categoryTitle: data.categoryTitle || "VetRota Mobil Hizmet",
      serviceId: data.subService.id,
      serviceName: data.selectedWeight ? `${data.subService.name} (${data.selectedWeight})` : data.subService.name,
      servicePrice: data.subService.price,
      type: isOrderType ? "order" : data.subService.categoryId.includes("online") ? "online" : "home",
      petId: pet?.id,
      petName: pet?.name || "Patili Dostunuz",
      petSpecies: pet?.species || "Kedi/Köpek",
      addressId: address?.id,
      addressSummary: address ? `${address.neighborhood}, ${address.district}` : `${selectedRegion.name}, ${selectedRegion.district}`,
      district: address?.district || selectedRegion.district,
      neighborhood: address?.neighborhood || selectedRegion.name,
      date: slot.split(" ")[0] || "Bugün",
      time: slot.substring(slot.indexOf(" ") + 1) || "09:00 - 10:00",
      status: "CONFIRMED",
      userNotes: data.userNotes,
      specialNotice: data.subService.noticeText,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));

    if (isOrderType) {
      showToast(`${data.subService.name} siparişiniz alındı! Adresinize teslim edilecektir. 📦`, "success");
    } else {
      showToast(`${data.subService.name} randevunuz oluşturuldu! 🐾`, "success");
    }

    setActiveMobileCategory(null);
    return { success: true, appointment: newAppt };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, vetNotes?: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status, vetNotes: vetNotes !== undefined ? vetNotes : a.vetNotes } : a
    );
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast(`İşlem durumu güncellendi: ${status}`, "success");
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: "CANCELLED" as AppointmentStatus } : a
    );
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast("İşlem iptal edildi.", "warning");
  };

  // Blog Management
  const addBlogPost = (postData: Omit<BlogPostItem, "id" | "publishedDate">) => {
    const newPost: BlogPostItem = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedDate: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    localStorage.setItem("vetrota_blogs", JSON.stringify(updated));
    showToast("Yeni blog yazısı yayınlandı! 📰", "success");
  };

  const updateBlogPost = (id: string, postData: Partial<BlogPostItem>) => {
    const updated = blogPosts.map((p) => (p.id === id ? { ...p, ...postData } : p));
    setBlogPosts(updated);
    localStorage.setItem("vetrota_blogs", JSON.stringify(updated));
    showToast("Blog yazısı güncellendi.", "info");
  };

  const deleteBlogPost = (id: string) => {
    const updated = blogPosts.filter((p) => p.id !== id);
    setBlogPosts(updated);
    localStorage.setItem("vetrota_blogs", JSON.stringify(updated));
    showToast("Blog yazısı silindi.", "info");
  };

  // Chat message
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: `${currentUser.name}`,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const history = messages
        .filter((m) => m.sender === "user" || m.sender === "assistant")
        .slice(-6)
        .map((m) => ({
          role: (m.sender === "user" ? "user" : "model") as "user" | "model",
          text: m.text,
        }));

      const res = await askGemini(text, history);

      let actionType: "BOOKING_LINK" | "LIVE_SUPPORT_CONNECTED" | "NONE" = "NONE";
      if (res.intent === "OPERATOR") {
        actionType = "LIVE_SUPPORT_CONNECTED";
        setIsOperatorConnected(true);
      } else if (res.intent === "BOOKING") {
        actionType = "BOOKING_LINK";
      }

      const aiMsg: ChatMessageItem = {
        id: `msg-ai-${Date.now()}`,
        sender: res.intent === "OPERATOR" ? "operator" : "assistant",
        senderName: res.intent === "OPERATOR" ? "Nöbetçi Hekim / Canlı Temsilci" : "VetRota AI Asistanı",
        text: res.text,
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        actionType,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessageItem = {
        id: `msg-ai-${Date.now()}`,
        sender: "assistant",
        senderName: "VetRota Asistanı",
        text: "Dostunuz için evde sağlık uygulaması veya mama/takviye siparişi oluşturmak için kategorilerimizi inceleyebilirsiniz.",
        timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        actionType: "BOOKING_LINK",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const connectToOperator = () => {
    setIsOperatorConnected(true);
    const opMsg: ChatMessageItem = {
      id: `msg-op-${Date.now()}`,
      sender: "operator",
      senderName: "Dr. Selin Aydın (Nöbetçi Canlı Destek)",
      text: "Merhaba! Ben Nöbetçi Veteriner Hekim Dr. Selin Aydın. VetRota canlı destek hattına bağlandınız. Size nasıl yardımcı olabilirim?",
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      actionType: "LIVE_SUPPORT_CONNECTED",
    };
    setMessages((prev) => [...prev, opMsg]);
    showToast("Canlı destek temsilcisi sohbete katıldı.", "success");
  };

  const subscribeNewsletter = (email: string): boolean => {
    if (!email || !email.includes("@")) return false;
    if (newsletterEmails.includes(email)) {
      showToast("Bu e-posta adresi bültenimize zaten kayıtlı.", "info");
      return true;
    }
    setNewsletterEmails((prev) => [...prev, email]);
    showToast("VetRota bültenine başarıyla abone oldunuz! 💌", "success");
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        selectedRegion,
        setSelectedRegion,
        selectedTimeSlot,
        setSelectedTimeSlot,
        toast,
        showToast,
        activeMobileCategory,
        setActiveMobileCategory,
        pets,
        addPet,
        updatePet,
        removePet,
        addresses,
        addAddress,
        removeAddress,
        appointments,
        bookSubService,
        updateAppointmentStatus,
        cancelAppointment,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        messages,
        isChatLoading,
        sendChatMessage,
        isOperatorConnected,
        connectToOperator,
        newsletterEmails,
        subscribeNewsletter,
        isRegionModalOpen,
        setIsRegionModalOpen,
        isTimeSlotModalOpen,
        setIsTimeSlotModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
