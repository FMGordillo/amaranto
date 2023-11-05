import { Disclosure, Transition } from "@headlessui/react";
import type { FunctionComponent, ReactNode } from "react";

type FAQProps = {
  data: {
    title: string;
    content: ReactNode;
  }[];
};

const FAQ: FunctionComponent<FAQProps> = ({ data }) => {
  return (
    <div className="w-full max-w-lg">
      {data.map(({ title, content }) => (
        <Disclosure key={title} as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 p-4 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span className="font-bold">{title}</span>
                <img
                  src="/chevron.svg"
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-700">
                  {content}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};

export default FAQ;
