"use client";
import { useBoardStore } from "@/store/AppStore";
import type { GetStaticProps } from 'next';
import { useEffect } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
import Column from "./Column";

const MainSection = () => {
  const [getboards, updateTodo] = useBoardStore((state) => [
    state.getboard,
    state.updateTodo,
  ]);
  const board = useBoardStore((state) => state.board);
  console.log("ahmer", board);
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (type === "column") {
      const newColumnOrder = Array.from(board.columns.entries());
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);
      const newBoard = new Map(newColumnOrder);
      useBoardStore.setState({ board: { ...board, columns: newBoard } });
      return;
    }
    const columns = Array.from(board.columns);
    const startColumns = columns[Number(source.droppableId)];
    const finishColumns = columns[Number(destination.droppableId)];
    const startCol: Column = {
      id: startColumns[0],
      todos: startColumns[1].todos,
    };
    const finishCol: Column = {
      id: finishColumns[0],
      todos: finishColumns[1].todos,
    };
    if (source.index === destination.index && startCol === finishCol) return;
    const newTodos = startCol.todos;
    const [todoremoved] = newTodos.splice(source.index, 1);
    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoremoved);
      const newColumn = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(columns);
      newColumns.set(newColumn.id, newColumn);
      useBoardStore.setState({
        board: { ...board, columns: newColumns },
      });
    } else {
      const finishTodos = finishCol.todos;
      finishTodos.splice(destination.index, 0, todoremoved);
      const newStartColumn = {
        id: startCol.id,
        todos: newTodos,
      };
      const newFinishColumn = {
        id: finishCol.id,
        todos: finishTodos,
      };
      const newColumns = new Map(columns);
      newColumns.set(newStartColumn.id, newStartColumn);
      newColumns.set(newFinishColumn.id, newFinishColumn);
      updateTodo(todoremoved, finishCol.id);
      useBoardStore.setState({
        board: { ...board, columns: newColumns },
      });
    }
  };
  useEffect(() => {
    getboards();
  }, [getboards]);
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided, snapshot) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export const getStaticProps: GetStaticProps = async () => {
  resetServerContext(); // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  return { props: { data: [] } };
};
export default MainSection;
