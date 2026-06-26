<template>
    <section class="rounded-2xl border border-slate-200 bg-white">
        <div class="border-b border-slate-100 px-6 py-5">
            <h2 class="text-lg font-semibold text-slate-900">
                Quick Actions
            </h2>
        </div>

        <div class="space-y-3 p-6">

            <button
                class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50">
                <span>New Assessment</span>

                <Icon name="lucide:arrow-right" size="18" />
            </button>

            <button
                class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50">
                <span>Manage Data Sources</span>

                <Icon name="lucide:arrow-right" size="18" />
            </button>

            <button
                class="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm transition hover:bg-slate-50">
                <span>Generate Report</span>

                <Icon name="lucide:file-text" size="18" />
            </button>

        </div>
    </section>
</template>