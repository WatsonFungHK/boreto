import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Auth({ children }) {
  // const router = useRouter();
  // const { status, data: user } = useSession();

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  return children;
}

export default Auth;
