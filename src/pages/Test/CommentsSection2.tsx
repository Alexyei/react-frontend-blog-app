import React, {FC, memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {useAsync} from "../../hooks/useAsync";
import {createComment, getPostComments, ICommentResponse} from "../../api/comments";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {current} from "@reduxjs/toolkit";
import AddComment from "../../components/AddComment/AddComment";
import SideBlock from "../../components/SideBlock/SideBlock";

type CommentData = ICommentResponse;
type IChain = {
    comment:CommentData,
    prev:null|IChain
}

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

const Comment = React.forwardRef<HTMLDivElement,{commentData: CommentData,onComment:(text:string,chain?:IChain)=>void,openGlobalForm:(id:string,onOpen:()=>void,onClose:()=>void,onStartComment:()=>void,onEndComment:()=>void)=>void, level: number,chain:IChain}>(({commentData,level,openGlobalForm,onComment,chain},ref)=>{
    const [open, setOpen] = React.useState(true);

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


    const handleComment= useCallback(async (text:string)=>{
        onStartComment()
        await onComment(text,chain)
        onEndComment()
    },[commentData])

    const handleClick = useCallback(() => {
        setOpen(prev=>!prev);
    },[]);

    useEffect(()=>{
        console.log("RENDERED "+commentData._id)
    },[])



        return (<>
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
            <Collapse  in={open} timeout="auto">
                {
                    commentData?.replies.map((obj) => {
                        // return (<CommentElement onComment={onComment} buttonsIsLoading={buttonsIsLoading} key={index} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj} isLoading={false} level={level + 1}/>)
                        return (<CommentMemo chain={{comment:obj,prev:chain}} onComment={onComment} key={obj._id} openGlobalForm={openGlobalForm} commentData={obj} level={level + 1}/>)
                    })
                }
            </Collapse>
                <div ref={ref}/>
        </>
    )
    // },[commentData,commentFormIsOpen,open,isFormButtonLoading,commentData.replies])
})

const CommentMemo = memo(Comment,(prev,next)=>{
    // console.log(prev.commentData.text+" || "+next.commentData.text)
    // console.log((prev.commentData != next.commentData))
    // console.log((prev.commentData.replies != next.commentData.replies))
    // console.log((prev.commentData != next.commentData)
    //     || (prev.commentData.replies != next.commentData.replies))
    // console.log("________________")
    return (prev.commentData !== next.commentData)
        || (prev.commentData.replies !== next.commentData.replies);
})


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




const CommentsSection: FC<{ postID:string }> = ({postID}) => {
    const {data:authData} = useSelector((state:RootState)=>state.auth)

    const {loading:isLoading,value:commentsData,setValue:setCommentsData,error,execute}=useAsync(getPostComments)
    const {loading:buttonsIsLoading,value:newCommentData,error:newCommentError,execute:postComment}=useAsync(createComment,[],false)

    const {openForm:openGlobalForm,currentForm} = useGlobalForm();
    const [lastRootCommentIndex, setLastCommentIndex] = useState(10)


    const observer = useRef<IntersectionObserver>()
    const lastBookElementRef = useCallback((node:HTMLDivElement)=> {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            console.log("IN OBSERVER")
            if (entries[0].isIntersecting && (commentsData && (lastRootCommentIndex+1<commentsData.count))) {
                // setPageNumber(prevPageNumber => prevPageNumber + 1)
                setLastCommentIndex(prev=>prev+10)
            }
        })
        if (node) observer.current.observe(node)
        console.log("START OBSERVER")
    }, [isLoading,lastRootCommentIndex])

    useEffect(()=>{
        execute(postID).then(res=>console.log(res.count)).catch(err=>alert(err))
    },[])


    useEffect(()=>{
        console.log("COMMENTS DATA")
    },[commentsData])

    const handleOnCommentMainForm = async (text:string)=>{
        if (currentForm){
            currentForm.onStartComment()
        }
        await addCommentMemo(text)
        if (currentForm){
            currentForm.onEndComment()
        }
    }



    const addCommentMemo = async (text:string,chain?:IChain)=>{
        if (authData == null) return;
        const newComment:CommentData = {
            _id: "100",
            author: {_id: authData.id, login: authData.login,avatarUrl: authData?.avatarUrl},
            createdAt: new Date().toISOString(),
            isDeleted: false,
            level: chain?.comment.level != undefined ? chain?.comment.level + 1 : undefined,
            parent: chain?.comment._id,
            replies: [],
            text: text

        }

        await postComment(authData.token,text,postID,chain?.comment._id).then(res=>{
            if (chain){
                chain.comment.replies = [{...newComment,...res}, ...chain.comment.replies]
                console.log("inCHAIN")
                let current = chain.prev;
                while(current){
                    console.log("WHILE")
                    current.comment.replies = [...current.comment.replies]
                    current = current.prev;
                }
                setCommentsData(prev=>prev ? {comments:[...prev.comments],count:prev.count+1}:null);
            }
            else{
                console.log("NOT IN CHAIN")
                setCommentsData(prev=>prev ? {comments:[{...newComment,...res},...prev.comments],count:prev.count+1}:null);
                setLastCommentIndex(prev=>prev+1);
            }
        }).catch(err=>alert(err));





    }
    // ,[authData,commentsData,postID])

    return (
        <SideBlock title={isLoading ? "Загрузка комментариев..." : `Комментарии: ${commentsData?.count}`} >
            {!isLoading &&<AddComment handleOnSubmit={handleOnCommentMainForm} buttonsIsLoading={buttonsIsLoading} />}
            <List sx={{pb:"20px"}}>
                {isLoading ? [...Array(5)].map((obj,index)=><CommentSkeleton key={index}/>)
                :  commentsData?.comments.slice(0,lastRootCommentIndex+1).map((obj, index) =>
                        index == lastRootCommentIndex ?
                        (<CommentMemo ref={lastBookElementRef} key={obj._id} chain={{comment:obj,prev:null}} onComment={addCommentMemo} openGlobalForm={openGlobalForm} commentData={obj!} level={0}/>):
                        (<CommentMemo key={obj._id} chain={{comment:obj,prev:null}} onComment={addCommentMemo} openGlobalForm={openGlobalForm} commentData={obj!} level={0}/>)
                    )
                }
            </List>
        </SideBlock>
    );

    // return (
    //     <SideBlock title={isLoading ? "Загрузка комментариев..." : `Комментарии: ${commentsData?.count}`} >
    //         {!isLoading &&<AddComment handleOnSubmit={handleOnCommentMainForm} buttonsIsLoading={buttonsIsLoading} />}
    //         <List sx={{pb:"20px"}}>
    //             {isLoading ? [...Array(5)].map((obj,index)=><CommentSkeleton key={index}/>)
    //                 :  commentsData?.comments.slice((lastRootCommentIndex+1 < 20)?0:(lastRootCommentIndex+1-20),lastRootCommentIndex+1).map((obj, index) =>
    //                     index == (lastRootCommentIndex < 20 ? lastRootCommentIndex: 19 ) ?
    //                         (<CommentMemo ref={lastBookElementRef} key={obj._id} chain={{comment:obj,prev:null}} onComment={addCommentMemo} openGlobalForm={openGlobalForm} commentData={obj!} level={0}/>):
    //                         (<CommentMemo key={obj._id} chain={{comment:obj,prev:null}} onComment={addCommentMemo} openGlobalForm={openGlobalForm} commentData={obj!} level={0}/>)
    //                 )
    //             }
    //         </List>
    //     </SideBlock>
    // );
};

export default CommentsSection;