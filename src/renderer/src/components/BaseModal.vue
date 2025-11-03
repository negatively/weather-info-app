<script setup>
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue'

defineProps({
    show: Boolean,
    onClose: Function
})
</script>
<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" class="relative z-50" @close="onClose">
            <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel class="bg-zinc-700 text-white rounded-lg overflow-hidden shadow-xl">
                    <slot />
                </DialogPanel>
            </div>
        </Dialog>
    </TransitionRoot>
</template>