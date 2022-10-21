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

    const isPostsLoading = posts.status === "loading"
    const isTagsLoading = tags.status === "loading"

    function checkCanEditPost(post:IPost, myID:string){
        return true;
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
                            // id={"1"}
                            // title="Roast the code #1 | Rock Paper Scissors"
                            // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
                            // user={{
                            //     id:"1",
                            //     avatarUrl:
                            //         'https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png',
                            //     login: 'Keff',
                            // }}
                            // createdAt={'12 июня 2022 г.'}
                            // viewsCount={150}
                            // commentsCount={3}
                            // tags={['react', 'fun', 'typescript']}
                            commentsCount={3}
                            isEditable={checkCanEditPost(p,"1")}
                            isFullPost={false}
                        />
                    ))
            }
          {/*{[...Array(5)].map(() => (*/}
          {/*  <Post*/}
          {/*    id={"1"}*/}
          {/*    title="Roast the code #1 | Rock Paper Scissors"*/}
          {/*    imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"*/}
          {/*    user={{*/}
          {/*        id:"1",*/}
          {/*      avatarUrl:*/}
          {/*        'https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png',*/}
          {/*      login: 'Keff',*/}
          {/*    }}*/}
          {/*    createdAt={'12 июня 2022 г.'}*/}
          {/*    viewsCount={150}*/}
          {/*    commentsCount={3}*/}
          {/*    tags={['react', 'fun', 'typescript']}*/}
          {/*    isEditable*/}
          {/*    isLoading={false}*/}
          {/*    isFullPost={false}*/}
          {/*  />*/}
          {/*))}*/}
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
