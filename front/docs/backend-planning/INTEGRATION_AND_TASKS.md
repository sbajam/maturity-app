# اتصال فرانت‌اند و Taskهای پیشنهادی

قرارداد داده در [DATABASE_DESIGN.md](DATABASE_DESIGN.md)، API در [API_CONTRACT.md](API_CONTRACT.md) و جزئیات فایل‌ها و تست‌ها در [IMPLEMENTATION_DETAIL.md](IMPLEMENTATION_DETAIL.md) آمده است.

## معماری و فایل‌های پیشنهادی Backend

ساختار زیر انتخاب پیشنهادی است؛ هر فایل صرفاً در Task متناظر ایجاد می‌شود:

```text
backend/
  package.json, tsconfig.json, .env.example, .sequelizerc
  src/
    app.ts, server.ts
    config/env.ts, config/database.ts, config/logger.ts
    contracts/http.ts, contracts/errors.ts
    middlewares/error-handler.ts, middlewares/not-found.ts, middlewares/validate.ts
    models/index.ts, models/enterprise.model.ts, models/data-source.model.ts
    models/source-document.model.ts, models/assessment.model.ts
    routes/index.ts, routes/enterprise.routes.ts, routes/data-source.routes.ts
    routes/document.routes.ts, routes/assessment.routes.ts, routes/dashboard.routes.ts
    controllers/enterprise.controller.ts, controllers/data-source.controller.ts
    controllers/document.controller.ts, controllers/assessment.controller.ts, controllers/dashboard.controller.ts
    services/enterprise.service.ts, services/data-source.service.ts, services/document.service.ts
    services/assessment.service.ts, services/dashboard.service.ts
    schemas/common.schema.ts, schemas/enterprise.schema.ts, schemas/data-source.schema.ts
    schemas/document.schema.ts, schemas/assessment.schema.ts
    utils/pagination.ts, utils/file-storage.ts
  migrations/, seeders/, scripts/reconcile-files.ts
  tests/unit/, tests/integration/
```

`env.ts` تنظیمات و محدوده اجرا را validate می‌کند؛ database و logger تنظیم اتصال و log بدون اطلاعات محرمانه‌اند. routes صرفاً middleware و controller را متصل می‌کنند. controllers تبدیل HTTP و فراخوانی service را انجام می‌دهند؛ services قواعد، تعلق والد و transaction را بر models اعمال می‌کنند. schemas ورودی Zod، error-handler نگاشت خطا، file-storage عملیات دیسک محدود، و reconcile-files بازیابی فایل‌های با وضعیت نامشخص را پوشش می‌دهند. migrations با Sequelize CLI، پسوند و پیکربندی CommonJS سازگار با تنظیم ESM پروژه backend استفاده کنند؛ seed دمو محافظت مستقل دارد.

## اتصال صفحه‌ها

یک `services/api-client.ts` در فرانت‌اند با `$fetch` و base URL تنظیم‌شده Nuxt و فایل‌های `services/enterprise.ts`, `data-source.ts`, `document.ts`, `assessment.ts`, `dashboard.ts` برای قراردادها پیشنهاد می‌شود. در SSR آدرس backend باید از runtime config خصوصی سرور و در مرورگر از آدرس قابل دسترس همان محیط استفاده شود؛ URL محرمانه در public config قرار نگیرد. `useFetch`/`useAsyncData` با کلید وابسته به شناسه route و state جدا برای درخواست استفاده شود؛ state سطح ماژول `useMockStore` به داده واقعی متصل نشود. پس از mutation موفق، لیست مربوط refresh و modal بسته شود؛ هنگام شکست modal و ورودی حفظ و خطا نمایش داده شود.

| صفحه | مسیر اتصال و تغییر |
|---|---|
| `/` | `pages/index.vue` → dashboard service → GET dashboard → DashboardController → DashboardService → models؛ شمارنده‌ها سراسری و نتیجه null؛ کارت‌های نتیجه بدون داده واقعی |
| `/enterprise` | صفحه و `components/enterprise/NewModal.vue` → enterprise service → GET/POST/DELETE؛ خطای فیلد و 409 نمایش؛ پس از ایجاد navigate به id برگشتی |
| `/enterprise/:id` | `useEnterpriseRoute.ts` → GET سازمان و GET منابع؛ شمارش‌ها بر اساس total یا dashboard scoped، با بارگذاری کامل صفحات در صورت نیاز؛ edit غیرفعال؛ score ناموجود |
| `/enterprise/:id/data-sources` | صفحه → GET/POST/PATCH/DELETE منابع و فهرست/upload/download/delete اسناد؛ جایگزینی fileName منفرد با لیست اسناد؛ toggle مقدار صریح `enabled` می‌فرستد |
| `/enterprise/:id/assessments` | صفحه، `AssessmentNewModal` و `AssessmentDetail` → GET/POST/DELETE assessment؛ پس از ایجاد به جزئیات draft بازگردد و به run خودکار نرود |
| `/enterprise/:id/assessments/:assessmentId` | GET ارزیابی تو در تو؛ draft به صفحه جزئیات هدایت شود، 404 برای id سازمان ناسازگار |
| `/enterprise/:id/assessments/:assessmentId/run` | محیط واقعی پیام عدم دسترسی به تحلیل و بازگشت به draft؛ محیط demo فقط fixture مستقل و نشان Demo |
| `/enterprise/:id/assessments/:assessmentId/report` | محیط واقعی پیام نبود نتیجه؛ محیط demo گزارش fixture مشخص با نشان Demo |
| `/enterprise/:id/reports` | محیط واقعی empty state بدون نمره یا گزارش ساختگی؛ در demo اطلاعات fixture و print برچسب‌دار |

