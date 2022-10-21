import React, {FC, useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import classes from './AddPost.module.scss';
import {Link} from "react-router-dom";

const AddPost: FC = () => {
    const imageUrl = '';
    const [value, setValue] = useState('');

    const handleChangeFile = () => {
    };

    const onClickRemoveImage = () => {
    };

    const onChange = useCallback((value: string) => {
        setValue(value);
    }, []);

    const options = React.useMemo(
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
            <SimpleMDE className={classes.editor} value={value} onChange={onChange} options={options}/>
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