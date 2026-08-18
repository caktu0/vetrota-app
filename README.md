# 🐾 VetRota — Online & Mobil Veterinerlik Platformu

VetRota; İstanbul Kadıköy ve Maltepe mahallelerinde **evde veteriner hekim ziyareti** (muayene, aşı, tırnak kesimi, parazit bakımı, kan alımı) ve tüm Türkiye genelinde **online görüntülü muayene & danışmanlık** sunan, Google Gemini AI destekli full-stack veterinerlik platformudur.

---

## 🎨 UI/UX Tasarım Sistemi ("Nature Distilled")
Tasarım dili, **UI/UX Pro Max** standartlarına uygun olarak sıcak, organik ve güven veren bir görsel kimlikle hazırlanmıştır:
- **Renk Paleti:** Warm Clay / Terracotta (`#C67B5C`), Olive Sage (`#6B7B3C`), Warm Amber (`#D97706`), Warm Parchment (`#FDFBF7`), Deep Roasted Earth (`#2D241E`).
- **Tipografi:** Başlıklarda el yapımı ve sıcak **Calistoga**, gövde metinlerinde modern ve okunaklı **DM Sans**, el yazısı dokunuşlarında **Caveat**.
- **Form & Gölgeler:** Yumuşak köşeli 18-24px kartlar ve sıcak terracotta gölgeler.

---

## 🚀 Başlıca Özellikler

### 1. 🔐 Giriş & Kimlik Doğrulama
- **Kullanıcı Girişi** ve **Veteriner Hekim Girişi** geçişi (Role toggle).
- E-posta ve şifre ile kayıt, 6 haneli **E-posta Doğrulama** ekranı.
- **Google ile Giriş** seçeneği.

### 2. 📍 Mahalle Bazlı Hizmet & Bölge Seçimi
- **Kadıköy:** Fenerbahçe, Suadiye, Bostancı, Erenköy
- **Maltepe:** Yalı, İdealtepe, Altıntepe, Feyzullah
- Mahalle seçildiğinde ekranda beliren ve 3 saniye sonra otomatik kaybolan bildirim (*"Feyzullah, Maltepe seçildi."*).
- GPS ile otomatik en yakın mahalleyi algılama desteği.

### 3. 🩺 Hizmetler & Randevu Alma
- **Evde Hizmetler:** Evde Genel Muayene, Evde Tırnak Kesimi, Evde İç/Dış Parazit, Evde Aşı Uygulaması, Evde Kan Alımı.
- **Online Hizmetler:** Online Görüntülü Muayene, Online Danışmanlık.
- **Adres Kontrolü:** Kullanıcının kayıtlı adresi yoksa *"Sisteme kayıtlı herhangi bir adresiniz bulunmamaktadır. Lütfen adresinizi kaydediniz."* uyarısı ve doğrudan adres ekleme modalı.
- **Takvim & Slot Kilitleme:** Takvimden gün ve saat seçimi; randevu alındıktan sonra ilgili saat dilimi kilitlenir ve başkası tarafından seçilemez.

### 4. 🤖 Google Gemini Destekli AI Asistan & Canlı Destek
- Karşılama mesajı: *"VetRota Ekibi: Merhaba! VetRota ekibinden yazıyorum. Dostunla ilgili bir sorun mu var, yoksa randevunla mı ilgili yazıyorsun?"*
- Google Gemini 1.5 Flash API entegrasyonu (`AQ.Ab8RN6I_...`).
- Kullanıcı randevu talep ettiğinde akıllı butonla doğrudan randevu ekranına yönlendirme.
- Kullanıcı operatör veya canlı destek istediğinde nöbetçi veteriner hekime aktarma.

### 5. 📰 Haftalık Blog & E-Bülten
- Kedi ve köpek sağlığı üzerine uzman veteriner makaleleri.
- Haftalık pet sağlığı bülteni için e-posta abonelik sistemi.

### 6. 👤 Hasta Sahibi Hesap Paneli
- Kullanıcı profil bilgileri (İsim, Soyisim, telefon, e-posta).
- **Randevularım:** Yaklaşan ve geçmiş randevuların detayları, durum takibi ve iptal seçeneği.
- **Patili Dostlarım:** Evcil hayvan ekleme, düzenleme, silme, yaş/kilo/alerji takibi.
- **Kayıtlı Adreslerim:** Açık adres ekleme, düzenleme, varsayılan adres belirleme.

### 7. 🩺 Veteriner Hekim Paneli (Dashboard)
- Üst kısımda *"Hoşgeldiniz, Dr. [İsim Soyisim]"* karşılaması.
- Haftalık takvim tarih seçicisi; seçilen tarihe göre randevuların saatlik listesi.
- **"Yerinde Randevular"** ve **"Online Randevular"** sekmeleri.
- Randevu durumunu **"Başarıyla Tamamla"**, **"Muayeneyi Başlat"** veya **"Tarihi Değiştir / Ertele"** işlemleriyle yönetme.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi çalıştırmak için:

```bash
# 1. Proje dizinine geçin
cd C:\Users\Yasin\.gemini\antigravity\scratch\vetrota

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirici sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açarak uygulamayı kullanabilirsiniz!
