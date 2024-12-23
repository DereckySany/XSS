import React, { FC, useCallback, useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import styled from 'styled-components';
import { js } from 'js-beautify';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ViewUpdate } from '@codemirror/view';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { IScriptItem } from '../../types';
import Stage from '../styled/Stage';
import Input from '../styled/Input';
import Button, { IconButton } from '../styled/Button';
import { Color } from '../styled/theme';

interface EditorProps {
  scriptData?: IScriptItem;
  dark?: boolean;
  onSave: (value: IScriptItem) => void;
  onDel: () => void;
  onCancel: () => void;
}

const defaultOptions = {
  lineNumbers: false,
  mode: 'javascript',
  theme: 'neo', // 'mbo'
};

/* Styled Components */

const InputTitle = styled(Input)`
  width: calc(100% - 246px);
  height: 26px;
  margin-bottom: 8px;
  display: inline-block;
  color: ${props => props.theme.color.yallow};
  border: 1px dashed ${props => props.theme.color.hoverLine};
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: 14px;

  &::placeholder {
    font-weight: ${props => props.theme.fontWeight.normal};
    color: rgba(80, 80, 80, 0.35);
  }
`;

const ButtonArea = styled.div`
  right: 10px;
  position: absolute;
  display: inline-flex;
`;

const TextareaScript = styled.div<{ $dark?: boolean }>`
  width: 100%;
  height: calc(100% - 36px);

  > div {
    height: 100%;
  }

  .cm-theme {
    font-size: 12px;
  }
  .ͼ1.cm-focused {
    outline: none;
  }

  box-shadow: ${props => props.theme.boxShadow};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px dashed ${props => props.theme.color.hoverLine};
  overflow: hidden;

  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-clip: content-box;
    border: 3px solid transparent;
    border-radius: 10px;
    background-color: ${props => (props.$dark ? '#3e3e3e' : '#ddd')};
  }
  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

/* Editor Component */

const Editor: FC<EditorProps> = ({
  scriptData = undefined,
  dark = false,
  onSave,
  onDel,
  onCancel,
}: EditorProps) => {
  const [title, setTitle] = useState(scriptData ? scriptData.title || '' : '');
  const [code, setCode] = useState(scriptData ? scriptData.code || '' : '');
  const [fullscreen, setFullscreen] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    // theme: dark ? 'mbo' : 'neo',
  });

  const handleSave = useCallback(() => {
    const data: IScriptItem = {
      id: scriptData?.id || uuidv1(),
      title: title ? title.trim() : '',
      code: code ? code.trim() : '',
      autoExecute: scriptData?.autoExecute || false,
    };
    if (onSave) onSave(data);
  }, [scriptData, title, code, onSave]);

  const handleDel = useCallback(() => {
    setTitle('');
    setCode('');
    if (onDel) onDel();
  }, [onDel]);

  const handleFormat = useCallback(() => {
    setCode(js(code, { indent_size: 2 }));
  }, [code]);

  const handleToggleFullscreen = useCallback(() => {
    setFullscreen(!fullscreen);
    setOptions({ ...options, lineNumbers: !fullscreen });
  }, [fullscreen, options]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value || '');
  }, []);

  const handleCodeChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setCode(value);
  }, []);

  useEffect(() => {
    // Maximum width and height limits for Chrome extensions
    const [availWidth, availHeight] = [800, 600];
    if (fullscreen) {
      document.body.style.width = `${availWidth}px`;
      document.body.style.height = `${availHeight}px`;
      if (document.fullscreenElement === null) {
        void document.documentElement.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement !== null) {
        void document.exitFullscreen();
      }
      document.body.removeAttribute('style');
    }

    return () => {
      if (document.fullscreenElement !== null) {
        void document.exitFullscreen();
      }
      document.body.removeAttribute('style');
    };
  }, [fullscreen]);

  return (
    <Stage $editor>
      <InputTitle
        type="text"
        maxLength={100}
        placeholder="Script Title"
        value={title}
        onChange={handleTitleChange}
      />
      <ButtonArea>
        <IconButton type="button" $hoverColor={Color.LIGHT_RED} title="delete" onClick={handleDel}>
          <svg width="24px" height="24px">
            <use xlinkHref="../imgs/icons.svg#del" />
          </svg>
        </IconButton>
        <IconButton type="button" title="format" onClick={handleFormat}>
          <svg width="24px" height="24px">
            <use xlinkHref="../imgs/icons.svg#format" />
          </svg>
        </IconButton>
        <IconButton
          scale={0.9}
          type="button"
          title={fullscreen ? 'exit fullscreen' : 'fullscreen'}
          onClick={handleToggleFullscreen}>
          <svg width="24px" height="24px">
            <use
              xlinkHref={`../imgs/icons.svg#${fullscreen ? 'close_fullscreen' : 'fullscreen'}`}
            />
          </svg>
        </IconButton>
        <Button type="button" $red onClick={handleSave}>
          Save
        </Button>
        <Button type="button" $gray onClick={onCancel}>
          Cancel
        </Button>
      </ButtonArea>
      <TextareaScript $dark={dark}>
        <CodeMirror
          width="100%"
          height="100%"
          value={code}
          extensions={[javascript({ jsx: false, typescript: false })]}
          onChange={handleCodeChange}
          theme={dark ? vscodeDark : vscodeLight}
        />
      </TextareaScript>
    </Stage>
  );
};

export default Editor;
