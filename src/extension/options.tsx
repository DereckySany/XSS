import React from 'react';
import { createRoot } from 'react-dom/client';
import OptionsApp from './components/OptionsApp';
import './options.scss';
import { ISetting, IScriptItem, MenuItemId } from '../types';

let settingData: ISetting = {
  dark: import.meta.env.VITE_DARK_THEME === 'true',
};

function saveOptions(data: Partial<ISetting>) {
  settingData = {
    ...settingData,
    ...data,
  };
  if (!chrome.storage) return;
  void chrome.storage.local.set({
    setting: settingData,
  });
}

function importScripts(scripts: Array<IScriptItem>) {
  if (!chrome.storage) return;
  void chrome.storage.local.set({ scripts });
}

function exportScripts() {
  if (chrome.runtime) {
    chrome.runtime.sendMessage({ type: MenuItemId.EXPORT_SCRIPTS }, () => {
      if (chrome.runtime.lastError) {
        console.log('lastError:', chrome.runtime.lastError);
      }
    });
  }
}

function render(setting: ISetting) {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <OptionsApp
        setting={setting}
        onSave={saveOptions}
        onImportScripts={importScripts}
        onExportScripts={exportScripts}
      />,
    );
  }
}

if (chrome.storage) {
  chrome.storage.local.get(['setting'], (result: { setting?: ISetting }) => {
    const { setting } = result;
    if (setting && typeof setting.dark === 'boolean') {
      settingData.dark = setting.dark;
    }
    render(settingData);
  });
} else {
  render(settingData);
}
