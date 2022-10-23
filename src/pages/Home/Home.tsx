import React, {FC, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Post from "../../components/Post/Post";
import TagsBlock from "../../components/TagsBlock/TagsBlock";
import CommentsBlock from "../../components/CommentsBlock/CommentsBlock";
import $api from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, fetchTags, IPost} from "../../store/reducers/postReducer";
import {AppDispatch,RootState} from "../../store";
import PostSkeleton from "../../components/Post/PostSkeleton";




const Home:FC = () => {
    const dispatch= useDispatch<AppDispatch>()
    const {posts, tags} = useSelector((state:RootState)=>state.posts)
    const {data} = useSelector((state:RootState)=>state.auth)
    const isPostsLoading = posts.status === "loading"
    const isTagsLoading = tags.status === "loading"

    function checkCanEditPost(post:IPost, userData:any){
        if (!userData) return false;

        return post.user.id === userData.id
    }

    useEffect(()=>{
        dispatch(fetchPosts())
        dispatch(fetchTags())
    },[])

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
            {
                isPostsLoading ?
                    [...Array(5)].map(()=><PostSkeleton/>):
                    posts.items.map(p=>(
                        <Post
                            {...p}
                            commentsCount={3}
                            isEditable={checkCanEditPost(p,data)}
                            isFullPost={false}
                        />
                    ))
            }
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                    id:"1",
                  login: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                    id:"2",
                  login: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
