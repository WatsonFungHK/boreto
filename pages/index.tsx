import React from "react";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import DashboardPage from "./dashboard";

export async function getServerSideProps({ req, res }) {
  return {
    props: {
      session: await getServerSession(req, res, authOptions),
    },
  };
}

const Container = (props) => {
  return <DashboardPage />;
};

export default Container;
