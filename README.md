<div align="center">

# 🌐 Unified Compute Network
### یک شبکهٔ عمومی برای اتصال کاربران، Agentها و تأمین‌کنندگان ظرفیت محاسباتی
**One Network. Open Participation. Transparent Coordination.**

[Architecture](docs/architecture/overview.md) · [Roadmap](ROADMAP.md) · [Governance](GOVERNANCE.md) · [Economics](ECONOMICS.md) · [Contributing](CONTRIBUTING.md)

</div>

## چشم‌انداز
Unified Compute Network (UCN) زیرساختی provider-neutral برای اتصال کاربران و توسعه‌دهندگان به ظرفیت محاسباتی و قابلیت‌های هوش مصنوعی ارائه‌دهندگان مستقل است. این پروژه مستقل است و جزئی از SINA AI STUDIO نیست.

## مشارکت‌کنندگان
- **کاربران و توسعه‌دهندگان:** ثبت درخواست، انتخاب Provider و مشاهدهٔ مصرف.
- **ارائه‌دهندگان:** عرضهٔ API، مدل یا ظرفیت از طریق Adapter استاندارد.
- **مشارکت‌کنندگان و LPهای آینده:** مشارکت در توسعه، طراحی اقتصاد و حکمرانی. سازوکار مالی هنوز تصویب یا عملیاتی نشده است.

## مسیر درخواست
```text
Client / Agent -> Gateway -> Capability Router -> Provider Registry
                                      |
                                      v
                                Provider Adapter -> Upstream
                                      |
                                      v
                              Metering / Usage record
```
این معماری هدف است؛ همهٔ اجزا هنوز پیاده‌سازی نشده‌اند.

## CC و اقتصاد
Compute Credit (CC) فعلاً یک مفهوم پیشنهادی برای واحد حسابداری داخلی مصرف است؛ نه توکن بلاک‌چینی، سپرده یا دارایی قابل معامله. نرخ ۱۰۰ CC = ۱ USD، کارمزد ۲٪، تقسیم درآمد و بازده LP صرفاً فرض‌ها و پیشنهادهای نیازمند RFC و تصویب‌اند. هیچ درآمد یا APY تضمین نمی‌شود. جزئیات: [ECONOMICS.md](ECONOMICS.md).

## حکمرانی
پیشنهادها از طریق GitHub Issues مطرح و در RFC بررسی می‌شوند. تا زمان تصویب قواعد رأی‌گیری و پیاده‌سازی سامانهٔ رأی، کامنت‌ها و واکنش‌های GitHub رأی الزام‌آور نیستند. جزئیات: [GOVERNANCE.md](GOVERNANCE.md).

## وضعیت واقعی قابلیت‌ها
| حوزه | وضعیت |
|---|---|
| Adapter contract | پیاده‌سازی اولیه |
| Groq / Gemini / Pollinations | آداپتر اولیه؛ opt-in |
| Provider Registry | کاتالوگ اولیه |
| Gateway و Router | هنوز اجرایی نیست |
| NCU و Metering | طراحی |
| AMM / Pools / LP | طراحی |
| Governance و Billing | هنوز اجرایی نیست |
| Web dashboard و Smart contracts | فاز آینده |

## مشارکت
- [فرم درخواست Provider](.github/ISSUE_TEMPLATE/provider_application.md)
- [فرم پیشنهاد حکمرانی](.github/ISSUE_TEMPLATE/governance_proposal.md)
- [CONTRIBUTING.md](CONTRIBUTING.md) و [ROADMAP.md](ROADMAP.md)

## اصول
1. استقلال از Provider و امکان مشارکت آزاد.
2. Providerها ابتدا opt-in و با وضعیت مستند.
3. قیمت، سهمیه، مدل و مجوز تجاری باید از منبع رسمی بررسی شوند.
4. اسرار هرگز commit نشوند.
5. قابلیت اعلام‌شده باید در کد و تست وجود داشته باشد.
6. جعل هویت کلاینت یا دور زدن کنترل upstream بخشی از طراحی نیست.
7. هسته و حسابداری باید قابل ممیزی باشند.

مجوز: [LICENSE](LICENSE) موجود در مخزن.
