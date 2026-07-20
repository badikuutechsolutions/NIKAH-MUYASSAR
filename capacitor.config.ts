import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nikahmuyassar.app',
  appName: 'Nikah Muyassar',
  webDir: '.next',
  server: {
    url: 'https://nikah-muyassar.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0D7377',
      showSpinner: true,
      spinnerColor: '#F4A81D',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D7377',
    },
  },
};

export default config;
