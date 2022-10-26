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
import {useForm} from "react-hook-form";

const AddPost: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setLoading] = React.useState(false);
    // const [text, setText] = React.useState('');
    // const [title, setTitle] = React.useState('');
    // const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const inputFileRef = useRef<HTMLInputElement>(null);


    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            text: '',
            title: '',
            tags: '',
            // imageUrl: ''
        },
        mode: 'onChange',
    });


    const token = window.localStorage.getItem('token')
    const isEditing = Boolean(id);

    const handleChangeFile = async (event:any) => {
        try {

            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('file', file);

            const url = isEditing ? `/upload/post/main/${id}` : '/upload/post/main';

            const { data } = await $api.post(url, formData, { headers: {"Authorization" : `Bearer ${token}`}});
            // console.log(data.url)
            setImageUrl(data.url);
            // setValue('imageUrl',data.url)
            // console.log(getValues('imageUrl'))
        } catch (err) {
            console.warn(err);
            alert((err as any).response.data.message);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
        // setValue('imageUrl','');
        inputFileRef.current!.value = "";
    };

    const onSubmit = async () => {
        try {
            setLoading(true);

            // const fields = {
            //     title,
            //     imageUrl,
            //     tags,
            //     text,
            // };

            const fields = {...getValues(),imageUrl};


            const { data } = isEditing
                ? await $api.patch(`/posts/${id}`, fields, { headers: {"Authorization" : `Bearer ${token}`}})
                : await $api.post('/posts', fields, { headers: {"Authorization" : `Bearer ${token}`}});

            const postId = isEditing ? id : data.id;

            navigate(`/posts/${postId}`);
        } catch (err) {
            console.warn(err);
            alert((err as any).response.data.message);
        }
    };



    useEffect(() => {
        if (isEditing) {
            $api
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    // setTitle(data.title);
                    // setText(data.text);
                    // setImageUrl(data.imageUrl);
                    // setTags(data.tags.join(','));
                    setValue('title',data.title)
                    setValue('text',data.text)
                    // setValue('imageUrl',data.imageUrl)
                    setValue('tags',data.tags.join(','))
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                // value={title}
                // onChange={(e)=>setTitle(e.target.value)}
                classes={{root: classes.title}}
                variant="standard"
                error={Boolean(errors.title?.message)}
                helperText={errors.title?.message}
                {...register('title', { required: 'Укажите заголовок',minLength: {
                        value: 5,
                        message: "мнимум 5 символов"
                    } })}
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                // value={tags}
                // onChange={(e)=>setTags(e.target.value)}
                error={Boolean(errors.tags?.message)}
                helperText={errors.tags?.message}
                {...register('tags',{validate: (val: string) => {
                        const tags = val.split(",").map(tag=>tag.trim())
                        const tagsCount = tags.length
                        const uniqueTagsCount = new Set(tags).size
                        if (tagsCount != uniqueTagsCount) return "Теги должны быть уникальными!"
                    },})}
                classes={{root: classes.tags}} variant="standard"
                placeholder="Тэги" fullWidth/>
            <SimpleMDE className={classes.editor}
                       // value={text}
                       // onChange={(value)=>setText(value)}
                       {...register('text', { required: 'Напишите статью',minLength: {
                               value: 5,
                               message: "мнимум 5 символов"
                           },
                       }) }
                       onChange={(value)=>setValue('text',value,{shouldValidate:true,shouldDirty:true})}
                       options={options}/>
            {Boolean(errors.text?.message) && <span style={{color:"red"}}>{errors.text?.message}</span>}
            <div className={classes.buttons}>
                <Button disabled={!isValid} type={'submit'}
                        // onClick={onSubmit}
                        size="large" variant="contained">
                    Опубликовать
                </Button>
                <Link to="/">
                    <Button size="large">Отмена</Button>
                </Link>
            </div>
            </form>
        </Paper>
    );
};

export default AddPost;