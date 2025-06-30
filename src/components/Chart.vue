<template>
  <div class="flex h-[500px] w-full justify-center items-center flex-col gap-4">
    <Line :data="chartData" :options="chartOptions" ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import { computed, ref, watch } from "vue";
import crosshairPlugin from "chartjs-plugin-crosshair";

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(zoomPlugin);

const props = defineProps<{
  datas: number[];
  labels: string[];
}>();

const chartRef = ref(null); // เพิ่ม ref เพื่อเก็บอ้างอิงถึง chart instance

const y2BackgroundPlugin = {
  id: "y2BackgroundPlugin",
  beforeDraw(chart: { ctx: any; chartArea: any; scales: any }) {
    const { ctx, chartArea, scales } = chart;
    const y2 = scales.y2;
    if (!y2) return;

    const ranges = [
      { min: 6, max: 10.2, color: "#e53935" }, // 🔴 แดง
      { min: 3, max: 6, color: "#fbc02d" }, // 🟡 เหลือง
      { min: -0.2, max: 3, color: "#43a047" }, // 🟢 เขียว
    ];

    ranges.forEach(({ min, max, color }) => {
      const top = y2.getPixelForValue(max);
      const bottom = y2.getPixelForValue(min);

      ctx.save();
      ctx.fillStyle = color;
      // ✅ แสดงในพื้นที่ chart ด้านขวา
      ctx.fillRect(chartArea.right + 7, top, 15, bottom - top);
      ctx.restore();
    });
  },
};

const yTitleOnTopPlugin = {
  id: "yTitleOnTopPlugin",
  afterDraw(chart: { scales: { y1: any }; ctx: any }) {
    const yScale = chart.scales.y1;
    const ctx = chart.ctx;
    if (!yScale) return;

    ctx.save();
    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";

    // ✅ ปรับ Y ขึ้นไปอีก (จาก +10 → -6)
    const x = yScale.left + 5;
    const y = yScale.top - 6; // ✅ ดันขึ้นเหนือกริด

    ctx.fillText("PPM", x, y);
    ctx.restore();
  },
};

const backgroundRanges = ref([
  { min: 6, max: 10, color: "rgba(217, 45, 32, 0.2)" },
  { min: 3, max: 6, color: "rgba(248, 189, 38, 0.2)" },
  { min: 0, max: 3, color: "rgba(6, 149, 30, 0.2)" },
]);

const backgroundZonePlugin = {
  id: "backgroundZonePlugin",
  beforeDraw(chart: { ctx: any; chartArea: any; scales: any }) {
    const { ctx, chartArea, scales } = chart;
    const y = scales.y || scales.y2;
    if (!y) return;

    backgroundRanges.value.forEach(({ min, max, color }) => {
      const top = y.getPixelForValue(max);
      const bottom = y.getPixelForValue(min);
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(
        chartArea.left,
        top,
        chartArea.right - chartArea.left,
        bottom - top
      );
      ctx.restore();
    });
  },
};

const horizontalCrosshairPlugin = {
  id: "horizontalCrosshair",
  afterDatasetsDraw(chart: { ctx: any; chartArea: any; tooltip: any }) {
    const { ctx, chartArea, tooltip } = chart;
    // ใช้ตำแหน่ง mouse จาก tooltip (tooltip.active) ถ้ามี
    if (!tooltip || !tooltip.opacity || !tooltip.dataPoints?.length) {
      return;
    }

    // ดึง y ตำแหน่งแรกของ tooltip
    const y = tooltip.dataPoints[0].element.y;

    ctx.save();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]); // เส้นประ
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  y2BackgroundPlugin,
  backgroundZonePlugin,
  yTitleOnTopPlugin,
  crosshairPlugin,
  horizontalCrosshairPlugin
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "ระดับกลิ่น",
      data: props.datas,
      borderColor: "#2b88cb",
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: false,
      yAxisID: "y2", // ฝั่งขวา
    },
  ],
}));

