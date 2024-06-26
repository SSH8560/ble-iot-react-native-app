declare module 'react-native-config' {
  export interface NativeConfig {
    SUPABASE_URL: string;
    SUPABASE_ANON_API_KEY: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
