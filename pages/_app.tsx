// _app.tsx

import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import Auth from "components/Auth";
import Layout from "components/layout";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import "react-toastify/dist/ReactToastify.css";
import "pages/index.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  auth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );

  // return (
  //   <SessionProvider session={pageProps.session}>
  //     {/* {Component.auth !== false ? (
  //       <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
  //     ) : (
  //       getLayout(<Component {...pageProps} />)
  //     )} */}
  //     {getLayout(<Component {...pageProps} />)}
  //     <ToastContainer
  //       position="bottom-left"
  //       autoClose={5000}
  //       hideProgressBar={false}
  //       newestOnTop={false}
  //       closeOnClick
  //       rtl={false}
  //       pauseOnFocusLoss
  //       draggable
  //       pauseOnHover
  //       theme="light"
  //     />
  //   </SessionProvider>
  // );
};

export default App;
