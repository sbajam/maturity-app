# جزئیات اجرایی، تصمیم‌ها و آزمون‌ها

این سند همراه با [قرارداد API](API_CONTRACT.md)، [دیتابیس](DATABASE_DESIGN.md) و [اتصال و Taskها](INTEGRATION_AND_TASKS.md) خوانده می‌شود. طراحی پیشنهاد است و اجرای آن نیازمند تأیید کاربر است.

## قرارداد فایل و وابستگی ماژول

| فایل در `backend/src/` | توابع/مسئولیت | Task |
|---|---|---|
| `app.ts`, `server.ts` | ساخت Express بدون listen برای آزمون؛ bind خصوصی، shutdown و listen | T01 |
| `config/env.ts`, `database.ts`, `logger.ts` | parse تنظیمات، ساخت Sequelize، log ساختاریافته بدون secret/body/file | T01 |
| `contracts/http.ts`, `errors.ts` | envelope، خطای تایپ‌شده با code/status | T01 |
| `middlewares/validate.ts`, `error-handler.ts`, `not-found.ts` | اجرای Zod و نگاشت خطا و 404 | T01 |
| `models/index.ts`, چهار `*.model.ts` | تعریف مدل‌ها، association و Sequelize transaction | T02 |
| `routes/index.ts` | mount مسیرهای versioned | T01 |
| `routes/enterprise.routes.ts`, `controllers/enterprise.controller.ts`, `services/enterprise.service.ts`, `schemas/enterprise.schema.ts` | list/create/get/remove و Zod | T03 |
| `routes/data-source.routes.ts`, `controllers/data-source.controller.ts`, `services/data-source.service.ts`, `schemas/data-source.schema.ts` | list/create/update/remove و Zod | T04 |
| `routes/document.routes.ts`, `controllers/document.controller.ts`, `services/document.service.ts`, `schemas/document.schema.ts`, `utils/file-storage.ts` | list/upload/download/remove، فایل موقت، بررسی اندازه/نوع، hash، quarantine | T05 |
| `routes/assessment.routes.ts`, `controllers/assessment.controller.ts`, `services/assessment.service.ts`, `schemas/assessment.schema.ts` | list/create/get/remove draft | T06 |
| `routes/dashboard.routes.ts`, `controllers/dashboard.controller.ts`, `services/dashboard.service.ts` | summary سراسری | T07 |
| `schemas/common.schema.ts`, `utils/pagination.ts` | شناسه، query و envelope صفحه‌بندی | T01 |
| `scripts/reconcile-files.ts` | تشخیص و بازیابی فایل موقت یا quarantine؛ idempotent با گزارش | T05 |
| `seeders/` | داده نمایشی مجزا و guard محیط | T08 |

وابستگی یک‌طرفه route → controller → service → model/storage است؛ schema در مرز HTTP و invariant مهم دوباره در service/database بررسی شود. controller هیچ منطق فایل یا transaction ندارد. فایل‌های tests متناظر با نام هر ماژول در `tests/integration/` و منطق مستقل در `tests/unit/` قرار گیرند.

`package.json`: express، sequelize، pg، zod، cors، dotenv، multer و express-rate-limit؛ dev: TypeScript، tsx، sequelize-cli، types مربوط و runner تست/API. `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `axios`, `sharp`, `nodemailer`, `xlsx` و client LLM در این scope لازم نیستند. OpenAPI با Zod اختیاری است و پیش‌نیاز MVP نیست؛ در صورت افزودن، تولید قرارداد از schemaهای همان نسخه انجام و drift در CI بررسی شود.

Config: `NODE_ENV`, `APP_MODE`, `HOST`, `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `UPLOAD_ROOT`, `MAX_UPLOAD_BYTES` با مقدارهای معتبر و بدون secret در Git؛ محیط دمو باید نام DB مجزا و root فایل مجزا داشته باشد. production با APP_MODE=demo یا host عمومی بدون حفاظت شبکه fail شود. صحت این محدودیت به reverse proxy و شبکه نیز وابسته است و برنامه به‌تنهایی دسترسی خصوصی را تضمین نمی‌کند.

## پوشش فایل‌های فرانت‌اند

