import React, {FC} from 'react';
import Button from '@mui/material/Button';

import classes from './Header.module.scss';
import Container from '@mui/material/Container';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectIsAuth} from "../../store/reducers/authReducer";
import {AppDispatch} from "../../store";

const Header:FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.inner}>
          <Link className={classes.logo} to="/">
            <div>ARCHAKOV BLOG</div>
          </Link>
          <div className={classes.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;