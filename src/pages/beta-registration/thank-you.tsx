import Layout from "~/components/Layout";

export default function ThankYouPage() {
  return (
    <Layout hideHeader title="Gracias! - Amaranto">
      <div className="relative h-full bg-pink-300 ">
        <div className="relative z-20 flex h-full select-none flex-col items-center justify-center gap-2 text-center">
          <h1 className="mb-8 text-4xl font-bold leading-normal">
            Registramos tu respuesta
            <br />
            ¡Muchas gracias!
          </h1>
          <p>Te contactaremos apenas tengamos lista la Beta Cerrada</p>
          <a
            href="https://www.linkedin.com/company/99908623"
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="mt-8 flex flex-col items-center">
              <img src="/chirotech.png" className="h-16 w-16" />
              <span className="font-bold">ChiroTech</span>
            </div>
          </a>
        </div>

        <div className="absolute inset-0 rotate-180 bg-[url('/background_thank_you.png')] bg-auto bg-bottom bg-repeat-x" />
        <div className="absolute inset-0 bg-[url('/background_thank_you.png')] bg-auto bg-bottom bg-repeat-x" />
      </div>
    </Layout>
  );
}
