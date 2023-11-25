export default function VerifyRequest() {
  return (
    <main className="flex h-screen items-center justify-center  bg-fuchsia-950">
      <div className="mx-auto flex max-w-md flex-1 flex-col items-center gap-6 rounded-lg border bg-fuchsia-900 p-8 text-gray-50 drop-shadow-lg">
        <h1 className="mb-4 text-xl text-gray-50">
          Verificá tu correo electrónico
        </h1>
        <p>Revisá la casilla de correos y hacé clic en Iniciar sesión</p>
        <p>
          <strong className="text-red-400">IMPORTANTE</strong>: Asegurate que el
          correo provenga de{" "}
          <code className="underline underline-offset-4">chirotech.dev</code>
        </p>
      </div>
    </main>
  );
}
