import { useSession } from "next-auth/react";
import Overview from "./overview";
const DashboardPage = () => {
  // const { data: user, status } = useSession();
  const status = "test";
  return <Overview />;
};

export default DashboardPage;
