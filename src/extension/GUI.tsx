import { v1 as uuidv1 } from 'uuid';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './GUI.scss';
import { IScriptItem, ISetting, UiEvent } from '../types';

let settingData: ISetting = {
  dark: import.meta.env.VITE_DARK_THEME === 'true',
};

const saveStorage = (scripts: Array<IScriptItem>) => {
  if (!chrome.storage) return;
  void chrome.storage.local.set({ scripts });
};

const emitCode = (script: IScriptItem) => {
  if (!chrome.tabs) return;
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const { id } = tabs[0];
    if (id === undefined) return;
    chrome.tabs.sendMessage(id, { type: UiEvent.EMIT_CODE, code: script.code }, response => {
      if (chrome.runtime.lastError) {
        console.log('lastError:', chrome.runtime.lastError);
      }
    });
  });
};

function render(result: {
  scripts?: Array<IScriptItem | Omit<IScriptItem, 'id'>>;
  setting?: ISetting;
}) {
  const { scripts = [] } = result;
  const scriptsWithId = scripts.map(script => ({
    ...script,
    id: 'id' in script ? script.id : uuidv1(),
  }));
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <App
        scripts={scriptsWithId}
        dark={settingData.dark}
        onSave={saveStorage}
        onEmitCode={emitCode}
      />,
    );
  }
}

if (chrome.storage) {
  chrome.storage.local.get(
    ['scripts', 'setting'],
    (result: { scripts?: Array<IScriptItem | Omit<IScriptItem, 'id'>>; setting?: ISetting }) => {
      const { setting } = result;
      if (setting) {
        settingData = { ...settingData, ...setting };
      }
      if (settingData && settingData.dark) {
        document.documentElement.classList.add('dark');
      }

      const ready = () => {
        document.removeEventListener('DOMContentLoaded', ready, false);
        render(result);
      };

      if (document.getElementById('root')) {
        render(result);
      } else {
        document.addEventListener('DOMContentLoaded', ready, false);
      }
    },
  );
} else {
  render({ scripts: [], setting: settingData });
}
