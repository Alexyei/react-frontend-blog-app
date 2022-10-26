import React, {FC, useEffect, useMemo, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Post from "../../components/Post/Post";
import TagsBlock from "../../components/TagsBlock/TagsBlock";
import CommentsBlock from "../../components/CommentsBlock/CommentsBlock";
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
    const [currentTab, setCurrentTab]= useState<"new"|"popular">("new")

    const sortedPosts = useMemo(()=>{
        // if (isPostsLoading) return [];
        switch(currentTab){
            case "new":
                return [...posts.items].sort((a,b)=>{
                    const firstValue = a.createdAt;
                    const secondValue = b.createdAt;
                    if (firstValue>secondValue) return -1;
                    if (firstValue<secondValue) return  1;
                    return 0;
                })
            case "popular":
                return [...posts.items].sort((a,b)=>{
                    return b.viewsCount - a.viewsCount;
                })
        }
    },[currentTab,posts])


    function checkCanEditPost(post:IPost, userData:any){
        if (!userData) return false;

        return post.user.id === userData.id
    }

    useEffect(()=>{
        dispatch(fetchPosts())
        dispatch(fetchTags())
    },[])


    const handleChangeTabs = (event: React.SyntheticEvent, newValue:"new"|"popular") => {
        setCurrentTab(newValue);
    };

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} onChange={handleChangeTabs} value={currentTab} aria-label="basic tabs example">
        <Tab value={"new"}  label="Новые" />
        <Tab value={"popular"} label="Популярные" />
      </Tabs>
      <Grid container spacing={4} >
        <Grid xs={12} md={8} item>
            {
                isPostsLoading ?
                    [...Array(5)].map((_,i)=><PostSkeleton key={i}/>):
                    sortedPosts.map(p=>(
                        <Post
                            {...p}
                            key={p.id}
                            commentsCount={3}
                            isEditable={checkCanEditPost(p,data)}
                            isFullPost={false}
                        />
                    ))
            }
        </Grid>
        <Grid xs={12} md={4} item>
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