const chartOptions = ref({
  responsive: true,
  y2BackgroundPlugin: true,

  maintainAspectRatio: false,
  plugins: {
    crosshair: {
      line: {
        color: "#333",
        width: 1,
      },
      sync: { enabled: false }, // ถ้ามีหลาย chart แล้วอยาก sync กัน
      zoom: { enabled: false }, // ไม่ซ้ำซ้อนกับ zoom plugin
      snap: { enabled: false }, // ถ้าจะ snap กับจุดข้อมูล
    },
    backgroundZonePlugin: true,

    legend: { position: "top" },
    title: { display: false, text: "กราฟแสดงภาพรวมกลิ่น" },
    tooltip: {
      enabled: true, // ปิด/เปิด tooltip ทั้งหมด
      mode: "index", // 'nearest' | 'index' | 'dataset' | 'point' | 'x' | 'y'
      intersect: false,
      position: "nearest", // 'average' | 'nearest' | custom function
      backgroundColor: "#344054",
      titleColor: "#fff",
      titleFont: { weight: "bold", size: 14 },
      titleAlign: "left",
      bodyColor: "#ccc",
      bodyFont: { size: 12 },
      bodyAlign: "left",
      footerColor: "#aaa",
      footerFont: { style: "italic" },
      footerAlign: "left",
      padding: 12,
      caretSize: 6,
      caretPadding: 2,
      cornerRadius: 4,
      displayColors: false, // ✅ ซ่อนกรอบสี
      boxWidth: 10,
      boxHeight: 10,

      callbacks: {
        title: (items: { label: any }[]) => `${items[0].label}`,
        label: (item: { formattedValue: any }) =>
          `เฉลี่ย: ${item.formattedValue}`,
        // footer: (items: string | any[]) => `จำนวนทั้งหมด: ${items.length} จุด`,
        labelColor: () => ({
          borderColor: "#ffffff",
          backgroundColor: "#2b88cb",
        }),
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.05,
        },

        mode: "x",
      },
      pan: {
        enabled: true, // ✅ เปิดการเลื่อน (pan) ด้วย mouse drag
        mode: "x", // ✅ เลื่อนเฉพาะแนวแกน X
        modifierKey: null, // ✅ ไม่ต้องกด Ctrl/Alt
        speed: 20,
        threshold: 5,
      },
      limits: {
        x: {
          min: "original",
          max: "original",
          minRange: 14,
        },
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        drawOnChartArea: false, // ให้แสดงในพื้นที่กราฟ
      },
      ticks: {
        maxRotation: 90,
        minRotation: 90,
        autoSkip: true,
        maxTicksLimit: 60, // แสดงไม่เกิน 20 tick บนแกน
      },
      title: {
        display: false,
        text: "วันที่",
      },
    },
    y1: {
      type: "linear",
      position: "left",
      title: {
        display: false,
        text: "PPM",
        align: "start", // ✅ ย้าย title ไปด้านบนของแกน
        color: "#333",
        font: {
          weight: "bold",
          size: 14,
        },
      },
      ticks: {
        color: "#666",
      },
    },
    y2: {
      type: "linear",
      position: "right",
      min: 0, // ✅ ค่าเริ่มต้น
      max: 10, // ✅ ค่าสูงสุด
      ticks: {
        color: "#ffffff", // ✅ สีของตัวเลข tick
        font: {
          size: 12,
        },
      },
      title: {
        display: true,
        text: "Odor",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
});

// watch([() => props.datas, () => props.labels], () => {
//   if (chartRef.value) {
//     // ตรวจสอบว่า chartRef มีค่าหรือไม่
//     const chartInstance = chartRef.value.chart;
//     if (chartInstance) {
//       chartInstance.resetZoom(); // รีเซ็ตการซูม
//     }
//   }
// });

// watch(
//   [() => props.datas, () => props.labels],
//   () => {
//     if (chartRef.value) {
//       const chartInstance = chartRef.value.chart;
//       if (chartInstance) {
//         chartInstance.resetZoom();

//         // ✅ รอให้ render frame เสร็จก่อน แล้วค่อย zoom
//         requestAnimationFrame(() => {
//           const totalPoints = props.labels.length;
//           const viewCount = 180;

//           const chartInstance = chartRef.value.chart;
//           const scale = chartInstance.scales.x;
//           if (!scale) return;

//           let minLabel, maxLabel;

//           if (totalPoints <= viewCount) {
//             // 🔹 แสดงทั้งหมด เพราะมีไม่ถึง 180 จุด
//             minLabel = props.labels[0];
//             maxLabel = props.labels[totalPoints - 1];
//           } else {
//             // 🔹 แสดง 180 จุดล่าสุด
//             const startIndex = totalPoints - viewCount;
//             const endIndex = totalPoints - 1;
//             minLabel = props.labels[startIndex];
//             maxLabel = props.labels[endIndex];
//           }

//           // ✅ ตั้งช่วงที่ต้องการแสดงในแกน x
//           scale.options.min = minLabel;
//           scale.options.max = maxLabel;

//           // ✅ อัปเดต chart
//           chartInstance.update();
//         });
//       }
//     }
//   },
//   { immediate: true }
// );

watch(
  [() => props.datas, () => props.labels],
  () => {
    if (chartRef.value) {
      const chartInstance = chartRef.value.chart;
      if (!chartInstance) return;

      chartInstance.resetZoom();

      requestAnimationFrame(() => {
        const totalPoints = props.labels.length;
        const viewCount = 180;

        const scale = chartInstance.scales.x;
        if (!scale) return;
        if (totalPoints === 0) return;

        // ❗ ล้าง min/max ทุกครั้งเพื่อเคลียร์ state เดิม
        delete scale.options.min;
        delete scale.options.max;

        // ✅ ถ้ามีข้อมูลพอ → ค่อยตั้ง min/max
        if (totalPoints > viewCount) {
          const startIndex = totalPoints - viewCount;
          const endIndex = totalPoints - 1;

          const minLabel = props.labels[startIndex];
          const maxLabel = props.labels[endIndex];

          if (!minLabel || !maxLabel) return;

          scale.options.min = minLabel;
          scale.options.max = maxLabel;
        }

        chartInstance.update();
      });
    }
  },
  { immediate: true }
);
</script>
