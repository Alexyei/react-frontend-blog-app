import React, {FC} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import classes from './Login.module.scss';

import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {fetchAuth, selectIsAuth} from "../../store/reducers/authReducer";

export interface IFieldLoginValues {
    email:string,
    password:string
}

const Login:FC = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });



    const onSubmit = async (values:IFieldLoginValues) => {
        const data = await dispatch(fetchAuth(values));

        if (!data.payload || 'error' in data.payload) {
            return alert((data.payload as any).error);
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', (data.payload as any).token);
        }
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper classes={{ root: classes.root }}>
            <Typography classes={{ root: classes.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={classes.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    type="email"
                    {...register('email', { required: 'Укажите почту',pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ,message: "Некорректный email"
                    } })}
                    fullWidth
                />
                <TextField
                    className={classes.field}
                    label="Пароль"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', { required: 'Укажите пароль',minLength: {
                            value: 5,
                            message: "мнимум 5 символов"
                        }, })}
                    fullWidth
                />
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};

export default Login;
