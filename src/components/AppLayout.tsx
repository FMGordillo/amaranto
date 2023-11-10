import type { FunctionComponent, PropsWithChildren } from "react";
import Button from "./Button";
import { useRouter } from "next/router";

type AppLayoutProps = PropsWithChildren;

const menuItems = [
  {
    label: "Home",
    path: "/app",
  },
  {
    label: "Patients",
    path: "/app/patients",
  },
  {
    label: "Clinical records",
    path: "/app/records",
  },
];

const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
    <div className="container m-4 mx-auto grid grid-cols-[auto_1px_1fr] gap-8 bg-white p-8">
      <nav>
        <ul className="flex flex-col gap-2">
          {menuItems.map((menuItem) => (
            <Button
              key={menuItem.path}
              variant="outline"
              onClick={() => void router.push(menuItem.path)}
            >
              {menuItem.label}
            </Button>
          ))}
        </ul>
      </nav>

      <div className="border" />

      <div className="container mx-auto h-full rounded-lg bg-white p-8 shadow">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
