<script lang="ts" setup>
import { ref, onMounted, toRaw } from 'vue'
import { DatabaseConfig, ScheduleConfig } from '@renderer/types/preload';

const formData = ref<DatabaseConfig>({
    host: '127.0.0.1',
    database: 'database',
    user: 'user',
    password: 'password'
})

const formDataSch = ref<ScheduleConfig>({
    air_time: '',
})

const loadSettings = async () => {
    const data = await window.api.getDbSettings();
    formData.value = data;

    const dataSch = await window.api.getSchSettings();
    formDataSch.value = dataSch

}


const saveSettings = async () => {
    try {
        await window.api.setDbSettings(toRaw(formData.value))
        console.log('Settings saved successfully!')
        alert('✅ Setting sudah tersimpan');
    } catch (error) {
        console.error('Failed to save settings:', error)
    }
}

const saveSchSettings = async () => {
    try {
        await window.api.setSchSettings(toRaw(formDataSch.value))
        console.log('Settings schedule saved successfully!')
        alert('✅ Setting sudah tersimpan');
    } catch (error) {
        console.error('Failed to save schedule settings')
    }
}


const testConnection = async () => {
    const result = await window.api.testDbConnection()
    alert(result.success ? '✅ ' + result.message : '❌ ' + result.message)
}

onMounted(() => {
    loadSettings()
})

const showPicker = (event) => {
    if (event.target.showPicker) event.target.showPicker()
}
</script>

<template>
    <div class="database-settings">
        <h2 class="text-base font-semibold mb-4">Pengaturan Database</h2>
        <form @submit.prevent="saveSettings" class="space-y-4 bg-zinc-800 p-4 rounded-lg">
            <div class="form-group">
                <label for="host" class="block text-xs mb-1">Host</label>
                <input type="text" id="host" v-model="formData.host"
                    class="w-full px-3 py-2 border border-zinc-600 rounded-md text-sm" />
            </div>

            <div class="form-group">
                <label for="database" class="block text-xs mb-1">Database</label>
                <input type="text" id="database" v-model="formData.database"
                    class="w-full px-3 py-2 border border-zinc-600 rounded-md text-sm" />
            </div>

            <div class="form-group">
                <label for="user" class="block text-xs mb-1">User</label>
                <input type="text" id="user" v-model="formData.user"
                    class="w-full px-3 py-2 border border-zinc-600 rounded-md text-sm" />
            </div>

            <div class="form-group">
                <label for="password" class="block text-xs mb-1">Password</label>
                <input type="password" id="password" v-model="formData.password"
                    class="w-full px-3 py-2 border border-zinc-600 rounded-md text-sm" />
            </div>

            <div class="flex justify-end space-x-2">
                <button type="button" @click="testConnection"
                    class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                    Test Connection
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Save Settings
                </button>
            </div>
        </form>
    </div>
    <div class="mt-4">
        <h2 class="text-base font-semibold mb-4">Pengaturan Jadwal</h2>
        <form @submit.prevent="saveSchSettings" class="space-y-4 bg-zinc-800 p-4 rounded-lg">
            <div class="form-group">
                <label for="host" class="block text-xs mb-1">Jadwal Generate Informasi Kualitas Udara </label>
                <input type="time" id="host" v-model="formDataSch.air_time"
                    class="w-full px-3 py-2 border border-zinc-600 rounded-md text-sm" @focus="showPicker" />
            </div>

            <div class="flex justify-end space-x-2">
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Save Settings
                </button>
            </div>
        </form>
    </div>
</template>
