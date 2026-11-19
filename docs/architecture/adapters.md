# استاندارد Adapterها
هر Adapter قرارداد ProviderAdapter را پیاده‌سازی کند، ID یکتا و capability دقیق داشته باشد و API رسمی Provider را صدا بزند. credential در زمان اجرا از secret manager/environment خوانده شود؛ timeout، AbortSignal، تست خطا و streaming واقعی پوشش داده شود. قیمت و مجوز تجاری از کد حمل‌ونقل جدا بماند. جعل User-Agent یا TLS fingerprint برای وانمودکردن به کلاینت رسمی انجام نشود.
