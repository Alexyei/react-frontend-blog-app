import React, {FC, useState} from "react";
import Post from "../../components/Post/Post";
import CommentsBlock from "../../components/CommentsBlock/CommentsBlock";
import AddComment from "../../components/AddComment/AddComment";
import {useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import $api from "../../api";
import PostSkeleton from "../../components/Post/PostSkeleton";
import {IPost} from "../../store/reducers/postReducer";
import CommentsSection from "../../components/CommentsSection/CommentsSection";



const FullPost:FC = () => {
    const [data, setData] = useState<IPost>();
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams();

    React.useEffect(()=>{
        $api.get(`/posts/${id}`)
            .then(res=>setData(res.data))
            .catch(err=>alert(err.message))
            .finally(()=>setIsLoading(false))
    },[])

    if (isLoading) return <PostSkeleton/>

  return (
    <>
        {data &&
      <Post
          {...data}
        commentsCount={3}
        isFullPost
        isEditable={false}
      >
          <ReactMarkdown children={data.text} />
      </Post>}
      <CommentsSection
        items={[
          {

            user: {
                id:"1",
              login: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
              replies: [
                  {

                      user: {
                          id:"1",
                          login: "Снова я",
                          avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                      },
                      text: "Это тестовый комментарий 555555",
                      replies: [

                      ]
                  },
                  {

                      user: {
                          id:"1",
                          login: "Ещё раз",
                          avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                      },
                      text: "Это тестовый комментарий 555555",
                      replies: [
                          {

                              user: {
                                  id:"1",
                                  login: "Третий левел",
                                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                              },
                              text: "Это тестовый комментарий 555555",
                              replies: [

                              ]
                          },
                      ]
                  },
              ]
          },
          {
            user: {
                id:"2",
              login: "Иван Иванов",
              // avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "333When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
           replies: []
          },
        ]}
        isLoading={false}
      >
        <AddComment />
      </CommentsSection>
    </>
  );
};

export  default FullPost;