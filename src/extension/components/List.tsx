import React, { FC, useCallback, useMemo, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { Active, DropAnimation } from '@dnd-kit/core';
import fileHelper from '../utility/fileHelper';
import ScriptItem from './ScriptItem';
import Stage from '../styled/Stage';
import { IScriptItem } from '../../types';
import { AddScriptItemBox } from '../styled/ScriptItemBox';

interface ListProps {
  scripts: Array<IScriptItem>;
  scrollTop: number;
  setListScrollTop: React.Dispatch<React.SetStateAction<number>>;
  onMoveSort: (startIndex: number, endIndex: number) => void;
  onEdit: (scriptIndex: number) => void;
  onEmitCode: (scriptIndex: number) => void;
  onToggleAutoExecute: (scriptIndex: number) => void;
  onImportScripts: (data: Array<IScriptItem>) => void;
  onAdd: () => void;
}

const dropAnimationConfig: DropAnimation = {
  duration: 180,
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

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
  background-color: ${props => props.theme.dropMask.bg};

  .drop-mask-line {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    border: 3px dashed ${props => props.theme.color.yallow};
    justify-content: center;
    align-items: center;
    border-radius: 20px;
  }
`;

/* List Component */

const List: FC<ListProps> = ({
  scripts,
  scrollTop,
  setListScrollTop,
  onMoveSort,
  onEdit,
  onEmitCode,
  onToggleAutoExecute,
  onImportScripts,
  onAdd,
}: ListProps) => {
  const stageEl = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (stageEl.current) {
      stageEl.current.scrollTop = scrollTop;
    }
    return () => {
      const { current } = stageEl;
      if (current) {
        setListScrollTop(current.scrollTop);
      }
    };
  }, [stageEl, scrollTop, setListScrollTop]);

  const handleDrop = useCallback(
    async (acceptedFiles: Array<File>) => {
      const data = await fileHelper<Array<IScriptItem>>(acceptedFiles);
      onImportScripts(data);
    },
    [onImportScripts],
  );

  const { getRootProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const startIndex = scripts.findIndex(scriptItem => scriptItem.id === active.id);
        const endIndex = scripts.findIndex(scriptItem => scriptItem.id === over.id);
        onMoveSort(startIndex, endIndex);
        setActive(null);
      }
    },
    [onMoveSort, scripts],
  );

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

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => scripts.find(item => item.id === active?.id), [active, scripts]);

  const renderItems = useMemo(
    () =>
      scripts.map((scriptItem, index) => (
        <ScriptItem
          key={scriptItem.id}
          id={scriptItem.id}
          title={scriptItem.title}
          code={scriptItem.code}
          autoExecute={scriptItem.autoExecute}
          scriptIndex={index}
          onEdit={onEdit}
          onEmitCode={onEmitCode}
          onToggleAutoExecute={onToggleAutoExecute}
        />
      )),
    [scripts, onEdit, onEmitCode, onToggleAutoExecute],
  );
  const renderItem = useCallback(
    (scriptItem: IScriptItem & { id: string }) => (
      <ScriptItem
        id={scriptItem.id}
        title={scriptItem.title}
        code={scriptItem.code}
        autoExecute={scriptItem.autoExecute}
        scriptIndex={scripts.findIndex(element => element.title === scriptItem.title)}
        overlay={true}
        onEdit={onEdit}
        onEmitCode={onEmitCode}
        onToggleAutoExecute={onToggleAutoExecute}
      />
    ),
    [scripts, onEdit, onEmitCode, onToggleAutoExecute],
  );

  const scriptsWithId = useMemo(() => scripts.map((scriptItem, index) => scriptItem.id), [scripts]);

  return (
    <Stage $list {...getRootProps()} ref={stageEl}>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActive(active)}
        onDragCancel={() => setActive(null)}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
        <SortableContext items={scriptsWithId} strategy={verticalListSortingStrategy}>
          {renderItems}
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem ? renderItem(activeItem) : null}
        </DragOverlay>
      </DndContext>
      <AddScriptItemBox key="add" onClick={onAdd}>
        <img alt="add" src="../imgs/add.svg" />
      </AddScriptItemBox>
      {renderDropMask}
    </Stage>
  );
};

export default List;
