import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true, // 👈 ให้ Vite เปิดรับจากเครื่องอื่นในวง LAN
    port: 5173, // จะใช้ port ไหนก็ได้ แต่ขอให้รู้ไว้ใช้เปิดบนมือถือ
  },
});
