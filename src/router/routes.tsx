import AddPost from "../pages/AddPost/AddPost";
import FullPost from "../pages/FullPost/FullPost";
import Home from "../pages/Home/Home";
import Registration from "../pages/Registration/Registration";
import Login from "../pages/Login/Login";
import TagPage from "../pages/Tag/Tag";


export const publicRoutes= [
    {path: '/',element:(<Home/>),linkName:'home'},
    {path: '/posts/:id',element:(<FullPost/>),linkName:'post'},
    {path: '/add-post',element:(<AddPost/>),linkName:'new-post'},
    {path: '/posts/:id/edit',element:(<AddPost/>),linkName:'edit-post'},
    {path: '/login',element:(<Login/>),linkName:'login'},
    {path: '/signup',element:(<Registration/>),linkName:'signup'},
    {path:'/tag/:name',element:(<TagPage/>),linkName: 'by-tag'},



    {path: '*',element:(<div>404 NOT FOUND</div>)}
]
