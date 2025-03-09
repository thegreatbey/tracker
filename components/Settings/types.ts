export interface SettingsProps {
  onClose: () => void;
  onResetData: () => Promise<void>;
}

export interface BaseSettingsState {
  isDarkMode: boolean;
}

export interface NativeSettingsState extends BaseSettingsState {
  isDailyReminderEnabled: boolean;
  reminderTime: string;
}

export interface WebSettingsState extends BaseSettingsState {
  // Web-specific state if needed
}

export type StorageKeys = 'darkMode' | 'reminderEnabled' | 'reminderTime'; 