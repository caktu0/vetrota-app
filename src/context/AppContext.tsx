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
} from "@/types";
import { SUPPORTED_REGIONS, NeighborhoodOption, SERVICES_LIST, BLOG_POSTS as INITIAL_BLOG_DATA } from "@/lib/constants";
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
  toast: ToastInfo | null;
  showToast: (msg: string, type?: "success" | "info" | "warning") => void;
  
  // Pets
  pets: PetItem[];
  addPet: (pet: Omit<PetItem, "id" | "userId">) => void;
  updatePet: (id: string, pet: Partial<PetItem>) => void;
  removePet: (id: string) => void;

  // Addresses
  addresses: AddressItem[];
  addAddress: (addr: Omit<AddressItem, "id" | "userId">) => void;
  removeAddress: (id: string) => void;

  // Appointments
  appointments: AppointmentItem[];
  bookAppointment: (data: {
    serviceId: string;
    date: string;
    time: string;
    petId?: string;
    addressId?: string;
    type: "home" | "online";
    userNotes?: string;
  }) => { success: boolean; error?: string; appointment?: AppointmentItem };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, vetNotes?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  cancelAppointment: (id: string) => void;

  // Blog Management (User can read, Vet can CRUD)
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
    text: "Merhaba! VetRota ekibinden yazıyorum. Dostunla ilgili bir sorun mu var, yoksa randevunla mı ilgili yazıyorsun?",
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
  const [toast, setToast] = useState<ToastInfo | null>(null);
  
  const [pets, setPets] = useState<PetItem[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(INITIAL_BLOG_DATA as any);
  const [messages, setMessages] = useState<ChatMessageItem[]>(INITIAL_MESSAGES);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isOperatorConnected, setIsOperatorConnected] = useState(false);
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>([]);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

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

    // If new registration, ensure clean slate (0 pets, 0 appointments)
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
    }, 3200);
  };

  const setSelectedRegion = (region: NeighborhoodOption) => {
    setSelectedRegionState(region);
    localStorage.setItem("vetrota_region", region.id);
    setIsRegionModalOpen(false);
    showToast(`${region.name}, ${region.district} seçildi.`, "success");
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

  // Appointments
  const bookAppointment = (data: {
    serviceId: string;
    date: string;
    time: string;
    petId?: string;
    addressId?: string;
    type: "home" | "online";
    userNotes?: string;
  }) => {
    const isOccupied = appointments.some(
      (a) => a.date === data.date && a.time === data.time && a.status !== "CANCELLED"
    );

    if (isOccupied) {
      showToast("Seçtiğiniz tarih ve saat doludur. Lütfen başka bir saat seçiniz.", "warning");
      return { success: false, error: "Bu saat için randevu daha önce alınmıştır." };
    }

    const service = SERVICES_LIST.find((s) => s.id === data.serviceId);
    const pet = pets.find((p) => p.id === data.petId);
    const address = addresses.find((a) => a.id === data.addressId);

    const newAppt: AppointmentItem = {
      id: `appt-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.name} ${currentUser.surname || ""}`.trim(),
      userPhone: currentUser.phone,
      vetId: "vet-1",
      vetName: "Dr. Selin Aydın",
      serviceId: data.serviceId,
      serviceName: service?.name || "Veterinerlik Hizmeti",
      servicePrice: service?.price || 0,
      serviceDuration: service?.durationMin || 30,
      serviceIcon: service?.iconName || "Stethoscope",
      type: data.type,
      petId: data.petId,
      petName: pet?.name,
      petSpecies: pet?.species,
      addressId: data.addressId,
      addressSummary: address ? `${address.neighborhood}, ${address.district}` : `${selectedRegion.name}, ${selectedRegion.district}`,
      district: address?.district || selectedRegion.district,
      neighborhood: address?.neighborhood || selectedRegion.name,
      date: data.date,
      time: data.time,
      status: "CONFIRMED",
      userNotes: data.userNotes,
      createdAt: new Date().toISOString(),
    };

    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast("Randevunuz başarıyla oluşturuldu! Hekimimiz bilgilendirildi.", "success");
    return { success: true, appointment: newAppt };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, vetNotes?: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status, vetNotes: vetNotes !== undefined ? vetNotes : a.vetNotes } : a
    );
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast(`Randevu durumu güncellendi: ${status === "COMPLETED" ? "Başarıyla Tamamlandı" : status}`, "success");
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, date: newDate, time: newTime, status: "RESCHEDULED" as AppointmentStatus } : a
    );
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast(`Randevu yeni tarihe taşındı: ${newDate} - ${newTime}`, "info");
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: "CANCELLED" as AppointmentStatus } : a
    );
    setAppointments(updated);
    localStorage.setItem("vetrota_appts", JSON.stringify(updated));
    showToast("Randevu iptal edildi.", "warning");
  };

  // Blog Management (Vet can CRUD, User can read)
  const addBlogPost = (postData: Omit<BlogPostItem, "id" | "publishedDate">) => {
    const newPost: BlogPostItem = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedDate: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    localStorage.setItem("vetrota_blogs", JSON.stringify(updated));
    showToast("Yeni blog yazısı başarıyla yayınlandı! 📰", "success");
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
    showToast("Blog yazısı yayından kaldırıldı.", "info");
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
        text: "Dostunuz için evde randevu oluşturabilir, aşı ve muayene hizmetlerimiz hakkında detaylı bilgi alabilirsiniz.",
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
      text: "Merhaba! Ben Nöbetçi Veteriner Hekim Dr. Selin Aydın. Canlı destek hattına bağlandınız. Dostunuzun durumu hakkında size doğrudan yardımcı olmak için buradayım.",
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
    showToast("VetRota haftalık bültenine başarıyla abone oldunuz! 💌", "success");
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
        toast,
        showToast,
        pets,
        addPet,
        updatePet,
        removePet,
        addresses,
        addAddress,
        removeAddress,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
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
