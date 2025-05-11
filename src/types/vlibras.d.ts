export {};

declare global {
  interface Window {
    VLibras: {
      Player: new (config: { target: { name: string; path: string } }) => {
        on: (event: string, callback: (...args: any[]) => void) => void;
        load: (el: HTMLElement) => void;
        play: (text: string) => void;
        stop: () => void;
        pause: () => void;
      };
    };
  }
}
