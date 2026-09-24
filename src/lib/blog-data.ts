export interface BlogPostItemData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: "Beslenme" | "Aşı & Sağlık" | "Davranış" | "Bakım & Hijyen" | "İlk Yardım";
  categoryColor: string;
  readTime: string;
  author: string;
  authorTitle: string;
  date: string;
  image: string;
  isFeatured?: boolean;
}

export const TIP_OF_THE_DAY = {
  title: "Günün Sağlık İpucu 💡",
  text: "Mevsim geçişlerinde kedi ve köpeklerde tüy dökümü %40 artabilir. Düzenli günlük tarama ve malt macunu kullanımı, tüy yumağı (trichobezoar) kaynaklı mide tıkanmalarını önler.",
  author: "Dr. Selin Aydın (VetRota Başhekimi)",
  badge: "Veteriner Hekim Tavsiyesi",
};

export const HOME_BLOG_POSTS: BlogPostItemData[] = [
  {
    id: "blog-1",
    slug: "kedilerde-asi-takvimi-ve-onemi",
    title: "Yavru ve Yetişkin Kedilerde Yıllık Aşı Takvimi Rehberi",
    summary: "Karma, Lösemi ve Kuduz aşıları neden hayati önem taşır? Aşı öncesi dikkat edilmesi gerekenler ve test protokolleri.",
    category: "Aşı & Sağlık",
    categoryColor: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    readTime: "4 dk okuma",
    author: "Dr. Selin Aydın",
    authorTitle: "Uzm. Veteriner Hekim",
    date: "22 Eylül 2026",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: "blog-2",
    slug: "kopeklerde-ayrilik-anksiyetesi",
    title: "Köpeklerde Ayrılık Anksiyetesi ve Yalnız Kalma Eğitimi",
    summary: "Evde yalnız kaldığında havlayan, kapıları tırmalayan dostunuz için pozitif pekiştirme ve veteriner davranış terapisi yöntemleri.",
    category: "Davranış",
    categoryColor: "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]",
    readTime: "5 dk okuma",
    author: "Dr. Mert Koç",
    authorTitle: "Davranış Danışmanı",
    date: "20 Eylül 2026",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: "blog-3",
    slug: "dogru-mama-ve-tahilsiz-beslenme",
    title: "Kısırlaştırılmış Kedilerde Doğru Mama ve İdrar Yolu Sağlığı",
    summary: "Kısırlaştırma sonrası değişen metabolizma, kilo kontrolü ve magnezyum-fosfor dengeli mama seçiminin püf noktaları.",
    category: "Beslenme",
    categoryColor: "bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]",
    readTime: "3 dk okuma",
    author: "Dr. Selin Aydın",
    authorTitle: "Uzm. Veteriner Hekim",
    date: "18 Eylül 2026",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "blog-4",
    slug: "evcil-hayvanlarda-dis-tasi-ve-agiz-kokusu",
    title: "Ağız Kokusu Masum Değil: Diş Taşı ve Diş Eti İltihabı",
    summary: "Periodontal hastalıklar kalp ve böbrek sağlığını nasıl etkiler? Evde diş fırçalama ve ultrasonik kavitron temizliği.",
    category: "Bakım & Hijyen",
    categoryColor: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    readTime: "4 dk okuma",
    author: "Dr. Burak Yılmaz",
    authorTitle: "Cerrahi Uzmanı",
    date: "15 Eylül 2026",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "blog-5",
    slug: "pire-ve-kene-mevsiminde-korunma",
    title: "Pire ve Kene Mevsiminde 3 Aylık Parazit Koruması",
    summary: "Lyme ve paraziter enfeksiyonlardan korunmak için ense damlası ve tablet uygulamalarının zamanlaması.",
    category: "Aşı & Sağlık",
    categoryColor: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]",
    readTime: "3 dk okuma",
    author: "Dr. Selin Aydın",
    authorTitle: "Uzm. Veteriner Hekim",
    date: "12 Eylül 2026",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "blog-6",
    slug: "evde-acil-durum-ilk-yardim-rehberi",
    title: "Evde Acil Durumlarda İlk Müdahale: Zehirlenme ve Yabancı Cisim",
    summary: "Çikolata, zambak gibi toksik gıdaların yutulması veya boğulma durumlarında veteriner hekime ulaşana kadar yapılması gerekenler.",
    category: "İlk Yardım",
    categoryColor: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
    readTime: "6 dk okuma",
    author: "Dr. Selin Aydın",
    authorTitle: "Acil Müdahale Hekimi",
    date: "10 Eylül 2026",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80",
  },
];
