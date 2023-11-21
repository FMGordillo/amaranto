import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";

const SubscribePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
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
      } finally {
      }
    };

    if (props.redirectToStripe && !isFetching && props.plan && props.userId) {
      void getStripeSession();
    }
  }, [props.redirectToStripe, props.plan, props.userId, isFetching]);

  if (props.redirectToStripe) {
    return <div>redirecting</div>;
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
      plan: plan ?? null,
      userId: session.user.id,
    },
  };
};

export default SubscribePage;
