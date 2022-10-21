import React, {FC, useState} from "react";
import Post from "../../components/Post/Post";
import CommentsBlock from "../../components/CommentsBlock/CommentsBlock";
import AddComment from "../../components/AddComment/AddComment";
import {useParams} from "react-router-dom";
import $api from "../../api";
import PostSkeleton from "../../components/Post/PostSkeleton";
import {IPost} from "../../store/reducers/postReducer";



const FullPost:FC = () => {
    const [data, setData] = useState<IPost>();
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams();

    React.useEffect(()=>{
        $api.get(`/posts/${id}`)
            .then(res=>setData(res.data))
            .catch(err=>alert(err.message()))
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
        <p>
            {data.text}
        </p>
      </Post>}
      <CommentsBlock
        items={[
          {

            user: {
                id:"1",
              login: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
                id:"2",
              login: "Иван Иванов",
              // avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <AddComment />
      </CommentsBlock>
    </>
  );
};

export  default FullPost;