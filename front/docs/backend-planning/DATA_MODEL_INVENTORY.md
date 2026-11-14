# موجودی اولیه مدل داده فرانت‌اند

این موجودی مدل فرانت‌اند است و به‌تنهایی مدل دیتابیس نیست. همه شناسه‌های دامنه فعلی `number` و تاریخ‌ها `string` هستند (`types/common.ts`). علامت اختیاری در این جدول به تعریف TypeScript اشاره دارد، نه اعتبارسنجی پایگاه داده.

| مدل | فیلدهای الزامی علاوه بر id و timestamps | فیلدهای اختیاری | منابع شواهد |
|---|---|---|---|
| Enterprise | name، industry | description، country، businessModel، companySize، logo | `types/enterprise.ts`، `components/enterprise/NewModal.vue` |
| DataSource | enterpriseId، name، type، enabled | description، businessText، fileName | `types/datasource.ts`، `pages/enterprise/[id]/data-sources.vue` |
| Assessment | enterpriseId، name، version، status | description، overallScore، completedAt | `types/assessment.ts`، `components/assessment/NewModal.vue` |
| Capability | name، parentId، level، order | description | `types/capability.ts`، `mock/capabilities.ts` |
| Evidence | assessmentId، dataSourceId، title، content، context، metadata | — | `types/evidence.ts`، `mock/evidence.ts` |
| CapabilityEvidenceMapping | assessmentId، capabilityId، evidenceId، confidence، reasoning | approved، reviewStatus | `types/mapping.ts`، `mock/mappings.ts` |
| CapabilityAssessment | assessmentId، capabilityId، score، maturityLevel، confidence، reasoning | — | `types/assessment-result.ts`، `mock/capability-assessments.ts` |
| AssessmentPipeline | assessmentId، step، status | startedAt، completedAt | `types/pipeline.ts`، `mock/pipeline.ts` |

`DataSource.type` از `clarity`، `matomo`، `support`، `business_document`، `capability_excel`، `server_log`، `event_log` یا `custom` است، اما گزینه‌های فرم فعلی `custom` را عرضه نمی‌کنند. مقدار اولیه فرم `clarity` و `enabled` برای منبع جدید `true` است. `fileName` صرفاً نام ساختگی دمو است.

`Assessment.status` شامل `draft`، `running`، `completed` و `failed` است؛ نمونه‌های completed و running شبیه‌سازی‌اند. `version` در فرم به‌طور پیش‌فرض `1.0` است و به‌تنهایی مفهوم نسخه دیتاست یا snapshot را ندارد. داده‌های Capability و Evidence و Mapping و نتیجه و Pipeline فعلی صرفاً دمو هستند و از وجودشان ضرورت جدول واقعی در MVP نتیجه نمی‌شود.
