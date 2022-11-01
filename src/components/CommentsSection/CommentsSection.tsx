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

// type CommentData = {
//     user: IUser, text: string, id:string
//     replies: CommentData[]
// }

type CommentData = ICommentResponse;

const CommentElement: FC<{ isLoading: boolean,buttonsIsLoading:boolean,onComment:(text:string,commentData?:CommentData)=>void, selectedCommentID:string, setSelectedCommentID:(id:string)=>void, commentData?: CommentData, level?: number }> = ({
                                                                                                                                                                                                                                                     isLoading,
                                                                                                                                                                                                                                                     onComment,
                                                                                                                                                                                                                                                     buttonsIsLoading,
                                                                                                                                                                                                                                                     selectedCommentID,
                                                                                                                                                                                                                                                     setSelectedCommentID,
                                                                                                                                                                                                                                                     commentData,
                                                                                                                                                                                                                                                     level = 0
                                                                                                                                                                                                                                                 }) => {




    return (
        <React.Fragment>
            {isLoading ? <CommentSkeleton/> : <Comment onComment={onComment} buttonsIsLoading={buttonsIsLoading} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={commentData!} level={level}/>}
            {/*<ListItemButton onClick={handleClick} sx={{pl: level ? 4 * level : 'auto'}} alignItems="center">*/}
            {/*    <ListItemAvatar>*/}
            {/*        {isLoading ? (*/}
            {/*            <Skeleton variant="circular" width={40} height={40}/>*/}
            {/*        ) : (*/}
            {/*            <Avatar alt={commentData?.user.login} src={commentData?.user.avatarUrl || "/noavatar.png"}/>*/}
            {/*        )}*/}
            {/*    </ListItemAvatar>*/}
            {/*    {isLoading ? (*/}
            {/*        <div style={{display: "flex", flexDirection: "column"}}>*/}
            {/*            <Skeleton variant="text" height={25} width={120}/>*/}
            {/*            <Skeleton variant="text" height={18} width={230}/>*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <ListItemText*/}
            {/*            primary={commentData?.user.login}*/}
            {/*            secondary={commentData?.text}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*    {!isLoading && commentData?.replies && commentData?.replies.length > 0 && (open ?*/}
            {/*        <ExpandLess onClick={handleClick} sx={{fontSize: "2rem", color: "#b8b8b8"}}/> :*/}
            {/*        <ExpandMore sx={{fontSize: "2rem", color: "#b8b8b8"}} onClick={handleClick}/>)}*/}

            {/*</ListItemButton>*/}
            {/*{!isLoading &&*/}
            {/*<>*/}
            {/*    <Link disabled={false} sx={{ pl: level ? 4 * level + 72+'px' : '72px',}}*/}
            {/*          onClick={(e) => {*/}

            {/*              console.info("I'm a button.");*/}
            {/*          }}*/}
            {/*          component="button" variant={"button"} underline="none">Ответить</Link>*/}
            {/*</>}*/}
            {/*<Divider variant="inset" component="li"/>*/}

            {/*<Collapse in={open} timeout="auto">*/}
            {/*    {*/}
            {/*        commentData?.replies.map((obj, index) => {*/}
            {/*            return (<CommentElement key={index} commentData={obj} isLoading={isLoading} level={level + 1}/>)*/}
            {/*        })*/}
            {/*    }*/}
            {/*</Collapse>*/}
        </React.Fragment>
    )
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

const Comment:FC<{commentData: CommentData,onComment:(text:string,commentData?:CommentData)=>void,buttonsIsLoading:boolean,selectedCommentID:string, setSelectedCommentID:(id:string)=>void, level: number}> = ({commentData,level,selectedCommentID,setSelectedCommentID,buttonsIsLoading,onComment})=>{
    const [open, setOpen] = React.useState(false);
    // const [addCommentFormOpen, setAddCommentFormOpen] = React.useState(false)

    const handleOpenForm = useCallback(() => {
      // setAddCommentFormOpen(prev=>!prev)
        setSelectedCommentID(selectedCommentID === commentData._id?'':commentData._id)
    },[selectedCommentID])

    const handleComment= useCallback(async (text:string)=>{
        await onComment(text,commentData)
    },[])

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
            <Link disabled={false} sx={{ pl:  16 * level + 72+'px'}} onClick={handleOpenForm} component="button" variant={"button"} underline="none">Ответить</Link>

            <Collapse in={selectedCommentID === commentData._id} timeout="auto" sx={{pl:  (16 * level)+'px'}}><AddComment handleOnSubmit={handleComment} buttonsIsLoading={buttonsIsLoading} /></Collapse>
            <Divider sx={{ml: 72+(16 * level)+'px' }} variant="inset" component="li"/>
            <Collapse in={open} timeout="auto" mountOnEnter unmountOnExit>
                {
                    commentData?.replies.map((obj, index) => {
                        // return (<CommentElement onComment={onComment} buttonsIsLoading={buttonsIsLoading} key={index} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj} isLoading={false} level={level + 1}/>)
                        return (<Comment onComment={onComment} buttonsIsLoading={buttonsIsLoading} key={index} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj} level={level + 1}/>)
                    })
                }
            </Collapse>
        </>
    )
}


