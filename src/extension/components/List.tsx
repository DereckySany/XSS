/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Base64 } from 'js-base64';
import { useDropzone } from 'react-dropzone';
import {
  DragDropContext, Droppable, Draggable, DropResult,
} from 'react-beautiful-dnd';
import ScriptItem from './ScriptItem';
import Stage from '../styled/Stage';
import { IScriptItem } from '../../types';
import { AddScriptItemBox } from '../styled/ScriptItemBox';

interface ListProps {
  scripts: Array<IScriptItem>;
  onMoveSort: (startIndex: number, endIndex: number) => void;
  onEdit: (scriptIndex: number) => void;
  onEmitCode: (scriptIndex: number) => void;
  onImportScripts: (data: Array<IScriptItem>) => void;
  onAdd: () => void;
}

/* Styled Components */

const DropMask = styled.div`
  pointer-events: none;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.85);

  .drop-mask-line {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    border: 3px dashed ${(props) => props.theme.color.yallow};
    justify-content: center;
    align-items: center;
    border-radius: 20px;
  }
`;

const DroppableArea = styled.div`
  & > div {
    display: flex;
  }
`;

/* List Component */

const List: FC<ListProps> = ({
  scripts,
  onMoveSort,
  onEdit,
  onEmitCode,
  onImportScripts,
  onAdd,
}: ListProps) => {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = acceptedFiles[0];
    if (file && /.json$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result !== 'string') return;
        const importData = Base64.decode(reader.result.replace('data:application/json;base64,', ''));
        onImportScripts(JSON.parse(importData));
      };
      reader.readAsDataURL(file);
    }
  }, [onImportScripts]);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const onDragEnd = useCallback((result: DropResult) => {
    if (result.destination) {
      const startIndex = result.source.index;
      const endIndex = result.destination.index;
      onMoveSort(startIndex, endIndex);
    }
  }, [onMoveSort]);

  const renderDropMask = useMemo(() => {
    if (!isDragActive) return <></>;

    return (
      <DropMask>
        <div className="drop-mask-line">
          <img width="80" height="80" alt="" src="../imgs/drop.svg" />
        </div>
      </DropMask>
    );
  }, [isDragActive]);

  const renderItems = useMemo(() => scripts.map((scriptItem, index) => (
    <Draggable
      key={`${scriptItem.title}_${index}`}
      draggableId={`script_${index}`}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ScriptItem
            key={index}
            title={scriptItem.title}
            code={scriptItem.code}
            scriptIndex={index}
            onEdit={onEdit}
            onEmitCode={onEmitCode}
          />
        </div>
      )}
    </Draggable>
  )), [scripts, onEdit, onEmitCode]);

  return (
    <Stage
      $list
      {...getRootProps()}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {
            (provided) => (
              <DroppableArea
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                { renderItems }
                { provided.placeholder }
              </DroppableArea>
            )
          }
        </Droppable>
      </DragDropContext>
      <AddScriptItemBox key="add" onClick={onAdd}>
        <img alt="" src="../imgs/add.svg" />
      </AddScriptItemBox>
      { renderDropMask }
    </Stage>
  );
};

export default List;