| گروه | فایل‌ها و تغییر |
|---|---|
| API | `nuxt.config.ts`، `services/api-client.ts` و serviceهای نام‌برده در سند اتصال؛ config مجزای SSR و browser |
| مدل‌ها | `types/enterprise.ts`, `types/datasource.ts`, `types/assessment.ts`, `types/index.ts`؛ nullable و SourceDocument، بدون استفاده type دمو به‌عنوان نتیجه واقعی |
| Context | `composables/useEnterpriseRoute.ts`, `useEnterpriseContext.ts`؛ refهای request-scoped و fetch مجدد در تغییر id |
| سازمان | `pages/enterprise/index.vue`, `pages/enterprise/[id]/index.vue`, `components/enterprise/NewModal.vue`, `Header.vue`؛ حذف modal بعد از موفقیت، نمایش conflict و غیرفعال‌سازی edit |
| منبع و سند | `pages/enterprise/[id]/data-sources.vue`؛ لیست صفحه‌بندی‌شده، وضعیت mutation، چند فایل و رفتار حذف |
| ارزیابی | `pages/enterprise/[id]/assessments/index.vue`, `[assessmentId]/index.vue`, `[assessmentId]/run.vue`, `[assessmentId]/report.vue`, `components/assessment/NewModal.vue`, `Detail.vue`؛ draft واقعی، جلوگیری از run و مدیریت direct URL |
| گزارش و داشبورد | `pages/index.vue`, `pages/enterprise/[id]/reports.vue`؛ داده حقیقی و empty state؛ Demo از fixture جدا |
| دمو | `composables/useMockStore.ts`, `useAssessmentWizard.ts`, `mock/*`, wizard و report componentهای مصرف‌کننده؛ نمایش فقط در mode دمو، اصلاح شناسه evidence در fixture در همان scope دمو |

فایل‌های CSS، فونت، asset، navigation و `components/ui` تا وقتی بررسی پیاده‌سازی نیاز مستقلی اثبات نکند بدون تغییر بمانند. `components/ui/DataTable.vue` قابلیت slot footer و loading دارد؛ pagination را در صفحه/کامپوننت مصرف‌کننده با footer قرار دهید. توجه: modalهای فعلی روی emit فوراً reset و بسته می‌شوند؛ برای حفظ ورودی در شکست، parent باید فقط بعد از پاسخ موفق modal را ببندد و reset را به تغییر open موفق موکول کند.

## قرارداد پاسخ کامل نمونه

منبع: `{"data":{"id":2,"enterpriseId":1,"name":"Business context","type":"business_document","enabled":true,"description":null,"businessText":"Context","createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}}`.

سند: `{"data":{"id":4,"dataSourceId":2,"originalName":"rules.pdf","mediaType":"application/pdf","sizeBytes":1200,"sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}}`.

ارزیابی: `{"data":{"id":3,"enterpriseId":1,"name":"Draft","description":null,"version":"1.0","status":"draft","createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}}`.

## آزمون و پذیرش دقیق

| حوزه | پذیرش و تست منفی |
|---|---|
| Config | startup در نبود DB URL، UPLOAD_ROOT یا origin معتبر fail؛ env و credential در log نباشند |
| DB | چهار migration روی DB خالی، down معکوس؛ ورود مقدار خارج CHECK، FK ناموجود و نام whitespace رد شوند؛ delete والد وابسته conflict باشد |
| API | برای ۱۷ endpoint هر status قرارداد بررسی؛ id غیرعددی/منفی 400، متعلق به سازمان دیگر 404، body اضافی و payload وضعیت جعلی 400، DB unavailable 503 |
| Pagination | ۰، ۱، ۲۱ و بالاتر از ۱۰۰ رکورد، ترتیب پایدار با timestamp یکسان، page نامعتبر؛ آمار سراسری به اندازه صفحه وابسته نباشد |
| File | چند سند، نوع ممنوع، صفر بایت، حجم بالاتر ۲۰ MiB، نام دارای path و کاراکتر ویژه، قطع stream، DB failure، failure rename و crash در مراحل quarantine؛ reconcile تکرارپذیر و فاقد حذف فایل قابل انتساب |
| Seed | اجرای دوباره، تلاش روی DB واقعی و root اشتباه، محیط بدون فایل نمونه؛ هیچ نتیجه دمو در DB واقعی ایجاد نشود |
| UI | خطای ذخیره modal را نبندد؛ refresh داده را بازیابی کند؛ تغییر id در route state قبلی را نشان ندهد؛ شبکه خراب با empty متفاوت باشد؛ حذف دارای وابستگی و پیام توضیحی |
| Demo | دسترسی مستقیم به run/report واقعی نتایج نسازد؛ تمام صفحات و print دمو نشان واضح داشته باشند؛ دمو دسترسی نوشتن به محیط واقعی نداشته باشد |

تست دمو باید generator فعلی را با remap شناسه evidence و mapping اجرا کند؛ review هر وضعیت نباید در UI به کاربر القا کند که امتیاز نمونه واقعاً بر اساس آن محاسبه شده است. دمو یک walkthrough از داده ثابت است.

## تصمیم‌های باز پیش از اجرا

1. حذف والد دارای وابستگی در طراحی فعلی 409 است؛ رفتار mock فعلی حذف آبشاری دارد. این تغییر رفتار نیازمند تأیید صریح طراحی است.
2. سقف ۲۰ MiB، انواع PDF/DOCX/TXT، retention، backup و امکان download تصمیم پیشنهادی‌اند و باید با محیط استقرار و حساسیت اسناد تأیید شوند.
3. تعارض پروپوزال و اسلاید ۱۴ درباره نبود داده، اعتبار capability model و روش علمی scoring به فاز پژوهشی واگذار می‌شود.
4. الزامات دسترسی شبکه و مدل کاربران پیش از هر استقرار فراتر از محیط خصوصی باید دوباره تصمیم‌گیری شوند.