برای مسیرهای دارای شناسه، دریافت‌ها پس از تغییر route و refresh تکرار شوند؛ id نامعتبر پیش از درخواست خطا دهد و 404 با empty و 5xx با error متمایز باشد. pagination واقعی در فهرست‌ها اضافه شود. `types/enterprise.ts`, `datasource.ts`, `assessment.ts` با nullableهای API و نوع `SourceDocument` تطبیق داده شوند. `useEnterpriseContext.ts` و `useEnterpriseRoute.ts` هر دو بررسی و یک منبع داده request-scoped مشترک برای مصرف‌کنندگان واقعی به کار رود؛ demo به `useMockStore` محدود شود. نمودارها و میانگین‌های موجود فقط در دمو مجازند. `components/ui` و فایل‌های unrelated بدون نیاز مشخص تغییر نکنند.

## Taskهای مستقل

در همه Taskها DoD شامل تست‌های نام‌برده، type-check، بازبینی diff و نبود تغییر خارج scope است. هیچ Task این سند مجوز اجرای فعلی نیست.

| ID | هدف و فایل‌ها | پیش‌نیاز؛ معیار پذیرش و آزمون |
|---|---|---|
| T01 | اسکلت Backend، config، logger، app/server و middleware | —؛ اجرا با config معتبر، رد config ناقص، error استاندارد و CORS محدود؛ آزمون 400/404/500 |
| T02 | چهار migration و چهار model و associations | T01؛ schema و rollback در DB آزمون، FK و CHECK معتبر و نقض‌شده آزمایش شوند |
| T03 | enterprise schema/service/controller/routes | T02؛ ایجاد/فهرست/جزئیات/حذف، validation و 404/409 و همزمانی حذف |
| T04 | data-source schema/service/controller/routes | T03؛ ایجاد/فهرست/patch/delete، تعلق سازمان، type و متن ناسازگار و سند وابسته |
| T05 | file-storage، document schema/service/controller/routes و reconciliation | T04؛ چند فایل، سقف، نوع، دسترسی والد، stream، شکست دیسک/DB و بازیابی crash؛ تست فایل موقت خصوصی |
| T06 | assessment schema/service/controller/routes | T03؛ فقط draft، default version، حذف و دسترسی ناسازگار؛ تست payload status جعلی |
| T07 | dashboard service/controller/routes | T04 و T06؛ شمارش کل و null نتیجه؛ تست چند سازمان و داده خالی |
| T08 | seed demo و guard | T02؛ فقط DB دمو، اجرای مکرر بدون تکرار، عدم تغییر DB واقعی، fixture بدون فایل جعلی |
| T09 | API client و runtime config فرانت‌اند | T01؛ SSR و browser، نگاشت خطا و null، عدم اشتراک state میان درخواست‌ها |
| T10 | اتصال لیست و نمای سازمان | T03 و T09؛ refresh، pagination، ایجاد، حذف و 409؛ edit غیرفعال |
| T11 | اتصال منابع و اسناد | T05 و T09؛ CRUD metadata، چند فایل، شکست و retry، refresh، عدم نمایش اتصال واقعی |
| T12 | اتصال پیش‌نویس و dashboard | T06، T07 و T09؛ draft پایدار، آمار درست، id نامعتبر و cross-organization |
| T13 | جداسازی دمو و حالت ناموجود واقعی | T08 و T12؛ دمو با برچسب و fixture ثابت، بدون نوشتن نتیجه واقعی، refresh و print واضح |
| T14 | تست یکپارچه و ارزیابی پوشش | T10–T13؛ سناریوی کامل، شکست‌های DB/disk، isolation، امنیت خصوصی و بازبینی نهایی |

ترتیب milestone: T01–T02 زیرساخت؛ T03–T07 API؛ T08 دمو؛ T09–T13 اتصال تدریجی؛ T14 کنترل نهایی. در انتهای هر milestone سرویس و آزمون‌های مربوط مستقل اجراپذیر باشند.
