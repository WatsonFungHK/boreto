import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({ required: true });
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return children;
  }

  if (status === "unauthenticated") {
    router.push("/login");
  }
}

export default Auth;
