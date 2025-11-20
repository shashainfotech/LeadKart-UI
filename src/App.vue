<script setup lang="ts">
import { onMounted } from 'vue';
// import { useStore } from 'vuex';
import { useLayoutStore } from '@/stores/layout'
import { RouterView } from 'vue-router'

// const store = useStore();
const layoutStore = useLayoutStore()
import AOS from 'aos';

onMounted(() => {
    AOS.init();
//     const layoutTheme = store.getters.layoutTheme;
    const layoutTheme = layoutStore.layoutTheme;
//     const layoutStyle = store.getters.layoutStyle;
    const layoutStyle = layoutStore.layoutStyle;
//     const contentWidth = store.getters.contentWidth;
    const contentWidth = layoutStore.contentWidth;
//     const sidebarSize = store.getters.sidebarSize;
    const sidebarSize = layoutStore.sidebarSize;
//     const layoutDir = store.getters.layoutDir;
    const layoutDir = layoutStore.layoutDir;
//     const sidebarColor = store.getters.sidebarColor;
    const sidebarColor = layoutStore.sidebarColor;
//     const primaryColor = store.getters.primaryColor;
    const primaryColor = layoutStore.primaryColor;
//     const darkModeColors = store.getters.darkModeColors;
    const darkModeColors = layoutStore.darkModeColors;
//     const navType = store.getters.navigationType;
    const navType = layoutStore.navigationType;

    const modeElement = document.querySelector('[data-mode]');
    const layoutElement = document.querySelector('[data-layout]');
    const contentWidthElement = document.querySelector('[data-content-width]');
    const sidebarSizeElement = document.querySelector('[data-sidebar]');
    const layoutDirElement = document.querySelector('[dir]');
    const sidebarColorElement = document.querySelector('[data-sidebar-colors]');
    const primaryColorElement = document.querySelector('[data-colors]');
    const navTypeElement = document.querySelector('[data-nav-type]');

    if (modeElement) {
        modeElement.setAttribute('data-mode', layoutTheme); // Apply the theme to the page
        if (layoutTheme == 'dark') {
            document.documentElement.classList.add(darkModeColors);
        }
    }
    if (layoutElement) {
        layoutElement.setAttribute('data-layout', layoutStyle); // Apply the theme to the page
    }
    if (contentWidthElement) {
        contentWidthElement.setAttribute('data-content-width', contentWidth)
    }
    if (sidebarSizeElement) {
        sidebarSizeElement.setAttribute('data-sidebar', sidebarSize)
    }
    if (layoutDirElement) {
        layoutDirElement.setAttribute('dir', layoutDir)
    }
    if (sidebarColorElement) {
        sidebarColorElement.setAttribute('data-sidebar-colors', sidebarColor)
    }
    if (primaryColorElement) {
        primaryColorElement.setAttribute('data-colors', primaryColor)
    }
    if (navTypeElement) {
        navTypeElement.setAttribute('data-nav-type', navType)
    }
});
// const layoutTheme = localStorage.getItem('layoutTheme')

</script>

<template>
    <RouterView />
</template>

