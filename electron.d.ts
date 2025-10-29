export interface IElectronAPI {
  saveFile: (data: string) => Promise<void>;
  restoreFromFile: () => Promise<string | null>;
  getApiKey: () => Promise<string | undefined>;
  launchDiscord: (url: string) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}