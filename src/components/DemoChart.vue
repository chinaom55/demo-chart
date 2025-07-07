<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "./Chart.vue";
import { getMinute } from "../services/sensor.service";

const options = ref(["นาที", "ชั่วโมง", "วัน", "เดือน", "ปี"]);

const selected = ref<string>("นาที");

const desc = ref("3 วัน");

const today = new Date();

const labels = ref<string[]>([]);

const datas = ref<number[]>([]);

onMounted(() => {
  getSensorMinute();
});

const getSensorMinute = async () => {
  labels.value = [];
  datas.value = [];
  try {
    const result = await getMinute();

    // const key = Object.keys(result)[0];
    // const data = result[key as keyof typeof result];

    datas.value = result.datas;

    labels.value = result.labels;
  } catch (error) {
    console.error("❌ Error in getSensorMinute:", error);
  }
};

const getSensorHour = async () => {
  labels.value = [];
  datas.value = [];
  try {
    // const result = await getHour();

    // const key = Object.keys(result)[0];
    // const data = result[key as keyof typeof result];

    // datas.value = data.map((data: any) => data.avg);

    // labels.value = data.map((data: any) => formatDateTime(data.createdAt));

    for (let i = 4319; i >= 0; i--) {
      const d = new Date(today);
      d.setHours(today.getHours() - i); // เปลี่ยนจาก setDate → setMinutes

      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = String(d.getFullYear() + 543); // ปี พ.ศ.
      const hh = String(d.getHours()).padStart(2, "0");

      labels.value.push(`${dd}/${mm}/${yyyy}-${hh}:00`);
    }

    datas.value = labels.value.map(() =>
      parseFloat((Math.random() * 9).toFixed(2))
    );
  } catch (error) {
    console.error("❌ Error in getSensorMinute:", error);
  }
};

const selectedOption = (option: any) => {
  labels.value = [];
  datas.value = [];
  selected.value = option;

  if (selected.value === "นาที") {
    desc.value = "3 วัน";

    getSensorMinute();
  } else if (selected.value === "ชั่วโมง") {
    desc.value = "180 วัน";

    getSensorHour();
  } else if (selected.value === "วัน") {
    desc.value = "180 วัน";

    for (let i = 179; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");

      const yyyy = String(d.getFullYear() + 543).padStart(2, "0");

      labels.value.push(`${dd}/${mm}/${yyyy}`);
    }

    datas.value = labels.value.map(() =>
      parseFloat((Math.random() * 9).toFixed(2))
    );
  } else if (selected.value === "เดือน") {
    desc.value = "12 เดือน";

    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);

      const mm = String(d.getMonth() + 1).padStart(2, "0");

      const yyyy = String(d.getFullYear() + 543).padStart(2, "0");

      labels.value.push(`${mm}/${yyyy}`);
    }

    datas.value = labels.value.map(() =>
      parseFloat((Math.random() * 9).toFixed(2))
    );
  } else if (selected.value === "ปี") {
    desc.value = "5 ปี";

    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setFullYear(today.getFullYear() - i);

      const yyyy = String(d.getFullYear() + 543).padStart(2, "0");

      labels.value.push(`${yyyy}`);
    }

    datas.value = labels.value.map(() =>
      parseFloat((Math.random() * 9).toFixed(2))
    );
  }
};
</script>
<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      class="flex justify-between bg-[#E4E7EC] px-1 py-0.5 rounded-lg w-full items-center"
    >
      <button
        v-for="option in options"
        :key="option"
        class="flex-1 text-center py-1 rounded-md transition-colors duration-200"
        :class="{
          'bg-[#074E9F] text-white font-semibold': selected === option,
          'text-gray-700 hover:bg-gray-200': selected !== option,
        }"
        @click="selectedOption(option)"
      >
        {{ option }}
      </button>
    </div>

    <span class="flex text-[#98A2B3]">ย้อนหลัง {{ desc }} ล่าสุด</span>

    <div class="">
      <Chart :datas="datas" :labels="labels" />
    </div>
  </div>
</template>
