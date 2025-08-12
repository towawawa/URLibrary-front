declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export {};

declare module 'vue-select' {
  const component: any;
  export default component;
}
