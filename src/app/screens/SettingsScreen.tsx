import { Palette, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Theme } from '../types';

export function SettingsScreen() {
  const { settings, updateSettings, user } = useStore();

  const themes: { code: Theme; name: string }[] = [
    { code: 'light', name: 'Light' },
    { code: 'dark', name: 'Dark' },
    { code: 'system', name: 'System' },
  ];

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
        <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
          Customize your app preferences
        </p>
      </div>

      {/* User Profile */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{user?.phone}</p>
          </div>
        </div>
      </div>

      {/* Theme Setting */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Theme</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.code}
              onClick={() => updateSettings({ theme: theme.code })}
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.theme === theme.code
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="font-medium text-slate-900 dark:text-white">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Setting */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive payment reminders
              </p>
            </div>
          </div>
          <button
            onClick={() => updateSettings({ notifications: !settings.notifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
