import type { FunctionComponent, PropsWithChildren } from "react";
import Button from "./Button";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type AppLayoutProps = PropsWithChildren;

const menuItems = [
  {
    label: "Inicio",
    path: "/app",
  },
  {
    label: "Pacientes",
    path: "/app/patients",
  },
  {
    label: "Visitas",
    path: "/app/records",
  },
];

const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  useSession({
    required: true,
  });
  const router = useRouter();
  const isRootAppRoute = router.pathname.split("/").length === 2;

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
        {!isRootAppRoute && <Button className="mb-8" onClick={() => void router.back()} variant="outline">{"<-"} Volver</Button>}
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
