export interface NeighborhoodOption {
  id: string;
  name: string;
  district: "Kadıköy" | "Maltepe";
  city: "İstanbul";
  isAvailableForHomeVisit: boolean;
}

export const SUPPORTED_REGIONS: NeighborhoodOption[] = [
  // Kadıköy
  { id: "kad-fenerbahce", name: "Fenerbahçe", district: "Kadıköy", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "kad-suadiye", name: "Suadiye", district: "Kadıköy", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "kad-bostanci", name: "Bostancı", district: "Kadıköy", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "kad-erenkoy", name: "Erenköy", district: "Kadıköy", city: "İstanbul", isAvailableForHomeVisit: true },
  // Maltepe
  { id: "mal-yali", name: "Yalı", district: "Maltepe", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "mal-idealtepe", name: "İdealtepe", district: "Maltepe", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "mal-altintepe", name: "Altıntepe", district: "Maltepe", city: "İstanbul", isAvailableForHomeVisit: true },
  { id: "mal-feyzullah", name: "Feyzullah", district: "Maltepe", city: "İstanbul", isAvailableForHomeVisit: true },
];

export interface ServiceItem {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  category: "home" | "online";
  price: number;
  durationMin: number;
  iconName: string;
  tags: string[];
  features: string[];
}

export const SERVICES_LIST: ServiceItem[] = [
  // Evde Hizmetler
  {
    id: "evde-muayene",
    name: "Evde Genel Muayene",
    shortDesc: "Ev konforunda stresiz kapsamlı klinik kontrol",
    description: "Evcil dostunuzun kendi güvenli ortamında, kliniğe gitme stresi yaşamadan uzman veteriner hekim tarafından tepeden tırnağa kapsamlı fiziksel muayenesi.",
    category: "home",
    price: 850,
    durationMin: 45,
    iconName: "Stethoscope",
    tags: ["Popüler", "Stresiz"],
    features: ["Fiziksel muayene", "Kalp ve solunum dinleme", "Göz, kulak ve ağız kontrolü", "Sağlık karne güncellemesi"],
  },
  {
    id: "evde-tirnak-kesimi",
    name: "Evde Tırnak Kesimi & Bakım",
    shortDesc: "Hassas ve güvenli tırnak ve pati bakımı",
    description: "Özel hekim ekipmanları ile damar hattına zarar vermeden acısız ve güvenli tırnak kesimi, pati tüyleri düzeltme ve pati nemlendirici bakımı.",
    category: "home",
    price: 350,
    durationMin: 20,
    iconName: "Scissors",
    tags: ["Hızlı Bakım"],
    features: ["Hijyenik kesim", "Pati altı temizliği", "Pati kremi uygulaması", "Kulak temizliği opsiyonu"],
  },
  {
    id: "evde-ic-dis-parazit",
    name: "Evde İç & Dış Parazit Uygulaması",
    shortDesc: "Rutin koruyucu damla ve tablet parazit tedavisi",
    description: "Dostunuzun kilosuna ve yaşam tarzına en uygun orijinal veteriner paraziter ilaçlarının hekim kontrolünde güvenle uygulanması.",
    category: "home",
    price: 550,
    durationMin: 25,
    iconName: "ShieldCheck",
    tags: ["Koruyucu Sağlık"],
    features: ["İç parazit uygulaması", "Dış parazit ense damlası", "Kilo takibi", "Uygulama takip takvimine kayıt"],
  },
  {
    id: "evde-asi-uygulamasi",
    name: "Evde Aşı Uygulaması",
    shortDesc: "Soğuk zincir garantili karma, kuduz ve lösemi aşıları",
    description: "Aşı öncesi mini sağlık kontrolü yapılarak soğuk zinciri bozulmamış orijinal aşıların evinizde güvenli şekilde uygulanması ve aşı karnesine işlenmesi.",
    category: "home",
    price: 650,
    durationMin: 30,
    iconName: "Syringe",
    tags: ["Önemli"],
    features: ["Aşı öncesi ateş & durum kontrolü", "Soğuk zincir aşı", "Aşı karnesi barkod onayı", "Alerji takip süresi"],
  },
  {
    id: "evde-kan-alimi",
    name: "Evde Kan Alımı & Lab Testleri",
    shortDesc: "Laboratuvar tetkikleri için stressiz kan örneği alma",
    description: "Hemogram, biyokimya veya hormon paneli için dostunuzu hırpalamadan evinde uzman hekim tarafından kan alınması ve yetkili laboratuvara sevki.",
    category: "home",
    price: 900,
    durationMin: 30,
    iconName: "Droplets",
    tags: ["Diagnostik"],
    features: ["Stressiz numune alımı", "Soğuk tüp muhafazası", "Lab sevki ve takip", "Sonuçların dijital raporlanması"],
  },
  // Online Hizmetler
  {
    id: "online-muayene",
    name: "Online Görüntülü Muayene",
    shortDesc: "HD video bağlantısıyla anlık hekim değerlendirmesi",
    description: "Evden çıkmadan, uzman veteriner hekimle birebir görüntülü görüşme sağlayarak acil durum triyajı, deri-göz-davranış değerlendirmesi ve reçete yönlendirmesi.",
    category: "online",
    price: 450,
    durationMin: 30,
    iconName: "Video",
    tags: ["Tüm Türkiye", "Hızlı"],
    features: ["Birebir HD video seansı", "Görsel semptom analizi", "Dijital ön rapor & reçete tavsiyesi", "Mesajlaşma desteği"],
  },
  {
    id: "online-danismanlik",
    name: "Online Beslenme & Davranış Danışmanlığı",
    shortDesc: "Kişiselleştirilmiş beslenme, diyet ve davranış eğitimi",
    description: "Irk, yaş, kilo ve mevcut sağlık durumuna özel mama seçimi, kilo verme programı veya tuvalet/sosyalleşme davranış problemleri için kapsamlı danışmanlık.",
    category: "online",
    price: 380,
    durationMin: 40,
    iconName: "MessagesSquare",
    tags: ["Tüm Türkiye"],
    features: ["Kapsamlı anamnez formu", "Beslenme & kalori planı", "Davranış modifikasyon rehberi", "1 haftalık soru-cevap hakkı"],
  },
];

