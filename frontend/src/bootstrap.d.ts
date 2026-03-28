declare module 'bootstrap' {
  export class Toast {
    static getOrCreateInstance(element: Element): Toast;
    show(): void;
  }
}
