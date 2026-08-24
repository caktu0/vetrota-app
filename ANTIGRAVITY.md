Bu projede üretilen her uygulama aşağıdaki kurallara uymak zorundadır — istisnasız.

# Güvenlik Kuralları Özeti

| # | Konu | Neyi kapsıyor |
|---|---|---|
| 1 | Açıkta Kalan Secret'lar | Sadece .env, .gitignore, frontend'de key yok |
| 2 | Rate Limiting | Endpoint başına limitler, 429 yanıtları, önerilen kütüphaneler |
| 3 | Input Validation | Zod/Pydantic şemaları, sadece sunucu tarafı, parametreli sorgular |
| 4 | Auth & Yetkilendirme | Düz metin parola yok, JWT en iyi pratikleri, rol kontrolleri |
| 5 | SQL Injection | Önce ORM, asla string birleştirmeli sorgu |
| 6 | CORS | Production'da wildcard * yok |
| 7 | HTTP Güvenlik Header'ları | helmet, CSP, HSTS, clickjacking önleme |
| 8 | Dosya Yükleme Güvenliği | MIME doğrulama, boyut limitleri, UUID ile yeniden adlandırma |
| 9 | Hata Yönetimi | İstemciye stack trace yok, yapısal loglama |
| 10 | Bağımlılık Güvenliği | npm audit, sabitlenmiş versiyonlar |
| 11 | XSS Önleme | dangerouslySetInnerHTML yok, eval() yok |
| 12 | Deploy Kontrol Listesi | Her yayından önce ön kontrol |
| 🤖 | AI/LLM Özel | Prompt injection, token bütçeleri, sunucu tarafı API key'leri |

---

🔐 1. SECRET'LAR & ORTAM DEĞİŞKENLERİ
Secret'ları asla frontend kodunda açığa çıkarma.

- TÜM API key'leri, token'lar, veritabanı URL'leri, servis kimlik bilgileri ve özel config SADECE .env dosyalarında bulunmalı.
- .env dosyaları .gitignore'da listelenmeli — her zaman .env, .env.local, .env.*.local'i hariç tutan bir .gitignore üret.
- Frontend kodu (React, Vue, düz JS) ASLA ham secret değeri içermemeli. İstemci tarafı dosyalarda const API_KEY = "sk-..." yok.
- Next.js/Vite gibi framework'lerde: sadece NEXT_PUBLIC_ veya VITE_ ön ekli değişkenler frontend'e aittir ve bunlar ASLA secret key olmamalı.
- Backend/sunucu-özel secret'lara process.env.VAR_NAME üzerinden erişilmeli ve API yanıtlarında asla istemciye dönülmemeli.
- Gerekli tüm değişken adlarını boş değerlerle içeren bir .env.example dosyası üret — böylece ekip arkadaşların neye ihtiyaç olduğunu bilir.
- Bir secret istemci tarafında kullanılmak zorundaysa (örn. Stripe publishable key), bunun kasıtlı olarak açığa çıkarılan bir publishable/public key olduğunu açıkça yorum olarak belirt.

```javascript
# ✅ Doğru
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

# ❌ Yanlış — bunu asla yapma
const stripe = require('stripe')('sk_live_abc123...');
```

🚦 2. RATE LIMITING
Dışarıya açık her endpoint'te rate limiting olmalı.

- TÜM API route'larında rate limiting uygula; özellikle auth, form gönderimleri, AI completion'ları, dosya yüklemeleri ve pahalı işlemlerde.
- Varsayılan limitler (kullanım senaryosuna göre ayarla):
  - Auth endpoint'leri (login, register, parola sıfırlama): IP başına 15 dakikada 5 istek
  - Genel API: IP başına dakikada 60 istek
  - AI/LLM proxy endpoint'leri: kullanıcı başına dakikada 10 istek
  - Dosya yüklemeleri: IP başına dakikada 5 istek
- Stack'e uygun kütüphaneler kullan:
  - Node/Express: express-rate-limit
  - Next.js: next-rate-limit veya lru-cache ile middleware
  - Python/FastAPI: slowapi
  - Python/Flask: Flask-Limiter
  - Edge/Vercel: KV tabanlı sayaçlar veya Upstash Redis
