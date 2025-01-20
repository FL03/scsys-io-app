/*
  Appellation: task-kanban <module>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
// components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/ui/card';
import { Badge } from '@/ui/badge';
// feature-specific

type KanbarColumn = {
  id: string;
  title: string;
  records: string[];
};

interface KanbanData<KData = any> {
  registry: { [key: string]: KData };
  columns: { [key: string]: KanbarColumn };
  columnOrder: string[];
}

type KanbanProps<T = any> = {
  values?: T[] | null;
};

export const KanbanBoard: React.FC<KanbanProps> = ({ values = [] }) => {
  if (!values) {
    throw new Error('No data provided');
  }
  const [data, setData] = React.useState<KanbanData>(() => {
    const entries = values?.reduce(
      (acc, task) => ({ ...acc, [task.id]: task }),
      {}
    );
    const columns: { [key: string]: KanbarColumn } = {
      backlog: { id: 'backlog', title: 'Backlog', records: [] },
      inProgress: { id: 'inProgress', title: 'In Progress', records: [] },
      done: { id: 'done', title: 'Done', records: [] },
    };
    const columnOrder = ['backlog', 'inProgress', 'done'];

    values?.forEach((task) => {
      if (task.status === 'backlog' || task.status === 'todo')
        columns.backlog.records.push(task.id);
      else if (task.status === 'in-progress')
        columns.inProgress.records.push(task.id);
      else if (task.status === 'completed' || task.status === 'done')
        columns.done.records.push(task.id);
    });

    return { registry: entries, columns, columnOrder };
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.records);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.records);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.records);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);

    // Here you would typically update the task status in your database
    console.log(`Task ${draggableId} moved to ${destination.droppableId}`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full w-full flex flex-1 flex-row">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.records.map((taskId) => data.registry[taskId]);

          return (
            <div key={column.id} className="w-full flex flex-1 flex-col">
              <CardHeader>
                <CardTitle className="text-nowrap">{column.title}</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <Droppable
                  droppableId={column.id}
                  isDropDisabled={false}
                  isCombineEnabled={true}
                  ignoreContainerClipping={false}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="h-full flex flex-1 flex-col gap-2 lg:gap-4 bg-primary text-primary-foreground p-4 rounded"
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardHeader>
                                <CardTitle>{task.name}</CardTitle>
                                {task.description && (
                                  <CardDescription>
                                    {task.description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
