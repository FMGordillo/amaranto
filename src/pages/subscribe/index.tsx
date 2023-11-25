import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";

const SubscribePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getStripeSession = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(
          new URL("/stripe/create-subscription", env.NEXT_PUBLIC_BACKEND_URL)
            .href,
          {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              userId: props.userId,
              plan: props.plan,
            }),
          },
        );

        const data = await response.json() as { url: string };

        if (response.status === 200 && data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        void router.replace('/')
      } finally {
      }
    };

    if (props.redirectToStripe && !isFetching && props.plan && props.userId) {
      void getStripeSession();
    }
  }, [props.redirectToStripe, props.plan, props.userId, isFetching]);

  if (props.redirectToStripe) {
    return (
      <main className="flex h-screen items-center justify-center  bg-fuchsia-950">
        <div className="mx-auto flex max-w-md flex-1 flex-col items-center gap-6 rounded-lg border bg-fuchsia-900 p-8 text-gray-50 drop-shadow-lg">
          <h1 className="mb-4 text-xl text-gray-50">
            Por favor espere
          </h1>
          <p>Estás a un paso de entrar a tu clínica digital</p>
        </div>
      </main>
    )
  }

  return <div>select a plan plz</div>;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const plan =
    typeof context.query.plan === "string"
      ? context.query.plan
      : context.query.plan?.[0];

  const session = await getServerSession(context.req, context.res, authOptions);
  const hasSubscription = session?.user.subscription;

  if (!session) {
    return {
      props: {
        redirectToStripe: false,
        plan,
      },
    };
  }

  if (hasSubscription) {
    return {
      redirect: {
        permanent: false,
        destination: '/app',
      },
    };
  }

  return {
    props: {
      redirectToStripe: true,
      plan: plan ?? 'basic',
      userId: session.user.id,
    },
  };
};

export default SubscribePage;
