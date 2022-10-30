import React, {FC} from "react";

import classes from "./AddComment.module.scss";
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const AddComment:FC = () => {
  return (
    <>
      <div className={classes.root}>
        <Avatar
          classes={{ root: classes.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={classes.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <LoadingButton loading={true} variant="contained">Отправить</LoadingButton>
        </div>
      </div>
    </>
  );
};

export default AddComment;