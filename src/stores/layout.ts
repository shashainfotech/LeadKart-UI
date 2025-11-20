// ---------------- BEFORE (problematic) ----------------
// export const useLayoutStore = defineStore('layout', {
//   state: (): LayoutState => ({
//     layoutStyle: get('layout', 'vertical'),
//     layoutTheme: get('layoutTheme', 'light'),
//     sidebarColor: get('sidebarColor', 'light'),
//     layoutDir: get('layoutDir', 'ltr'),
//     contentWidth: get('contentWidth', 'fluid'),
//     sidebarSize: get('sidebar', 'default'),
//     primaryColor: get('colors', '#4f46e5'),
//     language: get('language', 'en'),
//     darkModeColors: get('darkModeColors', 'default'),
//     navigationType: get('navType', 'menu'),
//     isSidebarShow: false
//   }),
//   getters: {
//     layoutStyle: (s) => s.layoutStyle,
//     layoutTheme: (s) => s.layoutTheme,
//     sidebarColor: (s) => s.sidebarColor,
//     layoutDir: (s) => s.layoutDir,
//     contentWidth: (s) => s.contentWidth,
//     sidebarSize: (s) => s.sidebarSize,
//     primaryColor: (s) => s.primaryColor,
//     language: (s) => s.language,
//     darkModeColors: (s) => s.darkModeColors,
//     navigationType: (s) => s.navigationType,
//     isSidebarShow: (s) => s.isSidebarShow
//   },
//   actions: { /* ... same as before ... */ }
// })

// ---------------- AFTER (safe) ----------------
export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    layoutStyle: get('layout', 'vertical'),
    layoutTheme: get('layoutTheme', 'light'),
    sidebarColor: get('sidebarColor', 'light'),
    layoutDir: get('layoutDir', 'ltr'),
    contentWidth: get('contentWidth', 'fluid'),
    sidebarSize: get('sidebar', 'default'),
    primaryColor: get('colors', '#4f46e5'),
    language: get('language', 'en'),
    darkModeColors: get('darkModeColors', 'default'),
    navigationType: get('navType', 'menu'),
    isSidebarShow: false
  }),
  // ❌ no getters that duplicate state names
  actions: {
    updateLayoutStyle(v: string) { this.layoutStyle = v; localStorage.setItem('layout', v) },
    updateLayoutTheme(v: string) { this.layoutTheme = v; localStorage.setItem('layoutTheme', v) },
    updateSidebarColor(v: string) { this.sidebarColor = v; localStorage.setItem('sidebarColor', v) },
    updateLayoutDir(v: string) { this.layoutDir = v; localStorage.setItem('layoutDir', v) },
    updateContentWidth(v: string) { this.contentWidth = v; localStorage.setItem('contentWidth', v) },
    updateSidebarSize(v: string) { this.sidebarSize = v; localStorage.setItem('sidebar', v) },
    updatePrimaryColor(v: string) { this.primaryColor = v; localStorage.setItem('colors', v) },
    updateLanguage(v: string) { this.language = v; localStorage.setItem('language', v) },
    updateDarkModeColors(v: string) { this.darkModeColors = v; localStorage.setItem('darkModeColors', v) },
    updateNavType(v: string) { this.navigationType = v; localStorage.setItem('navType', v) },
    updateSidebarVisibleValue(v: boolean) { this.isSidebarShow = v }
  }
})
