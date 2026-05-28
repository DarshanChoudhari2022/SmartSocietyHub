import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.society.management',
  appName: 'SmartSocietyHub',
  webDir: 'public',
  
  server: {
    url: 'https://society-connect-one.vercel.app',
    cleartext: false,
  },

  android: {
    allowMixedContent: false,
    backgroundColor: '#0f172a',
    captureInput: true,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#0f172a',
      showSpinner: false,
      spinnerColor: '#6366f1',
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a',
      overlaysWebView: false,
    },
  },
};

export default config;
