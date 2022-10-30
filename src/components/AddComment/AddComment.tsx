import React, {FC} from "react";

import classes from "./AddComment.module.scss";
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import {IFieldLoginValues} from "../../pages/Login/Login";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";

const AddComment:FC<{buttonsIsLoading:boolean,handleOnSubmit:(text:string)=>Promise<void>}> = ({buttonsIsLoading,handleOnSubmit}) => {
  const {data:authData} = useSelector((state:RootState)=>state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
      setValue
  } = useForm({
    defaultValues: {
      text: '',
    },
    mode: 'onChange',
  });



  const onSubmit = async (values:{text:string}) => {
   handleOnSubmit(values.text).then(()=>setValue('text',''))
  }

  return (
    <>
      <div className={classes.root}>
        {!authData && <h2 style={{margin:0,marginLeft:'36px',color:"#8f8f8f"}}><Link style={{textDecoration:'none', color: "#9370db"}} to={'/login'}>Войдите</Link> или <Link to={'/signup'} style={{textDecoration:'none', color: "#1976d2"}}>зарегистрируйтесь</Link> чтобы оставлять комментарии!</h2>}
        {authData && <><Avatar

          classes={{ root: classes.avatar }}
          src={authData?.avatarUrl || '/noavatar.png'}
        />
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            error={Boolean(errors.text?.message)}
            helperText={errors.text?.message}
            {...register('text', { required: 'Напишите комментарий',minLength: {
                value: 5,
                message: "мнимум 5 символов"
              }, })}
            fullWidth
          />
          <LoadingButton disabled={!isValid} type={'submit'} loading={buttonsIsLoading} variant="contained">Отправить</LoadingButton>
        </form></>}
      </div>
    </>
  );
};

export default AddComment;