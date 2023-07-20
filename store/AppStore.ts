import { ID, database, storage } from "@/appwrite";
import { getTodosGroupedByColum } from "@/lib/getTodosGroupedByColum";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getboard: () => void;
  setBoardstate: (board: Board) => void;
  newTaskInput: string;
  setNewTaskInput: (newTaskInput: string) => void;
  newtaskType: TypeColumn;
  image: File | null;
  setNewTaskType: (coloumId: TypeColumn) => void;
  setImage: (image: File | null) => void;
  updateTodo: (todo: Todo, columnId: TypeColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  addTask: (todo: string, columnId: TypeColumn, image: File | null) => void;
  deleteTodo: (taskIndex: number, todoId: Todo, id: TypeColumn) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  image: null,
  getboard: async () => {
    const board = await getTodosGroupedByColum();
    set({ board });
  },
  setBoardstate: (board) => set({ board }),
  setImage: (image: File | null) => set({ image }),
  newTaskInput: "",
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
  newtaskType: "todo",
  setNewTaskType: (newtaskType) => set({ newtaskType }),

  deleteTodo: async (taskList: number, todo: Todo, id: TypeColumn) => {
    const newData = new Map(get().board.columns);
    newData.get(id)?.todos.splice(taskList, 1);
    set({ board: { columns: newData } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fieldId);
    }
    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id
    );
  },
  updateTodo: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  addTask: async (todo: string, coloumId: TypeColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fieldId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: coloumId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: coloumId,
        ...(file && { image: file }),
      };

      if (!coloumId) {
        newColumns.set(coloumId, {
          id: coloumId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(coloumId)?.todos.push(newTodo);
      }
      return {
        board: { columns: newColumns },
      };
    });
  },
}));
