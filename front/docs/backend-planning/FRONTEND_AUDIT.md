# ممیزی فرانت‌اند: یافته‌های بررسی‌شده

این فهرست هنوز ممیزی کامل همه componentها نیست. استنادها نسبت به ریشه پروژه‌اند؛ «نمایشی» به معنای نبود اتصال واقعی است، نه نبود رابط کاربری.

| Feature / مسیر | ورودی و عملیات فعلی | state و داده | وضعیت / اتصال پیشنهادی |
|---|---|---|---|
| داشبورد `/` | لینک به سازمان‌ها، ارزیابی و گزارش سازمان اول | شمارش سازمان و ارزیابی کامل؛ منابع و آخرین ارزیابی فقط سازمان اول | `pages/index.vue`؛ محاسبه عنوان سراسری منابع نادرست؛ GET dashboard |
| سازمان `/enterprise` | ایجاد name، industry، country، businessModel، companySize، description؛ حذف با confirm | `useMockStore`؛ trim name و industry؛ reset و بستن فرم | `pages/enterprise/index.vue`, `components/enterprise/NewModal.vue`؛ API فهرست/ایجاد/حذف |
| نمای سازمان `/enterprise/:id` | اقدام ارزیابی؛ دکمه Edit بدون handler | `useEnterpriseRoute` و آخرین ارزیابی کامل | `pages/enterprise/[id]/index.vue`, `components/enterprise/Header.vue`؛ fetch سازمان و منابع؛ edit غیرفعال |
| منابع `/enterprise/:id/data-sources` | افزودن name/type/description/businessText؛ ویرایش description و businessText؛ toggle، حذف و upload نمایشی | state محلی modal؛ name trim الزامی؛ type پیش‌فرض clarity؛ فایل فقط نام ساختگی | همان فایل صفحه؛ CRUD metadata و API اسناد؛ enabled به معنی اتصال نیست |
| ارزیابی `/enterprise/:id/assessments` | ایجاد name/version/description، انتخاب از فهرست، بررسی mapping | انتخاب با query `id` و mock pipeline؛ version خالی 1.0 | صفحه و `components/assessment/NewModal.vue`؛ فقط draft واقعی؛ بازبینی mapping صرفاً demo |
| redirect ارزیابی | بدون ورودی فرم | status completed به report و بقیه به run هدایت می‌شود | `pages/enterprise/[id]/assessments/[assessmentId]/index.vue`؛ تطبیق draft و مالکیت سازمان |
| wizard `/run` | review، تعیین approved/rejected/irrelevant، سپس نمایش تحلیل و نتیجه | `useAssessmentWizard.ts` و `StepEvidence.vue`؛ تأخیر مصنوعی، داده قالبی و بررسی pending | مسیر run و `components/assessment/wizard/`؛ در محیط واقعی غیرفعال، demo مجزا |
| گزارش ارزیابی `/report` | نمایش نتیجه و print مرورگر | evidence، mapping، نتیجه capability، recommendation و pipeline نمونه | صفحه report، `components/assessment/Results.vue`, `Timeline.vue`؛ واقعی بدون نتیجه، demo با برچسب |
| گزارش‌های سازمان `/reports` | مشاهده گزارش و `window.print()` | ارزیابی‌های completed نمونه | `pages/enterprise/[id]/reports.vue`؛ حالت واقعی خالی؛ دکمه چاپ ردیف فعلی کل صفحه فهرست را چاپ می‌کند |

## State و فرم

