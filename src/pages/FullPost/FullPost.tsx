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

        <CommentsSection postID={id || ""}/>
    </>
  );
};

export  default FullPost;