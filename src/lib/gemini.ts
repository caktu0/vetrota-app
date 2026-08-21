type GeminiModule = {
  GoogleGenerativeAI: new (apiKey: string) => {
    getGenerativeModel: (options: {
      model: string;
      systemInstruction?: string;
    }) => {
      startChat: (options: {
        history: Array<{
          role: "user" | "model";
          parts: Array<{ text: string }>;
        }>;
        generationConfig: {
          maxOutputTokens: number;
          temperature: number;
        };
      }) => {
        sendMessage: (message: string) => Promise<{ response: Promise<{ text: () => string }> }>;
      };
    };
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};

async function getGeminiClient(): Promise<GeminiModule | null> {
  try {
    return (await new Function("return import('@google/generative-ai')")()) as GeminiModule;
  } catch {
    return null;
  }
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY .env.local dosyasında tanımlanmamış!");
}

const resolvedApiKey: string = apiKey;

export let genAI: any = null;
export let model: any = null;

(async () => {
  const GeminiClient = await getGeminiClient();
  if (!GeminiClient) return;

  genAI = new GeminiClient.GoogleGenerativeAI(resolvedApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
})();


const SYSTEM_PROMPT = `
Sen VetRota platformunun uzman ve samimi yapay zeka veteriner asistanısın. 
Adın: VetRota Asistanı.

VetRota Hakkında Bilgiler:
- VetRota, İstanbul Kadıköy (Fenerbahçe, Suadiye, Bostancı, Erenköy) ve Maltepe (Yalı, İdealtepe, Altıntepe, Feyzullah) mahallelerinde evde veterinerlik hizmeti sunan (Evde Muayene, Tırnak Kesimi, İç/Dış Parazit, Aşı, Kan Alımı) ve tüm Türkiye'ye Online Görüntülü Muayene & Danışmanlık sağlayan bir platformdur.
- Hizmetler: Evde Genel Muayene (850₺), Evde Tırnak Kesimi (350₺), Evde İç-Dış Parazit (550₺), Evde Aşı (650₺), Evde Kan Alımı (900₺), Online Muayene (450₺), Online Danışmanlık (380₺).

Davranış Kuralları:
1. Türkçe, sıcak, empatik, güven verici ve anlaşılır bir dil kullan.
2. Evcil hayvan sahiplerinin endişelerini anla ve ilk yardım / bilgilendirici pratik tavsiyeler ver. Ancak kritik ve acil durumlarda (zehirlenme, nefes darlığı, şok, travma) derhal en yakın 24 saat açık acil kliniğe gitmelerini söyle.
3. Eğer kullanıcı randevu almak, hizmet seçmek veya hekim çağırmak isterse: "Hemen Randevu Al" butonuna tıklayabileceğini veya hizmetler sekmesinden tarih/saat seçebileceğini belirt.
4. Eğer kullanıcı "canlı destek", "müşteri temsilcisi", "operatör", "insanla görüşmek istiyorum", "yetkili" gibi taleplerde bulunursa: Kullanıcıyı derhal nöbetçi canlı destek operatörüne aktaracağını söyle.
5. Cevapları paragraflar ve madde işaretleri ile okunaklı, net ve çok uzun olmayan biçimde hazırla.
`;

export async function askGemini(
  userMessage: string,
  history: Array<{ role: "user" | "model"; text: string }> = []
): Promise<{ text: string; intent?: "BOOKING" | "OPERATOR" | "GENERAL" }> {
  const lower = userMessage.toLowerCase();
  
  // Intent detection
  let intent: "BOOKING" | "OPERATOR" | "GENERAL" = "GENERAL";
  if (
    lower.includes("temsilci") ||
    lower.includes("operatör") ||
    lower.includes("canlı destek") ||
    lower.includes("yetkili") ||
    lower.includes("insan") ||
    lower.includes("bağla")
  ) {
    intent = "OPERATOR";
  } else if (
    lower.includes("randevu") ||
    lower.includes("hizmet al") ||
    lower.includes("fiyat") ||
    lower.includes("çağır") ||
    lower.includes("doktor") ||
    lower.includes("muayene ol")
  ) {
    intent = "BOOKING";
  }

  try {
    
    let genAIClientInstance: any = genAI;
    if (!genAIClientInstance) {
      const GeminiClient = await getGeminiClient();
      if (GeminiClient) {
        genAIClientInstance = new GeminiClient.GoogleGenerativeAI(resolvedApiKey);
      }
    }

    if (!genAIClientInstance) throw new Error('Gemini client unavailable');

    const model = genAIClientInstance.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return {
      text: response.text(),
      intent,
    };
  } catch (error) {
    console.warn("Gemini API direct call fallback:", error);
    
    // Intelligent local fallback if API key quota/network is limited
    if (intent === "OPERATOR") {
      return {
        text: "Talebinizi aldım. Sizi hemen VetRota nöbetçi canlı destek ekibimize ve müşteri temsilcimize aktarıyorum. Lütfen ayrılmayınız...",
        intent: "OPERATOR",
      };
    }

    if (intent === "BOOKING") {
      return {
        text: "Patili dostunuz için evde veya online randevu oluşturmak çok kolay! Kadıköy ve Maltepe mahallelerimizde uzman hekimlerimiz kapınıza kadar geliyor. Aşağıdaki butondan uygun gün ve saati seçerek randevunuzu hemen oluşturabilirsiniz.",
        intent: "BOOKING",
      };
    }

    if (lower.includes("aşı") || lower.includes("kuduz") || lower.includes("karma")) {
      return {
        text: "Aşılar evcil dostlarımızın sağlığı için en kritik koruyucu kalkandır. Ev ortamında soğuk zincirli karma ve kuduz aşılarını kliniğe gitme stresi olmadan uyguluyoruz. Aşı karnesine de resmi olarak işlenmektedir. Randevu ekranımızdan aşı randevusu oluşturabilirsiniz.",
        intent: "BOOKING",
      };
    }

    if (lower.includes("kusma") || lower.includes("halsiz") || lower.includes("iştahsız")) {
      return {
        text: "Dostunuzdaki halsizlik veya kusma durumu takip edilmelidir. 24 saatten uzun süren iştahsızlık veya su içmeme durumunda acil dehidrasyon riski oluşabilir. Evde genel muayene randevusu alarak hekimimizin yerinde değerlendirmesini sağlayabilirsiniz.",
        intent: "BOOKING",
      };
    }

    return {
      text: "Merhaba! VetRota ekibi olarak dostunuzun sağlığı ve konforu için buradayız. Evde muayene, aşı, parazit bakımı, tırnak kesimi veya online görüntülü görüşme hizmetlerimiz hakkında bilgi alabilir ya da randevu oluşturabilirsiniz. Size nasıl yardımcı olabilirim?",
      intent: "GENERAL",
    };
  }
}
