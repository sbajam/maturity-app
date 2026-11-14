# طراحی Backend MVP و برنامه اجرا

## وضعیت و محدودیت این نسخه

این سند حاصل بررسی ایستای فرانت‌اند و دو سند پژوهشی است. طرح پیشنهادی آماده بازبینی است؛ تصمیم‌های باز و محدودیت‌های تأییدنشده پیش از پیاده‌سازی در [جزئیات اجرایی](IMPLEMENTATION_DETAIL.md) آمده‌اند. هیچ کد اجرایی و migration در این مرحله تغییر نکرده است.

مستندات مکمل: [ممیزی فرانت‌اند](FRONTEND_AUDIT.md)، [موجودی مدل‌ها](DATA_MODEL_INVENTORY.md)، [طرح پیشنهادی دیتابیس](DATABASE_DESIGN.md)، [قرارداد پیشنهادی API](API_CONTRACT.md)، [اتصال و Taskها](INTEGRATION_AND_TASKS.md)، [جزئیات اجرایی و آزمون‌ها](IMPLEMENTATION_DETAIL.md).

## یافته‌های مستند

- پروژه Nuxt 4 و Vue 3 است؛ `package.json` و `nuxt.config.ts`. Pinia نصب و فعال است، اما state دامنه بررسی‌شده در `composables/useMockStore.ts` با `ref`های سطح ماژول نگهداری می‌شود. این state ذخیره‌سازی پایدار ندارد و در SSR اشتراک سطح ماژول می‌تواند موجب نشت state بین درخواست‌ها شود؛ رفتار واقعی استقرار باید آزموده شود.
- ساخت سازمان و منبع داده و ارزیابی روی آرایه‌های حافظه‌ای انجام می‌شود؛ `composables/useMockStore.ts`. UI سازمان شامل name و industry اجباری و country، businessModel، companySize و description اختیاری است؛ `components/enterprise/NewModal.vue`.
- ویرایش سازمان در `components/enterprise/Header.vue` event منتشر می‌کند، اما صفحه نمای کلی آن را دریافت نمی‌کند. قابلیت را نباید به‌عنوان ویرایش عملیاتی موجود گزارش کرد.
- صفحه `pages/enterprise/[id]/data-sources.vue` ایجاد، ویرایش توضیح و متن کسب‌وکار، تغییر enabled و حذف را در store شبیه‌سازی می‌کند. دکمه upload تنها یک نام ساختگی تولید می‌کند؛ فایل واقعی دریافت نمی‌شود.
- فرم ارزیابی name، description و version دارد؛ version خالی به `1.0` تبدیل می‌شود. ایجاد ارزیابی با وضعیت draft انجام می‌شود و به wizard هدایت می‌کند؛ `components/assessment/NewModal.vue` و `pages/enterprise/[id]/assessments/index.vue`.
- `composables/useAssessmentWizard.ts` و `useMockStore.ts` با تأخیر زمانی evidence، mapping، امتیاز و پیشنهاد قالبی تولید می‌کنند. `components/assessment/wizard/StepAiLoading.vue` پیشرفت تصادفی نشان می‌دهد. این خروجی‌ها نتیجه علمی نیستند.
- mappingهای تولیدشده از قالب، شناسه evidence اصلی را حفظ می‌کنند ولی evidence جدید شناسه متفاوت می‌گیرد؛ `mock/mappings.ts` و `mock/evidence.ts`. همچنین امتیازهای قالبی مستقل از تصمیم کاربر درباره mapping تولید می‌شوند. این سناریو فقط دمو است.
- در `pages/index.vue` عنوان Active Sources از همه سازمان‌ها سخن می‌گوید اما محاسبه فقط سازمان اول را می‌شمارد. کارت آخرین ارزیابی نیز به سازمان اول محدود است. جستجو، اعلان و منوی کاربر در `components/app/` در کد بررسی‌شده نمایشی‌اند.
- `utils/capability.ts` میانگین امتیاز فرزندان و سطح گرد شده را محاسبه می‌کند؛ `components/capability/ScoreTable.vue` تعداد mapping را بدون تفکیک وضعیت بازبینی نشان می‌دهد. این محاسبات به‌عنوان روش علمی پذیرفته نشده‌اند.
- پروپوزال برای نبود داده از سطح صفر یا غیردیجیتال سخن می‌گوید؛ اسلاید ۱۴ ارائه صریحاً انتساب خودکار صفر را رد می‌کند. تصمیم علمی باز است. اسلایدهای ۱۲ و ۱۳ ingestion و connector را پیشنهاد می‌کنند ولی scope جدید کاربر آنها را به آینده منتقل کرده است. سند فنی DOCX مورد اشاره در مسیرهای جستجوشده یافت نشد.
- `config.js` حاوی رشته‌ای شبیه credential است؛ اعتبار آن بررسی نشده است. مالک باید افشا را بررسی و در صورت اعتبار، آن را ابطال و جایگزین کند. مقدار آن در این مستند ثبت نمی‌شود.

## فهرست مسیرهای فرانت‌اند

