import React, {useEffect} from 'react';
import {AppRouter} from "./router/AppRouter";
import Container from "@mui/material/Container";
import Header from "./components/Header/Header";
import {fetchAuthMe} from "./store/reducers/authReducer";
import {AppDispatch, RootState} from "./store";
import {useDispatch, useSelector} from "react-redux";


function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(()=>{
        const token = window.localStorage.getItem('token')
        if (token)
        dispatch(fetchAuthMe(token));
    })

  return (
      <>
        <Header />
        <Container maxWidth="lg">
          <AppRouter/>
        </Container>
      </>

  );
}

export default App;
