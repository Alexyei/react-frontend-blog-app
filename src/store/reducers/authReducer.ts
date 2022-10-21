import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {status} from "./postReducer";
import $api from "../../api";
import {RootState} from "../index";
import {IFieldLoginValues} from "../../pages/Login/Login";
import {IUser} from "../../components/Post/Post";
import {IFieldSignUpValues} from "../../pages/Registration/Registration";

interface AuthState {
    data: null | IUser & {token:string},
    status: status
}

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params: IFieldLoginValues) => {
    const {data} = await $api.post<IUser & {token:string}>('/auth/login', params);
    return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params:IFieldSignUpValues) => {
    const {data} = await $api.post<IUser & {token:string}>('/auth/signup', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const {data} = await $api.get<IUser & {token:string}>('/auth/me');
    return data;
});

const initialState: AuthState = {
    data: null,
    status: "loading",
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
        })
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        })
        builder.addCase(fetchAuth.rejected, (state) => {
            state.status = 'error';
            state.data = null;
        })
        builder.addCase(fetchAuthMe.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })
        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        })
        builder.addCase(fetchAuthMe.rejected, (state) => {
            state.status = 'error';
            state.data = null;
        })
        builder.addCase(fetchRegister.pending, (state) => {
            state.status = 'loading';
            state.data = null;
        })
        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload;
        })
        builder.addCase(fetchRegister.rejected, (state) => {
            state.status = 'error';
            state.data = null;
        })
    },
})
export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);
export const {logout} = authSlice.actions;

export default authSlice.reducer;