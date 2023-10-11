import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className="bg-fuchsia-700 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/"><h1 className="text-2xl font-bold">Amaranto</h1></Link>
        <span>{session ? "Hi!" : <button onClick={() => void signIn()}>Login</button>}</span>
      </div>
    </nav>
  );
}
