<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { useModal, closeModal } from '@renderer/stores/modal'

const modal = useModal()

const handleDownload = () => {
    if (!modal.modalData?.imageUrl) return;

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = modal.modalData.imageUrl
    link.download = `kualitas-udara-report-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                    <h2 class="text-lg font-semibold mb-2">Informasi</h2>
                    <p class="text-sm text-gray-300 mb-4">{{ modal.modalData.prompt }}</p>

                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                    <button class="py-2 w-full bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                        @click="handleDownload">
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
