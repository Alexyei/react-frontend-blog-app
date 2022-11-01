import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {IUser} from "../Post/Post";
import SideBlock from "../SideBlock/SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from '@mui/material/ListItemButton';
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {Collapse, Link} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import AddComment from "../AddComment/AddComment";
import {useAsync} from "../../hooks/useAsync";
import {createComment, getPostComments, ICommentResponse} from "../../api/comments";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {current} from "@reduxjs/toolkit";

type CommentData = ICommentResponse;

const CommentSkeleton:FC = ()=>{
    return useMemo(()=>(
        <ListItemButton alignItems="center">
            <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40}/>
            </ListItemAvatar>
            <div style={{display: "flex", flexDirection: "column"}}>
                <Skeleton variant="text" height={25} width={120}/>
                <Skeleton variant="text" height={18} width={230}/>
            </div>
            <Divider variant="inset" component="li"/>
        </ListItemButton>
    ),[])
}

const Comment:FC<{commentData: CommentData,onComment:(text:string,commentData?:CommentData)=>void,openGlobalForm:(id:string,onOpen:()=>void,onClose:()=>void,onStartComment:()=>void,onEndComment:()=>void)=>void, level: number}> = ({commentData,level,openGlobalForm,onComment})=>{
    const [open, setOpen] = React.useState(true);
    // const [addCommentFormOpen, setAddCommentFormOpen] = React.useState(false)

    const [commentFormIsOpen, setCommentFormIsOpen] = useState(false)

    const [isFormButtonLoading, setIsFormButtonLoading] = useState(false)

    const handleOpenCommentForm = useCallback(()=>{
        openGlobalForm(commentData._id,onOpenCommentForm,onCloseCommentForm,onStartComment,onEndComment)
    },[])

    const onStartComment = useCallback(()=>{
        setIsFormButtonLoading(true)
    },[])

    const onEndComment = useCallback(()=>{
        setIsFormButtonLoading(false)
    },[])

    const onOpenCommentForm = useCallback(()=>{
        setCommentFormIsOpen(true)
    },[])

    const onCloseCommentForm = useCallback(()=>{
        setCommentFormIsOpen(false)
    },[])

    // const handleOpenForm = useCallback(() => {
    //   // setAddCommentFormOpen(prev=>!prev)
    //     setSelectedCommentID(selectedCommentID === commentData._id?'':commentData._id)
    // },[selectedCommentID])

    const handleComment= useCallback(async (text:string)=>{
        onStartComment()
        await onComment(text,commentData)
        onEndComment()
    },[commentData])

    const handleClick = useCallback(() => {
        setOpen(prev=>!prev);
    },[]);

    return (
        <>
        <ListItemButton onClick={handleClick} sx={{pl:  16+(16 * level)+'px' }} alignItems="center" >
            <ListItemAvatar>
            <Avatar alt={commentData.author.login} src={commentData?.author.avatarUrl || "/noavatar.png"}/>
            </ListItemAvatar>
            <ListItemText
                primary={commentData?.author.login}
                secondary={commentData?.text}
            />
            {commentData.replies.length > 0 && (open ?
                <ExpandLess sx={{fontSize: "2rem", color: "#b8b8b8"}}/> :
                <ExpandMore sx={{fontSize: "2rem", color: "#b8b8b8"}}/>)}

        </ListItemButton>
            <Link disabled={false} sx={{ pl:  16 * level + 72+'px'}} onClick={handleOpenCommentForm} component="button" variant={"button"} underline="none">Ответить</Link>

            <Collapse in={commentFormIsOpen} timeout="auto" sx={{pl:  (16 * level)+'px'}}><AddComment handleOnSubmit={handleComment} buttonsIsLoading={isFormButtonLoading} /></Collapse>
            <Divider sx={{ml: 72+(16 * level)+'px' }} variant="inset" component="li"/>
            <Collapse in={open} timeout="auto">
                {
                    commentData?.replies.map((obj, index) => {
                        // return (<CommentElement onComment={onComment} buttonsIsLoading={buttonsIsLoading} key={index} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj} isLoading={false} level={level + 1}/>)
                        return (<Comment onComment={onComment} key={index} openGlobalForm={openGlobalForm} commentData={obj} level={level + 1}/>)
                    })
                }
            </Collapse>
        </>
    )
}


