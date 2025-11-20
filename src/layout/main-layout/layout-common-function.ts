//@ts-ignore
// import { useStore } from "vuex";
import { useLayoutStore } from '@/stores/layout'
function closeSidebar() {
//   const store = useStore();
const layoutStore = useLayoutStore()
//   store.dispatch("updateSidebarVisibleValue", false);
  layoutStore.updateSidebarVisibleValue(false);
}
export { closeSidebar };

