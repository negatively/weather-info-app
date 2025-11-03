<script setup lang="ts">
import BaseModal from './BaseModal.vue'

const props = defineProps({
    show: { type: Boolean, required: true },
    title: { type: String, default: 'Alert' },
    message: { type: [String, Object, Array], default: '' }
})

const emit = defineEmits(['update:show'])

function close() {
    emit('update:show', false)
}
</script>

<template>
    <BaseModal :show="props.show" :onClose="close">
        <div class="max-w-md p-6">
            <h3 class="text-lg font-semibold mb-2 text-center">{{ props.title }}</h3>
            <div class="my-5 mx-2 text-sm">
                <p v-if="typeof props.message === 'string'">{{ props.message }}</p>
                <pre v-else class="whitespace-pre-wrap">{{ props.message }}</pre>
            </div>
            <div class="flex w">
                <button @click="close" class="px-4 py-2 w-full bg-sky-600 hover:bg-sky-700 rounded">OK</button>
            </div>
        </div>
    </BaseModal>
</template>
