import { useSession } from "next-auth/react";

const DashboardPage = () => {
  // const { data: user, status } = useSession();
  const status = "test";
  return (
    <>
      <h1>Dashboard</h1>
      {/* <p>Welcome back, {user?.email}!</p> */}
      <p>{status}</p>

      {/* {user && <p>{JSON.stringify(user)}</p>} */}
    </>
  );
};

export default DashboardPage;
