/*
  Appellation: kanban-provider <module>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';

type KanbanContext<T = any> = {
  board: KanbanData<T>;
  setBoard: React.Dispatch<React.SetStateAction<KanbanData<T>>>;
  values?: T[] | null;
};

type KanbanColumn = {
  id: string; // machine-id *** and in-between is....***
  title: string; // human-readable
  items: string[];
};

interface KanbanData<T = any> {
  columns: { [key: string]: KanbanColumn };
  columnOrder: string[];
  registry: { [key: string]: T };
}

type KanbanManagerProps<T = any> = {
  link?: string;
  values?: T[] | null;
};

const KanbanContext = React.createContext<KanbanContext | null>(null);

const handleKanbanState = (v: any[]) => {
  const records = v.reduce((acc, task) => ({ ...acc, [task.id]: task }), {});
  const columns: { [key: string]: KanbanColumn } = {
    backlog: { id: 'backlog', title: 'Backlog', items: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', items: [] },
    done: { id: 'done', title: 'Done', items: [] },
    unknown: { id: 'unknown', title: 'Unknown', items: [] },
  };
  const columnOrder = ['unknown', 'backlog', 'inProgress', 'done'];

  v.forEach((task) => {
    if (task.status === 'backlog' || task.status === 'todo')
      columns.backlog.items.push(task.id);
    else if (task.status === 'in-progress')
      columns.inProgress.items.push(task.id);
    else if (task.status === 'completed' || task.status === 'done')
      columns.done.items.push(task.id);
    else columns.unknown.items.push(task.id);
  });

  return { registry: records, columns, columnOrder };
};

export const useKanban = () => {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return ctx;
};

export const KanbanProvider: React.FC<
  React.PropsWithChildren<KanbanManagerProps>
> = ({ children, values = [] }) => {
  if (!values) {
    throw new Error('KanbanProvider requires values prop');
  }

  const [board, setBoard] = React.useState<KanbanData>(() => {
    return handleKanbanState(values);
  });

  const ctx = React.useMemo(
    () => ({ board, setBoard, values }),
    [board, setBoard, values]
  );
  return (
    <KanbanContext.Provider value={ctx}>{children}</KanbanContext.Provider>
  );
};
