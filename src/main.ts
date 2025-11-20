import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "aos/dist/aos.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import SimpleBar from "simplebar-vue";
import VueApexCharts from "vue3-apexcharts";
import VueCompareImage from "vue3-compare-image";
import "swiper/css";
import FullCalendar from "@fullcalendar/vue3";
import "@/assets/css/plugins.css"
import "@/assets/css/icons.css"
import "@/assets/css/tailwind.css"
import { vMaska } from 'maska/vue'
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(VueCompareImage);
app.use(VueApexCharts);
app.directive('maska', vMaska)

app.component("SimpleBar", SimpleBar);
app.component("Multiselect", Multiselect);
app.component("ApexCharts", VueApexCharts);
app.component("FullCalendar", FullCalendar);

app.mount("#app");
