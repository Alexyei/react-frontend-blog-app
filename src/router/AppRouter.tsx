import {FC} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {publicRoutes} from "./routes";

export const AppRouter:FC = ()=>{
    return (
        <Routes>
            {publicRoutes.map((el)=><Route key={el.path} path={el.path} element={el.element}/>)}
        </Routes>
    )
}

export const Links:FC = ()=>{
    return (
        <>
            {publicRoutes.filter((el)=>el.linkName!=undefined).map((el)=><Link key={el.path} to={el.path}>{el.linkName}</Link>)}
        </>
    )
}