function useGlobalForm(){
    const prevForm = useRef<null|{id:string,onOpen:()=>void,onClose:()=>void}>(null)

    const openForm = useCallback((id:string,onOpen:()=>void,onClose:()=>void)=>{
        if (prevForm.current!=null){
            if(prevForm.current.id == id){
                prevForm.current.onClose();
                prevForm.current = null;
            }else{
                prevForm.current.onClose();
                prevForm.current = {id,onOpen,onClose}
                onOpen()
            }
        }else{
            prevForm.current = {id,onOpen,onClose}
            onOpen()
        }
    },[])

    return openForm
}



// const CommentsSection: FC<{ isLoading: boolean, items: CommentData[], children?: React.ReactNode }>
const CommentsSection: FC<{ postID:string }>
    = ({postID}) => {
    const {data:authData} = useSelector((state:RootState)=>state.auth)
    const [selectedCommentID, setSelectedCommentID] = useState('');
    // const [buttonsIsLoading, setButtonsIsLoading] = useState(false)

    const onOpenCommentForm = useCallback((id:string)=>{
        setSelectedCommentID(id)
    },[])

    const {loading:isLoading,value:commentsData,error,execute}=useAsync(getPostComments)
    const {loading:buttonsIsLoading,value:newCommentData,error:newCommentError,execute:postComment}=useAsync(createComment,[],false)

    const openGlobalForm = useGlobalForm();

    useEffect(()=>{
        execute(postID).then(res=>console.log(res.count)).catch(err=>alert(err))
    },[])


    const onComment = useCallback(async (text:string,comment?:CommentData)=>{
        if (!authData) return;
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
            comment ? comment.replies.unshift({...newComment,...res}) : commentsData?.comments.unshift({...newComment,...res})
        }).catch(err=>alert(err));


        // return new Promise<void>(resolve=>setTimeout(()=>{setButtonsIsLoading(false);resolve()},5000))
    },[])


    return (
        <SideBlock title={isLoading ? "Загрузка комментариев..." : `Комментарии: ${commentsData?.count}`} >
            {!isLoading &&<AddComment handleOnSubmit={(text)=>onComment(text)} buttonsIsLoading={buttonsIsLoading} />}
            <List sx={{pb:"20px"}}>
                {isLoading ? [...Array(5)].map((obj,index)=><CommentSkeleton key={index}/>)
                :  commentsData?.comments.map((obj, index) => (<Comment key={index} onComment={onComment} buttonsIsLoading={buttonsIsLoading} selectedCommentID={selectedCommentID} setSelectedCommentID={setSelectedCommentID} commentData={obj!} level={0}/>
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