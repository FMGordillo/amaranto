import { Transition } from "@headlessui/react";
import {
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type NotificationTypes = "success" | "warning" | "error";

type NotificationProps = {
  title?: string;
  message: string;
  type: NotificationTypes;
};

const Notification: FunctionComponent<NotificationProps> = ({
  title,
  message,
  type,
}) => {
  const notificationClasses: Record<NotificationTypes, string> = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <Transition
      appear
      show
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`rounded-md p-4 ${notificationClasses[type]} text-white`}>
        <div className="flex">
          <div className="py-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="mt-1 text-sm">{message}</div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

const NotificationContext = createContext((notification: NotificationBody) => {
  console.log("not implemented");
});

type NotificationBody = {
  id?: number;
  title?: string;
  message: string;
  type: NotificationTypes;
};

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationBody[]>([]);

  const addNotification = (notification: NotificationBody) => {
    const id = Date.now();
    setNotifications([...notifications, notification]);

    setTimeout(() => {
      setNotifications(notifications.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      <div className="fixed bottom-4 right-4">
        {notifications.map((notification) => (
          <Notification key={notification.id} {...notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationBody;
