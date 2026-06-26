<script setup lang="ts">
import type {
    Assessment,
    CapabilityAssessment,
    DataSource,
    Enterprise,
} from "~/types"

// -----------------------------------------------------------------------------
// Temporary Mock Data
// Remove after API integration
// -----------------------------------------------------------------------------

const enterprise: Enterprise = {
    id: 1,
    createdAt: "2026-01-05T10:30:00Z",
    updatedAt: "2026-02-10T09:00:00Z",

    name: "Vornaco",

    description:
        "شرکت ورناکو در زمینه توسعه نرم‌افزارهای سازمانی، هوش مصنوعی و تحلیل فرایندهای کسب‌وکار فعالیت می‌کند.",

    industry: "Software",

    country: "Iran",

    businessModel: "B2B SaaS",

    companySize: "11-50",

    logo: "",
}

const latestAssessment: Assessment = {
    id: 10,

    enterpriseId: enterprise.id,

    createdAt: "2026-02-01T08:00:00Z",

    updatedAt: "2026-02-01T09:20:00Z",

    name: "Initial Capability Assessment",

    description:
        "ارزیابی اولیه جهت تعیین سطح بلوغ قابلیت‌های سازمان.",

    status: "completed",

    overallScore: 78,

    completedAt: "2026-02-01T09:20:00Z",
}

const capabilityAssessments: CapabilityAssessment[] = [
    {
        id: 1,
        assessmentId: latestAssessment.id,
        capabilityId: 1,
        createdAt: "",
        updatedAt: "",
        score: 82,
        maturityLevel: 4,
        confidence: 91,
        reasoning: "",
    },

    {
        id: 2,
        assessmentId: latestAssessment.id,
        capabilityId: 2,
        createdAt: "",
        updatedAt: "",
        score: 74,
        maturityLevel: 3,
        confidence: 84,
        reasoning: "",
    },

    {
        id: 3,
        assessmentId: latestAssessment.id,
        capabilityId: 3,
        createdAt: "",
        updatedAt: "",
        score: 79,
        maturityLevel: 4,
        confidence: 88,
        reasoning: "",
    },
]

const dataSources: DataSource[] = [
    {
        id: 1,
        enterpriseId: enterprise.id,
        createdAt: "",
        updatedAt: "",

        name: "Microsoft Clarity",

        type: "clarity",

        enabled: true,
    },

    {
        id: 2,
        enterpriseId: enterprise.id,
        createdAt: "",
        updatedAt: "",

        name: "Business Documents",

        type: "business_document",

        enabled: true,
    },

    {
        id: 3,
        enterpriseId: enterprise.id,
        createdAt: "",
        updatedAt: "",

        name: "Customer Feedback",

        type: "customer_feedback",

        enabled: false,
    },
]

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

const onEdit = () => {
    console.log("Edit Enterprise")
}

const onNewAssessment = () => {
    console.log("New Assessment")
}
</script>

<template>
    <div class="space-y-8">
        <EnterpriseHeader :enterprise="enterprise" @edit="onEdit" @new-assessment="onNewAssessment" />

        <EnterpriseTabs />

        <section class="grid gap-6 xl:grid-cols-12">
            <div class="space-y-6 xl:col-span-8">
                <EnterpriseInformationCard :enterprise="enterprise" />

                <EnterpriseLatestAssessmentCard :assessment="latestAssessment" />
            </div>

            <div class="space-y-6 xl:col-span-4">
                <EnterpriseAssessmentSummaryCard :assessment="latestAssessment"
                    :capability-assessments="capabilityAssessments" />

                <EnterpriseDataSourcesCard :sources="dataSources" />
            </div>
        </section>
    </div>
</template>