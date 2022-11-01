import {makeRequest} from "./index";

export interface ICommentResponse{
    _id:string,
    author: {
        _id: string,
        login:string,
        avatarUrl?:string
    }
    text:string,
    isDeleted:boolean,
    createdAt:string,
    parent?:string,
    level?:number
    replies:ICommentResponse[]
}

export function getPostComments(postID:string){
    return makeRequest<{comments:ICommentResponse[],count:number}>(`/comments/${postID}`,{method:"GET"})
}

export function createComment(token:string,text:string,owner:string,parent?:string){
    return makeRequest<{_id:string,createdAt:string}>(`/comments`,{method:"POST",headers: {"Authorization": `Bearer ${token}`}, data: {text,owner,parent}})
}