export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30",
  "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
  "17:30", "18:00"
];

export const VET_DOCTORS = [
  {
    id: "vet-1",
    name: "Dr. Selin Aydın",
    title: "Uzm. Veteriner Hekim - İç Hastalıkları",
    experienceYears: 8,
    avatar: "https://images.unsplash.com/photo-1594824813689-d122241cf434?w=200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 142,
    serviceAreas: ["Kadıköy", "Maltepe"],
  },
  {
    id: "vet-2",
    name: "Dr. Kerem Yılmaz",
    title: "Veteriner Hekim - Cerrahi & Davranış",
    experienceYears: 6,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 98,
    serviceAreas: ["Kadıköy", "Maltepe"],
  },
];

export const BLOG_POSTS = [
  {
    id: "blog-1",
    slug: "kedilerde-asi-takvimi-ve-onemi",
    title: "Kedilerde Yıllık Aşı Takvimi: Hangi Aşı Ne Zaman Yapılmalı?",
    summary: "Karma, Kuduz ve Lösemi aşılarının zamanlaması, ev kedilerinin de aşıya neden ihtiyaç duyduğu ve aşı sonrası dikkat edilecekler.",
    category: "Aşı & Koruyucu Sağlık",
    readTime: "4 dk okuma",
    author: "Dr. Selin Aydın",
    publishedDate: "14 Ağustos 2026",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    content: `Ev kedileri dışarı çıkmasa dahi ayakkabılarımız ve giysilerimizle dış ortamdan pek çok virüs ve bakteriyi eve taşırız. Bu sebeple evcil dostlarımızın aşılarının düzenli yapılması hayati öneme sahiptir.
    
    1. Karma Aşı (Feline Parvovirus, Herpes ve Calicivirus koruması)
    2. Kuduz Aşısı (Yasal zorunluluk ve zoonoz hastalık koruması)
    3. Lösemi Aşısı (Dışarı teması olan kediler için şart)
    
    Aşı sonrasında kedinizin 24-48 saat boyunca hafif halsiz olması normaldir. Bol taze su ve sessiz bir dinlenme alanı sağlayınız.`,
  },
  {
    id: "blog-2",
    slug: "kopeklerde-evde-stresiz-tirnak-kesimi",
    title: "Köpeklerde Pati Bakımı ve Stressiz Tırnak Kesimi Rehberi",
    summary: "Köpeğinizin patisine basarken acı çekmemesi için tırnak uzunluğu ne olmalı? Evde veteriner desteğiyle acısız tırnak kesimi ipuçları.",
    category: "Pati & Bakım",
    readTime: "3 dk okuma",
    author: "Dr. Kerem Yılmaz",
    publishedDate: "10 Ağustos 2026",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80",
    content: `Uzayan tırnaklar köpeğinizin yürüyüş biyomekaniğini bozar ve eklem ağrılarına yol açabilir. Tırnak içindeki canlı doku (quick) sebebiyle kesim dikkatle yapılmalıdır.
    
    - Zemine basıldığında tırnak tıkırtısı geliyorsa kesim zamanı gelmiştir.
    - Ev ortamında yapılan sakin ve ödüllü seanslar veteriner korkusunu tamamen yok eder.
    - VetRota uzmanları patinin her dokusunu inceleyerek mantar ve yabancı cisim kontrolü de yapar.`,
  },
  {
    id: "blog-3",
    slug: "yaz-aylarinda-parazit-tehlikesi",
    title: "Sıcak Havalarda Kene ve Pire İstilasına Karşı 5 Altın Kural",
    summary: "İç ve dış parazit damlalarının etki süreleri, kene ısırmasında ilk müdahale ve doğal sanılan tehlikeli yöntemler.",
    category: "Paraziter Tedavi",
    readTime: "5 dk okuma",
    author: "Dr. Selin Aydın",
    publishedDate: "05 Ağustos 2026",
    imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
    content: `Pire ve keneler yalnızca kaşıntı sebebi değil, Lyme ve Kan Paraziti (Ehrlichia) gibi ölümcül hastalıkların taşıyıcısıdır.
    
    - Dış parazit damlasını banyodan en az 48 saat sonra uygulayınız.
    - Kene tespit ettiğinizde kesinlikle alkol veya kolonya dökmeyiniz (kene kusarak zehri kana verir).
    - Evde düzenli veteriner hekim ziyareti ile koruyucu takvim asla aksamaz.`,
  },
  {
    id: "blog-4",
    slug: "yasli-dostlarimiz-icin-kan-tahlilinin-onemi",
    title: "7 Yaş Üstü Kedi ve Köpeklerde Erken Teşhis ve Kan Analizi",
    summary: "Böbrek yetmezliği ve karaciğer enzimlerinin erken tespiti dostunuzun ömrünü nasıl 4 yıl uzatabilir?",
    category: "Geriatrik Bakım",
    readTime: "4 dk okuma",
    author: "Dr. Kerem Yılmaz",
    publishedDate: "28 Temmuz 2026",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
    content: `Yaşlanan can dostlarımız hastalık belirtilerini içgüdüsel olarak gizler. Yılda en az 1 kez yapılan biyokimya ve hemogram paneli ile böbrek fonksiyonları erken evrede yakalanabilir.
    
    VetRota hekimi evinize gelerek dostunuzu strese sokmadan kan numunesi alır ve sonuçları aynı gün dijital olarak sizinle paylaşır.`,
  }
];