- `useEnterpriseRoute.ts` و `useEnterpriseContext.ts` هر دو با route و `useMockStore` سازمان و لیست وابسته را محاسبه می‌کنند. `useAssessmentWizard.ts` مرحله wizard، loading و وضعیت بازبینی را محلی نگه می‌دارد. `useMockStore.ts` چندین `ref` سطح ماژول و شمارنده شناسه دارد؛ داده پایدار نیست.
- `components/ui/Input.vue`, `Select.vue`, `Textarea.vue` پراپ `required` را برای نشان ستاره استفاده می‌کنند، اما آن را به کنترل HTML منتقل نمی‌کنند؛ اعتبارسنجی فرم‌های بررسی‌شده با شرط در تابع submit انجام می‌شود. خطاهای فرم فعلاً در این جریان‌ها به کاربر توضیح داده نمی‌شوند.
- `DataTable.vue` loading و empty دارد اما در کد آن sorting، filtering و pagination اجرا نشده است، هرچند type ستون گزینه sortable دارد. جستجو و اعلان Header در `components/app/Search.vue` و `Notifications.vue` handler ندارند؛ `UserMenu.vue` نام و نقش ثابت نمایش می‌دهد.
- `AssessmentDetail.vue` نمایش run را برای draft یا failed و report را برای completed مشروط می‌کند؛ این وضعیت‌ها در MVP واقعی به خروجی علمی متصل نخواهند شد.

## Mockها و محاسبات

| فایل | محتوا و تعیین تکلیف |
|---|---|
| `mock/enterprise.ts` | یک سازمان نمایشی؛ فقط seed محیط دمو |
| `mock/data-sources.ts` | شش منبع نمونه، شامل نام فایل بدون فایل واقعی؛ فقط seed دمو، نام فایل حذف یا فایل آزمایشی واقعی ساخته شود |
| `mock/assessments.ts` | یک completed، یک running، یک draft؛ دو مورد اول نتیجه واقعی نیستند |
| `mock/capabilities.ts` | ۱۲ گره و سه ریشه درخت؛ مدل نمونه، نه مدل علمی تأییدشده |
| `mock/evidence.ts` | هشت نمونه مرتبط با ارزیابی و منابع؛ فقط fixture دمو |
| `mock/mappings.ts` | هشت mapping نمونه؛ generator شناسه evidence جدید را بازنگاشت نمی‌کند |
| `mock/capability-assessments.ts` | چهار امتیاز برگ و توصیه‌های ثابت؛ تأیید mapping امتیاز را تغییر نمی‌دهد |
| `mock/pipeline.ts` | شش مرحله نمونه با زمان نمایشی، نه فرایند واقعی |

`utils/capability.ts` برای والد میانگین فرزندان دارای نتیجه را محاسبه و سطح را گرد می‌کند؛ `utils/number.ts` برای آرایه خالی صفر می‌دهد. هیچ‌یک مبنای scoring واقعی نیست. `components/capability/ScoreTable.vue` mappingها را بدون فیلتر وضعیت بازبینی می‌شمارد؛ `Timeline.vue` امتیازهای falsy را کنار می‌گذارد. `StepAiLoading.vue` پیشرفت تصادفی و زمان‌بندی مصنوعی دارد. این موارد باید در دمو واضح بمانند و به داده واقعی منتقل نشوند.

## کنترل پوشش فعلی

| بخش | وضعیت | توضیح |
|---|---|---|
| ۹ route | Reviewed | مسیرها و عملیات اصلی خوانده شده‌اند؛ آزمون مرورگر انجام نشده |
| مدل‌های دامنه و mockهای اصلی | Reviewed | موجودی در `DATA_MODEL_INVENTORY.md`؛ محدودیت تفصیلی هر نمونه نیاز به تطبیق نهایی دارد |
| componentهای مشترک و جزئیات template | Reviewed | scriptها و actionهای قابل جستجو مرور شده‌اند؛ اجرای بصری و رفتار runtime تأیید نشده‌اند |
| دیتابیس و API | Designed | پیشنهاد قابل بازبینی؛ آزمون عملی failure recovery در پیاده‌سازی لازم است |
| seed و demo | Designed | محافظت محیط و نمایش مشخص شده؛ fixture و تست آن پیاده‌سازی نشده‌اند |
| Taskها و اتصال | Designed | مسیرها، فایل‌های اصلی و آزمون‌ها ثبت شده‌اند؛ جزئیات آزمون runtime در پیاده‌سازی تکمیل می‌شود |
| AI، ingestion، scoring علمی | Deferred | طبق محدوده کاربر |
| سند فنی DOCX | Blocked | فایل نام‌برده در محل‌های بررسی‌شده یافت نشد |
