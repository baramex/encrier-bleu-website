import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment } from "react";

export default function Modal({ open, className, onClose, children }) {
    return (
        <Transition.Root show={open} as={Fragment} onClose={onClose}>
            <Dialog as="div" className="relative z-10">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto md:py-14">
                    <div className="flex min-h-full items-end justify-center md:px-5 md:py-4 text-center md:items-center md:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <Dialog.Panel className={clsx("modal relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all md:max-w-6xl", className)}>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}