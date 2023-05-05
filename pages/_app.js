import React, { useEffect, useState } from "react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import createEmotionCache from "../utility/createEmotionCache";
import lightTheme from "../styles/theme/lightTheme";
import "../styles/globals.scss";
import { RecoilRoot } from "recoil";
import Parse from "parse";
import { SnackbarProvider } from "notistack";
import AuthWrapper from "../components/AuthWrapper";

const clientSideEmotionCache = createEmotionCache();

const InnerApp = ({ Component, pageProps }) => {
  const [parseReady, setParseReady] = useState(false);

  useEffect(() => {
    Parse.initialize("dev", "devdev");
    Parse.serverURL = "https://thesis-image-backend.herokuapp.com/parse";
    // Parse.serverURL = "http://localhost:1337/api/parse";
    let current = Parse.User.current();
    if (current) {
      Parse.User?.logOut();
    }
    setParseReady(true);
  }, []);

  if (!parseReady) return null;

  return (
    <ThemeProvider theme={lightTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <RecoilRoot>
        <InnerApp Component={Component} pageProps={pageProps} />
      </RecoilRoot>
    </CacheProvider>
  );
};

export default MyApp;
