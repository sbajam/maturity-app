# قرارداد پیشنهادی API نسخه MVP

این قرارداد برای بازبینی طراحی است، نه API پیاده‌سازی‌شده. `E` شناسه سازمان، `S` شناسه منبع، `D` شناسه سند و `A` شناسه ارزیابی‌اند. تمام مسیرها زیر `/api/v1` هستند. شناسه‌ها عدد صحیح مثبت در محدوده integer هستند. احراز هویت وجود ندارد؛ سرویس فقط در شبکه خصوصی قابل دسترسی است. ورودی تو در تو باید تعلق هر رکورد به والد مسیر را بررسی کند و در غیر این صورت 404 بدهد.

## قرارداد مشترک

موفقیت تک‌رکوردی `{ "data": {...} }`؛ لیست `{ "data": [...], "pagination": { "page": 1, "pageSize": 20, "total": 1 } }`. DELETE موفق `204` بدون body. خطا `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "fields": [{ "path": "name", "message": "Required" }] } }`؛ fields فقط برای validation. خطای داخلی جزئیات فنی را به client نمی‌دهد.

تمام لیست‌ها `page` پیش‌فرض 1 و `pageSize` پیش‌فرض 20، حداکثر 100 دارند؛ query نامعتبر 400 است. ترتیب ثابت `createdAt DESC, id DESC`؛ sorting سفارشی و فیلتر جستجو در MVP وجود ندارند. چون UI فعلی همه اقلام را نشان می‌دهد، integration باید کنترل pagination اضافه کند؛ شمارنده داشبورد از تعداد صفحه جاری محاسبه نشود.

`400 VALIDATION_ERROR` برای مسیر، query یا body نامعتبر؛ `404 NOT_FOUND` برای رکورد یا ارتباط ناموجود؛ `409 RESOURCE_NOT_EMPTY` برای حذف والد دارای وابستگی؛ `413 FILE_TOO_LARGE`؛ `415 UNSUPPORTED_FILE_TYPE`؛ `500 INTERNAL_ERROR`؛ در نبود دیتابیس/دیسک `503 SERVICE_UNAVAILABLE`. همه به‌جز 204 قالب خطای مشترک دارند. `Content-Type: application/json` برای JSON و `multipart/form-data` برای upload. timestampها ISO 8601 UTC و nullableهای دیتابیس صریحاً `null` هستند. client فیلدهای null را به optionalهای موجود نگاشت می‌کند.

## بدنه‌ها و validation

`EnterpriseInput`: name و industry رشته trim شده 1..200؛ description nullable تا 10000؛ country nullable تا 120؛ businessModel nullable تا 120؛ companySize nullable یکی از `1-10`, `11-50`, `51-200`, `201-500`, `500+`. فیلدهای دیگر رد شوند. مثال:

```json
{"name":"Example","industry":"Software","country":"Iran","businessModel":"B2B","companySize":"11-50","description":null}
```

`SourceCreate`: name طول 1..200، type یکی از انواع سند دیتابیس، description nullable تا 10000، businessText nullable تا 50000 فقط برای `business_document`؛ enabled اختیاری و پیش‌فرض true. `SourcePatch`: فقط description، businessText و enabled؛ حداقل یک فیلد، null برای حذف متن، type و name تغییرناپذیر تا UI و قرارداد جدید صریحاً تصویب شوند. مثال:

```json
{"name":"Business context","type":"business_document","description":null,"businessText":"Business rules","enabled":true}
```

`AssessmentCreate`: name طول 1..200، description nullable تا 10000، version trim شده 1..40 با پیش‌فرض `1.0`. status از body پذیرفته نمی‌شود. مثال: `{"name":"Initial assessment","version":"1.0","description":null}`.

نمونه پاسخ سازمان: `{"data":{"id":1,"name":"Example","industry":"Software","description":null,"country":"Iran","businessModel":"B2B","companySize":"11-50","createdAt":"2026-01-01T00:00:00.000Z","updatedAt":"2026-01-01T00:00:00.000Z"}}`. منبع علاوه بر فیلدهای create شامل id، enterpriseId و timestamps است. ارزیابی شامل id، enterpriseId، name، description، version، status=`draft` و timestamps است. سند شامل id، dataSourceId، originalName، mediaType، sizeBytes، sha256 و timestamps است؛ storageKey هرگز بازگردانده نمی‌شود.

