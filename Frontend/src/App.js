import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CircularProgress, CssBaseline } from "@mui/material";
import { useStateValue } from './store/StateProvider';
import { actionTypes } from './store/reducer';
import RouteList from "./routes";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DefaultLayout from "./layouts/DefaultLayout";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Login from "./views/auth/Login";
import NotFound from "./views/errorPages/NotFound";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(48, 64, 154)",
      dark: "#222437",
      dark2: "rgb(0, 3, 30)",
    }
  }
});

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(()=>{
    dispatch({
      type: actionTypes.SET_LOADING,
      loading: true
    });
  },[])

  let savedUser = localStorage.getItem('gym_user');

  if(savedUser !== null && savedUser !== "undefined" && (user===null || user=== undefined)) {

    savedUser = JSON.parse(savedUser);

    let currentTime = new Date().getTime();
    let expireTime = parseInt(savedUser.expire);

    if(expireTime > currentTime){
      dispatch({
        type: actionTypes.SET_USER,
        user: savedUser.email,
        token: savedUser.token,
        expire: savedUser.expire
      });
    } else {
      localStorage.removeItem('gym_user');
      alert("Your session has expired. Please to log in again");
    }
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Suspense fallback={<CircularProgress />}>
            {user ? (
              <Routes>

                {RouteList.map((route, index) => {
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <DefaultLayout>
                          {route.element}
                        </DefaultLayout>
                      }
                    />
                  )
                })}

                {/* error pages */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            ) : (
              <Routes>
                <Route path="*" element={<Login />} />
              </Routes>
            )}
          </Suspense>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