| مسیر | منبع | وضعیت و نیاز اولیه |
|---|---|---|
| `/` | `pages/index.vue` | شمارنده و نتیجه نمونه؛ اتصال به داده واقعی و اصلاح معنای شمارنده |
| `/enterprise` | `pages/enterprise/index.vue` | فهرست، ایجاد و حذف سازمان |
| `/enterprise/:id` | `pages/enterprise/[id]/index.vue` | نمای سازمان، منابع و آخرین ارزیابی؛ ویرایش متصل نیست |
| `/enterprise/:id/data-sources` | `pages/enterprise/[id]/data-sources.vue` | مدیریت metadata، متن و بارگذاری نمایشی |
| `/enterprise/:id/assessments` | `pages/enterprise/[id]/assessments/index.vue` | فهرست، انتخاب و ایجاد پیش‌نویس |
| `/enterprise/:id/assessments/:assessmentId` | فایل `index.vue` در پوشه ارزیابی | redirect بر اساس وضعیت |
| `/enterprise/:id/assessments/:assessmentId/run` | فایل `run.vue` در همان پوشه | wizard نمایشی؛ در محیط واقعی غیرفعال |
| `/enterprise/:id/assessments/:assessmentId/report` | فایل `report.vue` در همان پوشه | نتایج نمونه؛ در محیط واقعی نتیجه در دسترس نیست |
| `/enterprise/:id/reports` | `pages/enterprise/[id]/reports.vue` | فهرست نمونه و چاپ با `window.print()` |

## مرز پیشنهادی MVP

- داده واقعی: سازمان، metadata منبع داده، متن کسب‌وکار، فایل خام اسناد کسب‌وکار و پیش‌نویس ارزیابی.
- کاربر محیط خصوصی و تک‌کاربره است. JWT، حساب و نقش در این فاز وجود ندارد؛ محیط فاقد احراز هویت نباید عمومی شود.
- هر منبع `business_document` می‌تواند چند فایل خام مستقل داشته باشد. فایل‌ها در دیسک خصوصی سرور و خارج از web root ذخیره شوند؛ محتوا تحلیل یا parse نمی‌شود.
- دمو در محیط و دیتابیس مستقل، همراه با برچسب روشن، از محیط واقعی جدا شود. سازوکار دقیق fixtures، نمایش نتایج و حفاظت از seed هنوز باید طراحی و اعتبارسنجی شود.
- ingestion، connector، پردازش فایل، evidence extraction، LLM، scoring علمی، recommendation، snapshot و versioning از MVP خارج‌اند. نبود داده به معنی امتیاز صفر نیست.

## مدل دامنه اولیه، هنوز نیازمند تکمیل

| نوع فعلی | فیلدها و رابطه | تعیین تکلیف اولیه |
|---|---|---|
| `Enterprise` | id، timestamps، name، industry، description، country، businessModel، companySize، logo | سازمان واقعی؛ name و industry در فرم الزامی؛ logo فعلاً داده نمایشی اختیاری |
| `DataSource` | id، timestamps، enterpriseId، name، type، enabled، description، businessText، fileName | metadata واقعی؛ `fileName` فعلی باید با مجموعه اسناد واقعی جایگزین شود |
| `Assessment` | id، timestamps، enterpriseId، name، description، version، status، overallScore، completedAt | پیش‌نویس واقعی؛ امتیاز و تکمیل فعلاً دمو |
| `Capability` | id، timestamps، name، description، parentId، level، order | درخت قالبی دمو؛ مدل رسمی هنوز تثبیت نشده |
| `Evidence` | assessmentId، dataSourceId، title، content، context، metadata | نمونه دمو؛ جدول واقعی در این فاز پیشنهاد نمی‌شود |
| `CapabilityEvidenceMapping` | assessmentId، capabilityId، evidenceId، confidence، reasoning، approved، reviewStatus | دمو؛ دو فیلد وضعیت فعلی نیازمند تطبیق‌اند |
| `CapabilityAssessment` | assessmentId، capabilityId، score، maturityLevel، confidence، reasoning | نتیجه نمونه؛ ذخیره علمی خارج از scope |
| `AssessmentPipeline` | assessmentId، step، status، startedAt، completedAt | pipeline نمایشی؛ جدول اجرایی خارج از scope |
| `WizardStep` و `MappingReviewStatus` | مقادیر تعریف‌شده در `types/wizard.ts` | state تعاملی دمو، نه الزاماً مدل دیتابیس |

چهار جدول `enterprises`، `data_sources`، `source_documents` و `assessments` به‌صورت پیشنهادی در سند دیتابیس تشریح شده‌اند. کافی‌بودن آنها و سیاست حذف هنوز نیازمند کنترل نهایی است.

## موارد نیازمند بررسی پیش از پیاده‌سازی

1. تأیید سیاست 409 برای حذف والد دارای وابستگی، در برابر حذف آبشاری mock فعلی.
2. تأیید فرمت، حجم، retention و backup فایل‌ها و نهایی‌کردن بازیابی پس از crash پیش از Task فایل.
3. بازبینی محیط خصوصی و تصمیم‌های علمی باز؛ سند فنی DOCX مورد اشاره در محل‌های بررسی‌شده یافت نشد.
4. آزمون runtime و اعتبارسنجی عملی قراردادها در مراحل پیاده‌سازی؛ بررسی فعلی ایستا بوده است.

اجرای Backend فقط پس از بازبینی و تأیید طراحی و تصمیم‌های مرتبط شروع می‌شود.