- Limit aşıldığında Retry-After header'ı ile 429 Too Many Requests dön.
- Rate limit hatalarını frontend'de asla sessizce yutma — kullanıcıya net bir mesaj göster.

```javascript
// ✅ Örnek: Express rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);
```

🧹 3. INPUT VALIDATION & SANITIZATION
Kullanıcı girdisine asla güvenme. Her şeyi doğrula ve temizle.

- TÜM girdileri sunucu tarafında doğrula — istemci tarafı doğrulama sadece UX içindir, asla güvenlik değil.
- Şema doğrulama kütüphaneleri kullan:
  - JS/TS: zod, yup veya joi
  - Python: pydantic
- XSS'i önlemek için tüm string girdileri saklamadan veya göstermeden önce temizle.
- Parametreli sorgular / ORM metotları kullan — kullanıcı girdisini ASLA ham SQL veya NoSQL sorgusuna gömme.
- Şunları doğrula: veri tipi, uzunluk/boyut limitleri, izin verilen karakterler, zorunlu alanlar, enum değerleri.
- Dosya yüklemeleri için: MIME tipini, dosya uzantısını ve dosya boyutunu sunucu tarafında doğrula.
- Geçersiz girdi için net 400 Bad Request hatası dön — denemeyi logla.

```typescript
// ✅ Örnek: Zod şema doğrulaması
import { z } from 'zod';
const schema = z.object({
  email: z.string().email().max(254),
  message: z.string().min(1).max(1000).trim(),
});
const result = schema.safeParse(req.body);
if (!result.success) return res.status(400).json({ error: result.error });
```

🔑 4. KİMLİK DOĞRULAMA & YETKİLENDİRME
- Yerleşik auth kütüphaneleri kullan — auth'u asla sıfırdan kendin yazma.
- Önerilenler: NextAuth.js, Clerk, Supabase Auth, Auth0, Passport.js, lucia-auth
- Parolalar ASLA düz metin olarak saklanmamalı. bcrypt (min cost 12) veya argon2 kullan.
- JWT'ler güçlü bir secret ile imzalanmalı (JWT_SECRET env'den, min 32 karakter). Kısa expiry ayarla (15m–1h).
- Refresh token'lar güvenli saklanmalı (httpOnly cookie'ler, localStorage değil).
- Her istekte kullanıcının kimliğini VE istenen kaynağa erişim iznini doğrula (AuthN + AuthZ).
- Tekrarlanan başarısız giriş denemelerinden sonra hesap kilitleme uygula.
- Admin route'ları veya hassas işlemler için açık bir rol/izin kontrolü ekle. 

```typescript
// ✅ Sadece kimlik değil, sahiplik de kontrol et
const post = await db.post.findUnique({ where: { id } });
if (!post || post.authorId !== session.user.id) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

🛡️ 5. SQL & VERİTABANI GÜVENLİĞİ
- Her zaman bir ORM (Prisma, Drizzle, SQLAlchemy, Mongoose) veya parametreli sorgular kullan.
- Sorguları asla kullanıcı verisiyle string birleştirerek oluşturma.
- En az ayrıcalık ilkesini uygula: DB kullanıcısı yalnızca gerçekten ihtiyaç duyduğu izinlere sahip olmalı.
- Herhangi bir DB yazımından önce tüm alanları temizle ve doğrula.
- Ham DB hatalarını istemciye dönme — şema bilgisi sızdırırlar.

```typescript
// ✅ Güvenli parametreli sorgu
const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ Bunu asla yapma
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

🌐 6. CORS YAPILANDIRMASI
- Production'da wildcard CORS KULLANMA.
- Sadece API'ne erişmesi gereken origin'leri açıkça beyaz listeye al.
- İzin verilen HTTP metotlarını her endpoint'in ihtiyaç duyduğuyla sınırla.

```typescript
// ✅ Açık CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  credentials: true,
}));
```

🪝 7. HTTP GÜVENLİK HEADER'LARI
- Her zaman güvenlik header'ları ayarla. helmet (Node), django-csp (Django) kullan veya manuel ayarla.
- Zorunlu header'lar:
  - Content-Security-Policy — script/style kaynaklarını sınırla
  - X-Frame-Options: DENY — clickjacking'i önle
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security — HTTPS'i zorla
  - Referrer-Policy: strict-origin-when-cross-origin
