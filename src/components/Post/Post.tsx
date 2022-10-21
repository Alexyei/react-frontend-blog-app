import React, {FC} from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import classes from './Post.module.scss';
import  UserInfo  from '../UserInfo/UserInfo';
import PostSkeleton  from './PostSkeleton';
import {Link} from "react-router-dom";
import {API_URL} from "../../api";
import axios from "axios";

export interface IUser{id:string,login:string,avatarUrl?:string}

interface IPostProps {
  id : string,
  title: string,
  createdAt: string,
  imageUrl?: string,
  user: IUser,
  viewsCount:number,
  commentsCount:number,
  tags: string[],
  children?:React.ReactNode,
  isFullPost:boolean,
  // isLoading:boolean,
  isEditable:boolean,
}

const Post:FC<IPostProps> = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  // isLoading,
  isEditable,
}) => {
  // if (isLoading) {
  //   return <PostSkeleton />;
  // }

  const onClickRemove = () => {};

  //"https://source.unsplash.com/1600x900/?beach"
  imageUrl = imageUrl ? API_URL+imageUrl: imageUrl

  return (
    <div className={clsx(classes.root, { [classes.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={classes.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(classes.image, { [classes.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={classes.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={classes.indention}>
          <h2 className={clsx(classes.title, { [classes.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={classes.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={classes.content}>{children}</div>}
          <ul className={classes.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;