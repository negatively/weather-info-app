<script setup lang="ts">
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter()

onMounted(() => {
  window.api.onCronTrigger(() => {
    console.log("Cron triggered, navigating to Air Quality");

    router.push({ name: 'air-quality' })

    setTimeout(() => {
      const btn = document.querySelector("#btn-generate");
      if (btn instanceof HTMLButtonElement) btn.click();
    }, 800);
  });
});
</script>

<template>
  <RouterView />
</template>