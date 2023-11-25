import type { FunctionComponent } from "react";

type ErrorPageParam = "Configuration" | "AccessDenied" | "Verification";

export interface ErrorProps {
  url?: URL;
  error?: ErrorPageParam;
}

export type ErrorView = {
  heading: string;
  message: JSX.Element;
  signin?: JSX.Element;
}

export const SignInBtn: FunctionComponent<{ url: string }> = ({ url }) => (
  <a className="button" href={url}>
    Iniciá sesión
  </a>
);

export default function ErrorPage(props: ErrorProps) {
  const { url, error = "default" } = props;
  const signinPageUrl = url?.hostname ? `${url.hostname}/signin` : "/";

  const errors: Record<ErrorPageParam | "default", ErrorView> = {
    default: {
      heading: "Error",
      message: (
        <p>
          <a className="site" href={url?.origin}>
            {url?.host}
          </a>
        </p>
      ),
    },
    Configuration: {
      heading: "Error del servidor",
      message: (
        <div>
          <p>Contacte con nosotros para resolver esto al instante</p>
          <a href="mailto:facundo@chirotech.dev?subject='Amaranto AuthError'">
            Reporta el bug
          </a>
        </div>
      ),
    },
    AccessDenied: {
      heading: "Acceso denegado",
      message: (
        <div>
          <p>No tienes permiso para iniciar sesión</p>
          <p>
            <SignInBtn url={signinPageUrl} />
          </p>
        </div>
      ),
    },
    Verification: {
      heading: "No pudimos iniciar sesión",
      message: (
        <div>
          <p>El link que usaste no es válido.</p>
          <p>Probablemente ya lo hayas usado o ha expirado.</p>
        </div>
      ),
      signin: <SignInBtn url={signinPageUrl} />,
    },
  };

  const { heading, message, signin } = errors[error] ?? errors.default;

  return (

    <main className="flex h-screen items-center justify-center  bg-fuchsia-950">
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center gap-6 rounded-lg border bg-fuchsia-900 p-8 drop-shadow-lg">
        <h1 className="mb-4 text-xl text-gray-50">{heading}</h1>
        <p className="text-gray-50">{message}</p>
        {signin}
      </div>
    </main>
  );
}
