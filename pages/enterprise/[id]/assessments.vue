<script setup lang="ts">
import type {
    Assessment,
    AssessmentPipeline,
    Enterprise,
} from "~/types"

const enterprise: Enterprise = {
    id: 1,

    createdAt: "2026-01-01",

    updatedAt: "2026-01-01",

    name: "Vornaco",

    description:
        "شرکت ورناکو در زمینه توسعه نرم افزارهای سازمانی و هوش مصنوعی فعالیت می‌کند.",

    industry: "Software",

    country: "Iran",

    businessModel: "B2B SaaS",

    companySize: "11-50",
}

const assessments = ref<Assessment[]>([
    {
        id: 1,

        enterpriseId: 1,

        name: "Initial Assessment",

        description:
            "Initial enterprise capability assessment.",

        status: "completed",

        overallScore: 82,

        completedAt: "2026-02-10",

        createdAt: "2026-02-09",

        updatedAt: "2026-02-10",
    },

    {
        id: 2,

        enterpriseId: 1,

        name: "Sprint 1 Assessment",

        description:
            "Evaluation after Sprint 1.",

        status: "running",

        overallScore: undefined,

        completedAt: undefined,

        createdAt: "2026-03-05",

        updatedAt: "2026-03-05",
    },

    {
        id: 3,

        enterpriseId: 1,

        name: "June Assessment",

        description:
            "Quarterly maturity assessment.",

        status: "draft",

        overallScore: undefined,

        completedAt: undefined,

        createdAt: "2026-06-01",

        updatedAt: "2026-06-01",
    },
])

const pipelines = ref<Record<number, AssessmentPipeline[]>>({
    // ------------------------------------------------------------------
    // Assessment 1 (Completed)
    // ------------------------------------------------------------------

    1: [
        {
            id: 1,
            assessmentId: 1,
            step: "collect_sources",
            status: "completed",
            startedAt: "10:00",
            completedAt: "10:02",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 2,
            assessmentId: 1,
            step: "extract_evidence",
            status: "completed",
            startedAt: "10:02",
            completedAt: "10:05",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 3,
            assessmentId: 1,
            step: "mapping",
            status: "completed",
            startedAt: "10:05",
            completedAt: "10:08",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 4,
            assessmentId: 1,
            step: "assessment",
            status: "completed",
            startedAt: "10:08",
            completedAt: "10:12",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 5,
            assessmentId: 1,
            step: "aggregation",
            status: "completed",
            startedAt: "10:12",
            completedAt: "10:14",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 6,
            assessmentId: 1,
            step: "report",
            status: "completed",
            startedAt: "10:14",
            completedAt: "10:15",
            createdAt: "",
            updatedAt: "",
        },
    ],

    // ------------------------------------------------------------------
    // Assessment 2 (Running)
    // ------------------------------------------------------------------

    2: [
        {
            id: 7,
            assessmentId: 2,
            step: "collect_sources",
            status: "completed",
            startedAt: "14:00",
            completedAt: "14:03",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 8,
            assessmentId: 2,
            step: "extract_evidence",
            status: "completed",
            startedAt: "14:03",
            completedAt: "14:08",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 9,
            assessmentId: 2,
            step: "mapping",
            status: "completed",
            startedAt: "14:08",
            completedAt: "14:11",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 10,
            assessmentId: 2,
            step: "assessment",
            status: "running",
            startedAt: "14:11",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 11,
            assessmentId: 2,
            step: "aggregation",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 12,
            assessmentId: 2,
            step: "report",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
    ],

    // ------------------------------------------------------------------
    // Assessment 3 (Draft)
    // ------------------------------------------------------------------

    3: [
        {
            id: 13,
            assessmentId: 3,
            step: "collect_sources",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 14,
            assessmentId: 3,
            step: "extract_evidence",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 15,
            assessmentId: 3,
            step: "mapping",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 16,
            assessmentId: 3,
            step: "assessment",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 17,
            assessmentId: 3,
            step: "aggregation",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
        {
            id: 18,
            assessmentId: 3,
            step: "report",
            status: "waiting",
            createdAt: "",
            updatedAt: "",
        },
    ],
})

const selectedAssessmentId = ref<number>(1)
const selectedPipeline = computed(() => {
  return (
    pipelines.value[selectedAssessmentId.value] ?? []
  )
})

const selectedAssessment = computed(() =>
    assessments.value.find(
        assessment =>
            assessment.id ===
            selectedAssessmentId.value,
    ),
)

function selectAssessment(id: number) {
    selectedAssessmentId.value = id
}

function createAssessment() {
    console.log("Create Assessment")
}

function editAssessment() {
    console.log("Edit Enterprise")
}

function newAssessment() {
    console.log("New Assessment")
}
</script>

<template>
    <div class="space-y-6">

        <EnterpriseHeader :enterprise="enterprise" @edit="editAssessment" @new-assessment="newAssessment" />

        <EnterpriseTabs />

        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-4">

                <AssessmentList :items="assessments" :selected-id="selectedAssessmentId
                    " @select="
                        selectAssessment
                    " @new="
                        createAssessment
                    " />

            </div>

            <div class="col-span-8">
                <AssessmentDetail :assessment="selectedAssessment" :pipeline="selectedPipeline" />
            </div>
        </div>

    </div>
</template>