## عملیات

| Method و endpoint | Controller → Service | ورودی و پاسخ | جدول / transaction | مصرف‌کننده |
|---|---|---|---|---|
| GET `/enterprises` | Enterprise → list | query مشترک؛ 200 لیست | enterprises / خیر | `/enterprise`، dashboard |
| POST `/enterprises` | Enterprise → create | EnterpriseInput؛ 201 رکورد | enterprises / خیر | NewModal سازمان |
| GET `/enterprises/:E` | Enterprise → get | 200 رکورد | enterprises / خیر | context همه صفحات سازمان |
| DELETE `/enterprises/:E` | Enterprise → remove | 204؛ در وجود فرزند 409 | enterprises، data_sources، assessments / بله | لیست سازمان |
| GET `/enterprises/:E/data-sources` | DataSource → list | query مشترک؛ 200 لیست | enterprises، data_sources / خیر | صفحه منابع، overview |
| POST `/enterprises/:E/data-sources` | DataSource → create | SourceCreate؛ 201 | enterprises، data_sources / بله برای کنترل والد | فرم منبع |
| PATCH `/enterprises/:E/data-sources/:S` | DataSource → update | SourcePatch؛ 200 رکورد | data_sources / بله | ویرایش و toggle منبع |
| DELETE `/enterprises/:E/data-sources/:S` | DataSource → remove | 204؛ دارای سند 409 | data_sources، source_documents / بله | حذف منبع |
| GET `/enterprises/:E/data-sources/:S/documents` | Document → list | query مشترک؛ 200 لیست | data_sources، source_documents / خیر | ویرایش منبع |
| POST `/enterprises/:E/data-sources/:S/documents` | Document → upload | multipart فیلد `file`؛ 201 سند | data_sources، source_documents و دیسک / بله همراه جبران | upload سند |
| GET `/enterprises/:E/data-sources/:S/documents/:D/content` | Document → download | 200 stream، Content-Disposition attachment و nosniff | source_documents و دیسک / خیر | دریافت سند |
| DELETE `/enterprises/:E/data-sources/:S/documents/:D` | Document → remove | 204 | source_documents و دیسک / بله همراه جبران | حذف سند |
| GET `/enterprises/:E/assessments` | Assessment → list | query مشترک؛ 200 لیست | enterprises، assessments / خیر | صفحه ارزیابی |
| POST `/enterprises/:E/assessments` | Assessment → create | AssessmentCreate؛ 201 draft | enterprises، assessments / بله برای کنترل والد | NewModal ارزیابی |
| GET `/enterprises/:E/assessments/:A` | Assessment → get | 200 draft | assessments / خیر | جزئیات و route redirect |
| DELETE `/enterprises/:E/assessments/:A` | Assessment → remove | 204 | assessments / بله | action حذف draft جدید برای رفع وابستگی |
| GET `/dashboard` | Dashboard → summary | 200 summary زیر | enterprises، data_sources، assessments / read transaction | `/` |

Dashboard: `{"data":{"enterpriseCount":3,"enabledSourceCount":4,"draftAssessmentCount":2,"latestResult":null}}`. شمارش‌ها در کل سازمان‌ها هستند. KPI بلوغ و گزارش واقعی در دسترس نیست؛ UI نباید 0 را جایگزین نتیجه ناموجود کند. برای ویرایش سازمان، دکمه فعلی هیچ handler ندارد؛ فعلاً غیرفعال و PATCH سازمان خارج از این قرارداد است.

فایل دانلودی با نام ایمن‌شده در header ارسال شود؛ هیچ نام واقعی به‌عنوان مسیر استفاده نشود. صحت نوع فایل با تشخیص محدود و محافظه‌کارانه انجام شود و فایل به‌عنوان attachment و غیرقابل اجرا ارائه شود. rate limit برای API و سقف سخت upload در reverse proxy و برنامه اعمال شود. CORS فقط origin تنظیم‌شده فرانت‌اند خصوصی را بپذیرد.
