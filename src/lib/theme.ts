// 라이트, 다크 모드 선택
export interface Theme {
  backgroundColor: string;
  cardBackground: string;
  buttonColor: string;
  textColor: string;
  borderColor: string;
  accent: string;
  error: string;
};

export const lightTheme = {
  backgroundColor: "#f5f7fa",
  cardBackground: "#ffffff",
  buttonColor: "#f3f4f6",
  textColor: "#111",
  borderColor: "#e5e7eb",
  accent: "#1d9bf0",
  error: "#e74c3c"
};

export const darkTheme = {
  backgroundColor: "#0f172a",
  cardBackground: "#1e293b",
  buttonColor: "#858585",
  textColor: "#f1f5f9",
  borderColor: "#334155",
  accent: "#3b82f6",
  error: "#ef4444"
};