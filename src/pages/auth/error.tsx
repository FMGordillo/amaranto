import { FunctionComponent } from "react";
import Button from "~/components/Button";

type ErrorPageParam = "Configuration" | "AccessDenied" | "Verification";

export interface ErrorProps {
  url?: URL;
  error?: ErrorPageParam;
}

interface ErrorView {
  status: number;
  heading: string;
  message: JSX.Element;
  signin?: JSX.Element;
}

const SignInBtn: FunctionComponent<{ url: string }> = ({ url }) => (
  <a className="button" href={url}>
    Iniciá sesión
  </a>
);

export default function ErrorPage(props: ErrorProps) {
  const { url, error = "default" } = props;
  const signinPageUrl = `${url}/signin`;

  const errors: Record<ErrorPageParam | "default", ErrorView> = {
    default: {
      status: 200,
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
      status: 500,
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
      status: 403,
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
      status: 403,
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

  const { status, heading, message, signin } = errors[error] ?? errors.default;

  return {
    status,
    html: (
      <div className="error">
        <div className="card">
          <h1>{heading}</h1>
          <div className="message">{message}</div>
          {signin}
        </div>
      </div>
    ),
  };
}
