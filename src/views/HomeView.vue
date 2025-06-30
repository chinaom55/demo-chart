<script lang="ts" setup>
import DemoChart from "../components/DemoChart.vue";
</script>
<template>
  <div
    class="min-h-screen flex flex-col items-center bg-gray-50 text-center p-4 py-6 gap-4"
  >
    <div class="flex flex-col gap-2">
      <span class="text-4xl font-semibold text-[#074E9F]">
        Welcome to Demo Chart
      </span>

      <span class="text-sm text-gray-700">
        Explore interactive data visualizations built with Vue 3 and Tailwind
        CSS.
      </span>
    </div>

    <div class="flex flex-col gap-2 w-full"><DemoChart /></div>
  </div>
</template>