function useGlobalForm(){
    const prevForm = useRef<null|{id:string,onOpen:()=>void,onClose:()=>void,onStartComment:()=>void,onEndComment:()=>void}>(null)

    const openForm = useCallback((id:string,onOpen:()=>void,onClose:()=>void,onStartComment:()=>void,onEndComment:()=>void)=>{
        if (prevForm.current!=null){
            if(prevForm.current.id == id){
                prevForm.current.onClose();
                prevForm.current = null;
            }else{
                prevForm.current.onClose();
                prevForm.current = {id,onOpen,onClose,onStartComment,onEndComment}
                onOpen()
            }
        }else{
            prevForm.current = {id,onOpen,onClose,onStartComment,onEndComment}
            onOpen()
        }
    },[])

    return {openForm,currentForm:prevForm.current}
}



// const CommentsSection: FC<{ isLoading: boolean, items: CommentData[], children?: React.ReactNode }>
const CommentsSection: FC<{ postID:string }>
    = ({postID}) => {
    const {data:authData} = useSelector((state:RootState)=>state.auth)
    // const [selectedCommentID, setSelectedCommentID] = useState('');
    // const [buttonsIsLoading, setButtonsIsLoading] = useState(false)

    // const onOpenCommentForm = useCallback((id:string)=>{
    //     setSelectedCommentID(id)
    // },[])

    const {loading:isLoading,value:commentsData,error,execute}=useAsync(getPostComments)
    const {loading:buttonsIsLoading,value:newCommentData,error:newCommentError,execute:postComment}=useAsync(createComment,[],false)

    const {openForm:openGlobalForm,currentForm} = useGlobalForm();

    useEffect(()=>{
        execute(postID).then(res=>console.log(res.count)).catch(err=>alert(err))
    },[])


    const handleOnCommentMainForm = async (text:string)=>{
        if (currentForm){
            currentForm.onStartComment()
        }
        await onComment(text)
        if (currentForm){
            currentForm.onEndComment()
        }
    }

    const onComment = useCallback(async (text:string,comment?:CommentData)=>{

        console.log(text)
        console.log(comment)
        console.log(commentsData)
        if (authData == null) return;
        // setButtonsIsLoading(true)
        const newComment:ICommentResponse = {
            _id: "100",
            author: {_id: authData.id, login: authData.login,avatarUrl: authData?.avatarUrl},
            createdAt: new Date().toISOString(),
            isDeleted: false,
            level: comment?.level != undefined ? comment?.level + 1 : undefined,
            parent: comment?._id,
            replies: [],
            text: text

        }


        postComment(authData.token,text,postID,comment?._id).then(res=>{
            comment ? comment.replies.unshift({...newComment,...res}) : commentsData?.comments.unshift({...newComment,...res});
            commentsData!.comments = [...commentsData!.comments];
        }).catch(err=>alert(err));





        // return new Promise<void>(resolve=>setTimeout(()=>{setButtonsIsLoading(false);resolve()},5000))
    },[authData,commentsData,postID])


    return (
        <SideBlock title={isLoading ? "Загрузка комментариев..." : `Комментарии: ${commentsData?.count}`} >
            {!isLoading &&<AddComment handleOnSubmit={handleOnCommentMainForm} buttonsIsLoading={buttonsIsLoading} />}
            <List sx={{pb:"20px"}}>
                {isLoading ? [...Array(5)].map((obj,index)=><CommentSkeleton key={index}/>)
                :  commentsData?.comments.map((obj, index) => (<Comment key={index} onComment={onComment} openGlobalForm={openGlobalForm} commentData={obj!} level={0}/>
                    ))
                }
                {/*{(isLoading ? [...Array(5)] : commentsData!.comments).map((obj: CommentData | undefined, index) => (*/}
                {/*    // <CommentElement onComment={onComment} buttonsIsLoading={buttonsIsLoading} selectedCommentID={selectedCommentID} setSelectedCommentID={onOpenCommentForm} key={index} commentData={obj} isLoading={isLoading}/>*/}
                {/*    isLoading ? <CommentSkeleton key={index}/> : <Comment key={index} onComment={onComment} buttonsIsLoading={buttonsIsLoading} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj!} level={0}/>*/}
                {/*))}*/}
            </List>
        </SideBlock>
    );
};

export default CommentsSection;