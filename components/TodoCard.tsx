"use client";
import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

import {
  Draggable,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
import { useBoardStore } from "@/store/AppStore";
import getUrl from "@/lib/getUrl";
import Image from "next/image";

type Props = {
  todo: Todo;
  index: number;
  id: TypeColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) => {
  const deleteTodo = useBoardStore((state) => state.deleteTodo);
  const [imageUrl, setImageUrl] = useState<string | null>();
  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, []);
  return (
    <div
      className="bg-white p-2 rounded-md shadow-sm my-2 flex flex-col justify-between items-center"
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
    >
      <div className="flex justify-between items-center w-full">
        <h1>{todo.title}</h1>
        <button
          className="flex items-center justify-center text-red-500 rounded-md p-1"
          onClick={() => deleteTodo(index, todo, id)}
        >
          <RxCrossCircled size={30} />
        </button>
      </div>
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="imgg"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
