import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-10 bg-fuchsia-700 p-2 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="flex flex-col select-none">
          <Link href="/">
            <span className="text-2xl font-bold">Amaranto</span>
          </Link>
          <span className="text-sm text-neutral-200">
            by ChiroTech
          </span>
        </h1>

        {!session ? (
          <div>
            <a
              className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 motion-safe:animate-pulse"
              // onClick={() => void signIn()}
              href="https://share-eu1.hsforms.com/1QL5wqKPmRj2mNUIpLrEItg2dasdu"
              target="_blank"
              rel="noreferrer noopener"
            >
              Registrate a la beta 📝
            </a>
          </div>
        ) : (
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {session ? `Hello, ${session.user.name}` : "Sign in"}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => void signOut()}
                        className={`${active ? "bg-pink-500 text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </nav>
  );
}
