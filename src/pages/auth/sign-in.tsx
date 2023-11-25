import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import Button from "~/components/Button";
import { useSearchParams } from "next/navigation";

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mappedProviders = Object.values(providers);
  const queryParams = useSearchParams();

  const hasError = queryParams.get('error')

  return (
    <main className="flex h-screen items-center justify-center  bg-fuchsia-950">
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center gap-6 rounded-lg border bg-fuchsia-900 p-8 drop-shadow-lg">
        <h1 className="mb-4 text-xl text-gray-50">Te damos la bienvenida</h1>

        {hasError && <span>error</span>}

        {mappedProviders.findIndex((provider) => provider.id === "email") ===
          1 && (
            <>
              <form className="flex flex-col gap-2" method="post" action="/api/auth/signin/email">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label className="flex flex-col gap-1 w-full">
                  <span className="text-gray-50">Tu correo electrónico</span>
                  <input className=" py-2 px-4 rounded-md" id="email" name="email" type="email" />
                </label>
                <Button type="submit">
                  Iniciá sesión con tu correo
                </Button>
              </form>

              <hr className="border border-black w-full" />

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

  const csrfToken = await getCsrfToken(context)
  const providers = await getProviders();

  return {
    props: { csrfToken, providers: providers ?? [] },
  };
}
