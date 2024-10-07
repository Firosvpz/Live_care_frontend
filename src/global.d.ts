// global.d.ts
export {};

declare global {
  interface Window {
    gapi: any; // or a more specific type if you want to define gapi properly
  }
}
