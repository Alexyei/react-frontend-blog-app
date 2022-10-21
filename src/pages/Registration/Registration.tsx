import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import classes from './Registration.module.scss';
import {FC} from "react";

import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {fetchAuth, fetchRegister, selectIsAuth} from "../../store/reducers/authReducer";

export interface IFieldSignUpValues {
    login:string,
    email:string,
    password:string,
    avatarUrl?:string
}


const Registration:FC = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            login: '',
            email: '',
            password: '',
            confirmPassword:'',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values:IFieldSignUpValues) => {
        values.avatarUrl = "https://avatars.dicebear.com/api/bottts/6.svg?size=128"
        const data = await dispatch(fetchRegister(values));

        if (!data.payload) {
            return alert('Не удалось регистрироваться!');
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
                Создание аккаунта
            </Typography>
            <div className={classes.avatar}>
                <Avatar sx={{ width: 100, height: 100 }} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    error={Boolean(errors.login?.message)}
                    helperText={errors.login?.message}
                    {...register('login', { required: 'Укажите полное имя' })}
                    className={classes.field}
                    label="Логин"
                    fullWidth
                />
                <TextField
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    type="email"
                    {...register('email', { required: 'Укажите почту' })}
                    className={classes.field}
                    label="E-Mail"
                    fullWidth
                />
                <TextField
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    type="password"
                    {...register('password', { required: 'Укажите пароль' })}
                    className={classes.field}
                    label="Пароль"
                    fullWidth
                />
                <TextField
                    error={Boolean(errors.confirmPassword?.message)}
                    helperText={errors.confirmPassword?.message}
                    type="password"
                    {...register('confirmPassword', { required: 'Укажите пароль', validate: (val: string) => {
                            if (watch('password') != val) {
                                return "Пароли не совпадают";
                            }
                        }, })}
                    className={classes.field}
                    label="Повторите пароль"
                    fullWidth
                />
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};

export default Registration;