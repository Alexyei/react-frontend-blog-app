import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {status} from "./postReducer";
import $api from "../../api";
import {RootState} from "../index";
import {IFieldLoginValues} from "../../pages/Login/Login";
import {IUser} from "../../components/Post/Post";
import {IFieldSignUpValues} from "../../pages/Registration/Registration";
import {AxiosError} from "axios";

interface AuthState {
    data: null | IUser & {token:string},
    status: status,
    error:string,
}

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params: IFieldLoginValues) => {
    try {
    const {data} = await $api.post<IUser & {token:string}>('/auth/login', params);
        // console.log(data)
        return data;
    }
    catch (err){
        if (!(err instanceof AxiosError))
        return  {error:(err as any).message || ""}
        return {error: err.response?.data.message}
    }
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params:IFieldSignUpValues) => {
    try {
    const {data} = await $api.post<IUser & {token:string}>('/auth/signup', params);
    return data;
    }
    catch (err){
        if (!(err instanceof AxiosError))
            return  {error:(err as any).message || ""}
        return {error: err.response?.data.message}
    }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async (token:string) => {

        const {data} = await $api.get<IUser & { token: string }>('/auth/me', {headers: {"Authorization": `Bearer ${token}`}});
        return data;

});

const initialState: AuthState = {
    data: null,
    status: "loading",
    error: ""
}

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (state) => {
            state.status = 'loading';
            state.data = null;
            state.error = ""

        })
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            state.status = 'success';
            if (!('error' in action.payload))
            state.data = action.payload;
            else state.error = action.payload.error

        })
        builder.addCase(fetchAuth.rejected, (state,action) => {
            state.status = 'error';
            state.data = null;
            state.error = (action.payload as any).error || ""

        })
        builder.addCase(fetchAuthMe.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })
        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.status = 'success';

            state.data = action.payload;
        })
        builder.addCase(fetchAuthMe.rejected, (state,action) => {
            state.status = 'error';
            state.data = null;
        })
        builder.addCase(fetchRegister.pending, (state) => {
            state.status = 'loading';
            state.data = null;
            state.error = "";
        })
        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.status = 'success';
            if (!('error' in action.payload))
                state.data = action.payload;
            else state.error = action.payload.error
        })
        builder.addCase(fetchRegister.rejected, (state,action) => {
            state.status = 'error';
            state.data = null;
            state.error = (action.payload as any).error || ""
        })
    },
})
export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);
export const {logout} = authSlice.actions;

export default authSlice.reducer;