import React, {FC} from 'react';
import classes from './UserInfo.module.scss';

const UserInfo:FC<{avatarUrl?:string,login:string,additionalText:string}> = ({ avatarUrl, login, additionalText }) => {
  return (
    <div className={classes.root}>
      <img className={classes.avatar} src={avatarUrl || '/noavatar.png'} alt={login} />
      <div className={classes.userDetails}>
        <span className={classes.userName}>{login}</span>
        <span className={classes.additional}>{additionalText}</span>
      </div>
    </div>
  );
};

export default UserInfo;
