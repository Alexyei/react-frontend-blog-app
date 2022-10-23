import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import classes from './AddPost.module.scss';
import {Link, useNavigate,Navigate,  useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../store/reducers/authReducer";
import $api, {API_URL} from "../../api";

const AddPost: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setLoading] = React.useState(false);
    const [text, setText] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const inputFileRef = useRef<HTMLInputElement>(null);

    const token = window.localStorage.getItem('token')
    const isEditing = Boolean(id);

    const handleChangeFile = async (event:any) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('file', file);

            const url = isEditing ? `/upload/post/main/${id}` : '/upload/post/main';

            const { data } = await $api.post(url, formData, { headers: {"Authorization" : `Bearer ${token}`}});
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert('Ошибка при загрузке файла!');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
        inputFileRef.current!.value = "";
    };

    const onSubmit = async () => {
        try {
            setLoading(true);

            const fields = {
                title,
                imageUrl,
                tags,
                text,
            };

            const { data } = isEditing
                ? await $api.patch(`/posts/${id}`, fields, { headers: {"Authorization" : `Bearer ${token}`}})
                : await $api.post('/posts', fields, { headers: {"Authorization" : `Bearer ${token}`}});

            const postId = isEditing ? id : data.id;

            navigate(`/posts/${postId}`);
        } catch (err) {
            console.warn(err);
            alert('Ошибка при создании или редактировании статьи!');
        }
    };



    useEffect(() => {
        console.log(isEditing)
        if (isEditing) {
            $api
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setImageUrl(data.imageUrl);
                    setTags(data.tags.join(','));
                })
                .catch((err) => {
                    console.warn(err);
                    alert('Ошибка при получении статьи!');
                });
        }
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

    if (!window.localStorage.getItem('token') || !isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputFileRef.current?.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                    Удалить
                </Button>
            )}
            {imageUrl && (
                <img className={classes.image} src={`${API_URL}${imageUrl}`} alt="Uploaded"/>
            )}
            <br/>
            <br/>
            <TextField
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                classes={{root: classes.title}}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                value={tags}
                onChange={(e)=>setTags(e.target.value)}
                classes={{root: classes.tags}} variant="standard" placeholder="Тэги" fullWidth/>
            <SimpleMDE className={classes.editor} value={text} onChange={(value)=>setText(value)} options={options}/>
            <div className={classes.buttons}>
                <Button type={'submit'} onClick={onSubmit} size="large" variant="contained">
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