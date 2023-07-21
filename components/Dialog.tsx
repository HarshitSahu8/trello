"use client";
import { useBoardStore } from "@/store/AppStore";
import { useModalStore } from "@/store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import { FormEvent, Fragment, useRef, useState } from "react";
import { MyRadioGroup } from "./RadioGroup";
import Image from "next/image";
import { BiPhotoAlbum } from "react-icons/bi";

export default function MyDialog() {
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);
  const imageRef = useRef<HTMLInputElement>(null);
  const [image, setImage, newTaskInput, setNewTaskInput, addTask, newtaskType] =
    useBoardStore((state) => [
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
      state.addTask,
      state.newtaskType,
    ]);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;
    addTask(newTaskInput, newtaskType, image);
    setImage(null);
    closeModal();
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="form"
          onSubmit={handleSubmit}
          className="fixed inset-0 flex items-center justify-center z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 bg-white shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add a Task
                </Dialog.Title>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 mt-2"
                  placeholder="Enter a title for this card..."
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  value={newTaskInput}
                />
                <MyRadioGroup />
                <div>
                  <button
                    type="button"
                    className="w-full border border-gray-400 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      imageRef.current?.click();
                    }}
                  >
                    <BiPhotoAlbum className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      alt="Image Uploaded"
                      height={200}
                      width={200}
                      className="w-full h-24 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed "
                      src={URL.createObjectURL(image)}
                      onClick={() => setImage(null)}
                    />
                  )}
                  <input
                    type="file"
                    id="uploaded"
                    ref={imageRef}
                    hidden
                    onChange={(e) => setImage(e.target.files![0])}
                  />
                </div>
                <button
                  disabled={!newTaskInput}
                  type="submit"
                  className="w-full border-2 mt-2 border-black/25 hover:bg-blue-400 hover:text-white rounded-md p-4"
                >
                  Add Task
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
