import Constants from "expo-constants";

const expoExtra = Constants?.expoConfig?.extra as { apiUrl?: string } | undefined;

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || expoExtra?.apiUrl || "http://192.168.0.100:8000/api";

export const CAMERA_CAPTURE_INTERVAL_MS = 2500;
