import React from 'react';
import {AppRouter} from "./router/AppRouter";
import Container from "@mui/material/Container";
import Header from "./components/Header/Header";


function App() {
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
