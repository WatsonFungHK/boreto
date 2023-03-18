import { useSession } from "next-auth/react";

const DashboardPage = () => {
  const { data: user, status } = useSession();
  return (
    <>
      <h1>Dashboard</h1>
      {/* <p>Welcome back, {user?.username}!</p> */}
      <p>{status}</p>
      <p>{JSON.stringify(user)}</p>
    </>
  );
};

export default DashboardPage;
