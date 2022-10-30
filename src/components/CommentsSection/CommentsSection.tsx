import React, {FC} from "react";
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

type CommentData = {
    user: IUser, text: string,
    replies: CommentData[]
}

const CommentSkeleton:FC = ()=>{
    return (
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
    )
}

const Comment:FC<{commentData: CommentData, level: number}> = ({commentData,level})=>{
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
        <ListItemButton onClick={handleClick} sx={{pl: level ? 16+(16 * level)+'px' : '16px'}} alignItems="center">
            <ListItemAvatar>
            <Avatar alt={commentData.user.login} src={commentData?.user.avatarUrl || "/noavatar.png"}/>
            </ListItemAvatar>
            <ListItemText
                primary={commentData?.user.login}
                secondary={commentData?.text}
            />
            {commentData.replies.length > 0 && (open ?
                <ExpandLess sx={{fontSize: "2rem", color: "#b8b8b8"}}/> :
                <ExpandMore sx={{fontSize: "2rem", color: "#b8b8b8"}}/>)}

        </ListItemButton>
            <Link disabled={false} sx={{ pl: level ? 16 * level + 72+'px' : '72px',}} onClick={(e) => {console.info("I'm a button.");}} component="button" variant={"button"} underline="none">Ответить</Link>

            <Divider sx={{ml: level ? 72+(16 * level)+'px' : '72px'}} variant="inset" component="li"/>
            <Collapse in={open} timeout="auto">
                {
                    commentData?.replies.map((obj, index) => {
                        return (<CommentElement key={index} commentData={obj} isLoading={false} level={level + 1}/>)
                    })
                }
            </Collapse>
        </>
    )
}

const CommentElement: FC<{ isLoading: boolean, commentData?: CommentData, level?: number }> = ({
                                                                                                   isLoading,
                                                                                                   commentData,
                                                                                                   level = 0
                                                                                               }) => {




    return (
        <React.Fragment>
            {isLoading ? <CommentSkeleton/> : <Comment commentData={commentData!} level={level}/>}
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

const CommentsSection: FC<{ isLoading: boolean, items: CommentData[], children?: React.ReactNode }> = ({
                                                                                                           items,
                                                                                                           children,
                                                                                                           isLoading = true
                                                                                                       }) => {
    return (
        <SideBlock title="Комментарии">
            <List>
                {(isLoading ? [...Array(5)] : items).map((obj: typeof items[number] | undefined, index) => (
                    <CommentElement key={index} commentData={obj} isLoading={isLoading}/>))}
            </List>
            {children}
        </SideBlock>
    );
};

export default CommentsSection;