- Framework bilgisini sızdırmamak için X-Powered-By header'ını kaldır.

📤 8. DOSYA YÜKLEME GÜVENLİĞİ
- Dosya tipini hem MIME tipiyle hem uzantıyla sunucu tarafında doğrula — istemcinin iddiasına asla güvenme.
- Katı dosya boyutu limitleri ayarla (örn. görseller için 5MB, dokümanlar için 25MB).
- Yüklenen dosyaları web kök dizininin dışında veya bir cloud bucket'ta (S3, GCS, Cloudinary) sakla.
- Kullanıcı tarafından yüklenen dosyaları asla çalıştırılabilir izinlerle sunma.
- Yüklenen dosyaları UUID ile yeniden adlandır — orijinal dosya adını asla doğrudan kullanma.
- Hassas veya herkese açık yüklemeler için malware taraması yap.

🚨 9. HATA YÖNETİMİ & LOGLAMA
- Production'da asla stack trace, ham hata mesajı veya iç yolları istemciye dönme.
- Kullanıcılara her zaman genel hata mesajları dön: "Bir şeyler ters gitti", "Error: Cannot read property of undefined at /src/routes/user.ts:42" değil.
- Hataları sunucu tarafında bağlamla logla (zaman damgası, varsa kullanıcı ID'si, route, temizlenmiş girdi).
- Production hata takibi için bir loglama servisi (Sentry, Datadog, Logtail) kullan.
- 4xx (istemci hataları) ile 5xx (sunucu hataları) arasında ayrım yap — doğrulama hataları için 500 kullanma.

🔒 10. BAĞIMLILIK GÜVENLİĞİ
- Paket kurduktan sonra npm audit / pip-audit / cargo audit çalıştır ve high/critical sorunları düzelt.
- Bakımsız paketlerden kaçın (güvenlikle ilgili kütüphanelerde 2+ yıldır güncelleme yoksa).
- Production'da bağımlılık versiyonlarını sabitle (package-lock.json, requirements.txt).
- Aşırı izin isteyen veya şüpheli kurulum script'leri olan paketleri incelemeden kurma.

🧱 11. FRONTEND İÇİN CONTENT SECURITY POLICY (CSP)
- İçerik DOMPurify ile tamamen temizlenmedikçe React'te dangerouslySetInnerHTML kullanma.
- Dinamik kullanıcı içeriğiyle asla eval(), new Function() veya innerHTML kullanma.
- Inline `<script>` etiketlerinden kaçın — CSP uygulamasını etkinleştirmek için JS'i harici dosyalara taşı.

☁️ 12. DEPLOY KONTROL LİSTESİ
Her deploy'dan önce şunlardan emin ol:
- `.env` git'e commit edilmemiş
- Tüm secret'lar hosting platformunun ortam değişkeni config'inde ayarlı
- Debug modu / development loglama production'da KAPALI
- Veritabanı herkese açık değil (özel ağ arkasında connection pooling kullan)
- HTTPS zorunlu (production'da HTTP yok)
- Tüm public endpoint'lerde rate limiting aktif
- CORS bilinen origin'lerle sınırlı
- Kullanılmayan API route'ları kaldırılmış veya korunmuş

🤖 AI/LLM ÖZEL KURALLARI (uygulama AI kullanıyorsa)
- Ham kullanıcı girdisini önce temizlemeden asla doğrudan bir LLM'e gönderme — prompt injection'ı önle.
- Kaçak maliyetleri önlemek için LLM çağrılarında her zaman bir max_tokens limiti ayarla.
- API key'i sadece sunucu tarafında sakla — tüm LLM çağrılarını kendi backend'inden geçir, asla tarayıcıdan değil.
- Suistimali tespit edebilmek için kullanıcı başına LLM kullanımını (token sayıları) logla.
- Maliyet saldırılarını önlemek için kullanıcı veya oturum başına token bütçeleri uygula.
- UI'da render etmeden önce LLM çıktısını doğrula ve temizle (üretilen HTML'den XSS riski).
