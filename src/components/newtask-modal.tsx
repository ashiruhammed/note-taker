import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import * as Yup from "yup";
import Input from "./input";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase";

export default function NewTaskModal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const currentUser = auth.currentUser;

  const newDoc = collection(firestore, `users/${currentUser?.email}/todos`);
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      addDoc(newDoc, {
        title: values.title,
        description: values.description,
        time: serverTimestamp(),
        status: "active",
      });
    },
  });

  return (
    <>
      <div>
        <button
          onClick={openModal}
          type="button"
          className="shadow-lg md:w-full ml-auto py-1 gap-2 md:py-3 rounded-lg after:content-add-icon flex items-center justify-between px-4 after:block after:scale-50 md:after:scale-100 md:text-base text-xs">
          Add Task
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center -mt-8 justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      handleChange={handleChange}
                      value={values.title}
                      placeholder="Add Title"
                      id="title"
                      touched={touched}
                      errors={errors}
                      type="text"
                    />
                    <textarea
                      className="rounded-xl shadow-md w-full outline-none  p-4"
                      placeholder="Add a description"
                      id="descritption"
                      name="description"
                      onChange={handleChange}
                      value={values.description}
                      rows={4}
                      cols={50}></textarea>
                    <div className="mt-4 space-x-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-4 rounded-lg bg-primary-bg">
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-6 py-4 rounded-lg bg-white border border-primary-bg"
                        onClick={closeModal}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
