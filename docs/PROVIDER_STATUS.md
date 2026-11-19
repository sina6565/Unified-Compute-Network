# Provider status and validation

وضعیت محافظه‌کارانه است. نام مدل، سهمیه، دسترسی، قیمت و مجوز تجاری باید پیش از فعال‌سازی از مستندات رسمی همان زمان بررسی شوند.

| Provider | وضعیت Adapter | Capability پیاده‌سازی‌شده | وضعیت قیمت/سهمیه |
|---|---|---|---|
| Groq | Implemented, opt-in | chat | وابسته به مدل و حساب |
| Google Gemini API | Implemented, opt-in | chat متنی | وابسته به مدل، منطقه و حساب |
| Pollinations | Implemented, opt-in | image URL | پایداری/رایگان‌بودن تضمین نیست |
| OpenRouter | Implemented, opt-in | chat | مدل‌به‌مدل؛ برخی مدل‌ها ممکن است free باشند |
| Hugging Face Inference Router | Implemented, opt-in | chat از مسیر OpenAI-compatible | مدل و حساب‌محور |
| Together AI | Implemented, opt-in | chat | قیمت‌گذاری جاری باید بررسی شود |
| Anthropic | Implemented, opt-in | chat از Messages API | قیمت‌گذاری جاری باید بررسی شود |
| OpenCode Zen | Retired from active UCN plan | None | در مسیر فعال استفاده نمی‌شود |

## محدودهٔ دقیق پیاده‌سازی
- آداپترهای OpenRouter، Hugging Face و Together در این مرحله فقط chat completion متنی را پشتیبانی می‌کنند؛ catalogهای upstream ممکن است modalityهای بیشتری داشته باشند، اما این adapterها آن‌ها را اعلام نمی‌کنند.
- Anthropic از Messages API استفاده می‌کند؛ ACP bridge در این مخزن پیاده‌سازی نشده است.
- Gemini از API بومی `generateContent` و فقط prompt متنی استفاده می‌کند.
- Pollinations خروجی endpoint تصویر را به شکل Response برمی‌گرداند؛ OpenAI image JSON فرض نمی‌شود.
- OpenCode Zen از مسیر فعال UCN کنار گذاشته شده است. هیچ TLS fingerprint یا هدر جعل‌شده‌ای اضافه نشده است.

## فعال‌سازی
همهٔ Providerها در registry غیرفعال‌اند و فقط با credential و تنظیمات صریح فعال می‌شوند. پیش از فعال‌سازی:
1. مستندات و endpoint رسمی را بررسی کنید.
2. مدل و modality را بررسی کنید.
3. quota، rate limit، منطقه و شرایط حساب را بررسی کنید.
4. شرایط تجاری، بازتوزیع و ارائهٔ سرویس به اشخاص ثالث را بررسی کنید.
5. timeout، retry/backoff، محدودیت اندازه، observability و کنترل هزینه اضافه/تأیید کنید.
6. تست قراردادی را با کلید مجاز اجرا کنید؛ کلید را commit نکنید.

وجود Adapter به معنی health، uptime، سهمیهٔ رایگان یا مجوز تجاری تأییدشده نیست.
