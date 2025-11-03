<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { useModal, closeModal } from '@renderer/stores/modal'

const modal = useModal()

const handleDownload = () => {
    if (!modal.modalData?.imageUrl) return;

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = modal.modalData.imageUrl
    link.download = `air-quality-report-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const handleShare = async () => {
    if (!modal.modalData?.imageUrl) return;

    try {
        // Convert base64 to blob
        const response = await fetch(modal.modalData.imageUrl)
        const blob = await response.blob()

        // Share the image if Web Share API is supported
        if (navigator.share) {
            await navigator.share({
                title: 'Air Quality Report',
                text: modal.modalData.prompt || 'Air Quality Report',
                files: [new File([blob], 'air-quality-report.png', { type: 'image/png' })]
            })
        }
    } catch (error) {
        console.error('Error sharing:', error)
    }
}
</script>
<template>
    <BaseModal :show="modal.isOpen && modal.currentModal === 'imagePreview'" :onClose="closeModal">
        <div class="flex w-[80vw] max-w-5xl h-[80vh]">
            <!-- Left: Image -->
            <div class="flex-1 bg-neutral-800 flex items-center justify-center">
                <img :src="modal.modalData.imageUrl" class="object-contain max-h-full" />
            </div>

            <!-- Right: Info Panel -->
            <div class="w-80 bg-neutral-800 p-6 border-l border-neutral-700 flex flex-col">
                <div class="flex-1">
                    <h2 class="text-lg font-semibold mb-2">Air Quality Report</h2>
                    <p class="text-sm text-gray-300 mb-4">{{ modal.modalData.prompt }}</p>

                    <!-- Additional Info -->
                    <div class="mt-4 space-y-2">
                        <p class="text-sm text-gray-400">
                            This report shows the average air quality measurements for the selected date.
                        </p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button class="py-2 w-full bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                        @click="handleDownload">
                        Download Report
                    </button>
                    <button class="py-2 w-full bg-teal-600 rounded-md hover:bg-teal-500 transition-colors"
                        @click="handleShare">
                        Share Report
                    </button>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
