import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/foothills-presentation/",
  plugins: [react()],
});
