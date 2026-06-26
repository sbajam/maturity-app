<script setup lang="ts">
import { average } from "~/utils/number"
import type {
    Assessment,
    CapabilityAssessment,
} from "~/types"

const props = defineProps<{
    assessment: Assessment
    capabilityAssessments: CapabilityAssessment[]
}>()

const averageMaturity = computed(() => {
    if (!props.capabilityAssessments.length) return "-"

    return (
        props.capabilityAssessments.reduce(
            (sum, item) => sum + item.maturityLevel,
            0,
        ) / props.capabilityAssessments.length
    ).toFixed(1)
})

const averageConfidence = computed(() =>
    average(
        props.capabilityAssessments.map(
            item => item.confidence,
        ),
    ),
)
</script>

<template>
    <AppCard title="Assessment Summary" description="Calculated metrics from the latest assessment.">
        <div class="space-y-5">

            <AppDescriptionItem label="Overall Score" icon="lucide:badge-percent">
                {{ assessment.overallScore ?? "-" }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Average Maturity" icon="lucide:layers-3">
                {{ averageMaturity }}
            </AppDescriptionItem>

            <AppDescriptionItem label="Average Confidence" icon="lucide:shield-check">
                {{ averageConfidence }}%
            </AppDescriptionItem>

            <AppDescriptionItem label="Capabilities Assessed" icon="lucide:boxes">
                {{ capabilityAssessments.length }}
            </AppDescriptionItem>

        </div>
    </AppCard>
</template>