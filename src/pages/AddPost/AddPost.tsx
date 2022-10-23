import React, {FC, useCallback, useMemo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import classes from './AddPost.module.scss';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../store/reducers/authReducer";
import $api from "../../api";

const AddPost: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setLoading] = React.useState(false);
    const [text, setText] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const inputFileRef = React.useRef(null);

    const isEditing = Boolean(id);

    const handleChangeFile = async (event:any) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('file', file);
            const { data } = await $api.post('/upload', formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert('Ошибка при загрузке файла!');
        }
    };

    const onClickRemoveImage = () => {
    };

    const onChange = useCallback((value: string) => {
        setText(value)
    }, []);

    const options =useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                uniqueId: "post",
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    return (
        <Paper style={{padding: 30}}>
            <Button variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                    Удалить
                </Button>
            )}
            {imageUrl && (
                <img className={classes.image} src={`http://localhost:5000${imageUrl}`} alt="Uploaded"/>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: classes.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField classes={{root: classes.tags}} variant="standard" placeholder="Тэги" fullWidth/>
            <SimpleMDE className={classes.editor} value={text} onChange={onChange} options={options}/>
            <div className={classes.buttons}>
                <Button size="large" variant="contained">
                    Опубликовать
                </Button>
                <Link to="/">
                    <Button size="large">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};

export default AddPost;