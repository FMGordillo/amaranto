import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import Button from "~/components/Button";
import { useSearchParams } from "next/navigation";
import type { ErrorView } from "./error";

type ErrorPageParam =
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "Default";

const errors: Record<
  ErrorPageParam | "Default",
  Exclude<ErrorView, "signIn">
> = {
  Default: {
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
  CredentialsSignin: {
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
  Callback: {
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
  EmailCreateAccount: {
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
  EmailSignin: {
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
  OAuthAccountNotLinked: {
    heading: "Error del servidor",
    message: (
      <div>
        <p>
          El correo asociado a la cuenta que usaste{" "}
          <strong>ya está en uso</strong>. Probá iniciando sesión con la misma
          cuenta.
        </p>
        <a href="mailto:facundo@chirotech.dev?subject='Amaranto AuthError'">
          Si crees que es un error, contáctanos
        </a>
      </div>
    ),
  },
  OAuthCreateAccount: {
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
  SessionRequired: {
    heading: "Sesión requerida",
    message: (
      <div>
        <p>Necesitás iniciar sesión</p>
      </div>
    ),
  },
  OAuthSignin: {
    heading: "Acceso denegado",
    message: (
      <div>
        <p>No tienes permiso para iniciar sesión</p>
      </div>
    ),
  },
  OAuthCallback: {
    heading: "No pudimos iniciar sesión",
    message: (
      <div>
        <p>El link que usaste no es válido.</p>
        <p>Probablemente ya lo hayas usado o ha expirado.</p>
      </div>
    ),
  },
};

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mappedProviders = Object.values(providers);
  const queryParams = useSearchParams();

  const error = queryParams.get("error");

  const { heading, message } = error
    ? errors[error as ErrorPageParam] ?? errors.Default
    : {
        heading: undefined,
        message: undefined,
      };

  return (
    <main className="flex h-screen items-center justify-center  bg-fuchsia-950">
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center gap-6 rounded-lg border bg-fuchsia-900 p-8 drop-shadow-lg">
        {error && (
          <div className="flex-1 rounded-lg border bg-red-700/40 p-4 text-gray-50">
            <p className="font-bold">{heading}</p>
            <p>{message}</p>
          </div>
        )}
        <h1 className="mb-4 text-xl text-gray-50">Te damos la bienvenida</h1>

        {mappedProviders.findIndex((provider) => provider.id === "email") ===
          1 && (
          <>
            <form
              className="flex flex-col gap-2"
              method="post"
              action="/api/auth/signin/email"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <label className="flex w-full flex-col gap-1">
                <span className="text-gray-50">Tu correo electrónico</span>
                <input
                  className=" rounded-md px-4 py-2"
                  id="email"
                  name="email"
                  type="email"
                />
              </label>
              <Button type="submit">Iniciá sesión con tu correo</Button>
            </form>

            <hr className="w-full border border-black" />
          </>
        )}

        {mappedProviders
          .filter((provider) => provider.id !== "email")
          .map((provider) => (
            <div key={provider.name}>
              <Button onClick={() => void signIn(provider.id)}>
                Iniciá sesión con {provider.name}
              </Button>
            </div>
          ))}
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/app" } };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers: providers ?? [] },
  };
}
