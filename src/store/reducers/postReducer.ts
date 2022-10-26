import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import $api from "../../api";

export const fetchPosts = createAsyncThunk('posts/fetchPosts',async()=>{
    const {data} = await $api.get('/posts')

    return data as IPost[];
})

export const fetchTags = createAsyncThunk('posts/fetchTags',async()=>{
    const {data} = await $api.get('/posts/tags')

    return data as string[];
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (arg:{id:string,token:string}) => {
    return $api.delete<{id:string}>(`/posts/${arg.id}`, {headers: {"Authorization": `Bearer ${arg.token}`}})
});

export interface IUser{
    id:string,
    login:string,
    avatarUrl?:string
}

export interface IPost{
    id:string,
    createdAt:string,
    viewsCount:number,
    imageUrl?:string,
    text:string,
    title:string,
    tags:string[]
    user:IUser
}

export type status = "loading" | "success" | "error";

type PostState = {posts: {items:IPost[],status:status},tags: {items:string[],status:status}}

const initialState: PostState = {
    posts: {
        items: [],
        status: "loading"
    },
    tags: {
        items: [],
        status: "loading"
    }
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},

    //асинхронный код
    extraReducers: (builder)=>{
        builder.addCase(fetchPosts.pending, (state,action)=>{
            state.posts.items = [];
            state.posts.status = "loading"
        })
        builder.addCase(fetchPosts.fulfilled, (state,action)=>{
            state.posts.items = action.payload;
            state.posts.status = "success"
        })
        builder.addCase(fetchPosts.rejected, (state,action)=>{
            state.posts.items = [];
            state.posts.status = "error"
        })

        builder.addCase(fetchTags.pending, (state,action)=>{
            state.tags.items = [];
            state.tags.status = "loading"
        })
        builder.addCase(fetchTags.fulfilled, (state,action)=>{
            state.tags.items = action.payload;
            state.tags.status = "success"
        })
        builder.addCase(fetchTags.rejected, (state,action)=>{
            state.tags.items = [];
            state.tags.status = "error"
        })

        builder.addCase(fetchRemovePost.pending, (state,action)=>{
            state.posts.items = state.posts.items.filter((obj) => obj.id !== action.meta.arg.id);
        })
    }
})

export default postSlice.reducer;