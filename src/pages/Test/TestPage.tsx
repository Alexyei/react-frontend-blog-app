import {FC, memo, useCallback, useEffect, useMemo, useState} from "react";


const AddReply:FC<{onReply:(text:string)=>void}> =({onReply})=>{

    const [text,setText] = useState('')

    const submitHandler = (e:any)=>{
        e.preventDefault();
        onReply(text)
    }

    return <form onSubmit={submitHandler}>
        <input type={"text"} value={text} onChange={(e)=>setText(e.target.value)}/>
        <button type="submit">Отправить</button>
    </form>
}

const Reply:FC<{reply:IReply,chain:IChain, level:number, onReplyHandler:(text:string,chain?:IChain)=>void}> = ({reply,onReplyHandler,level,chain})=>{

    useEffect(()=>{
        console.log("RENDERED "+reply.text)
    },[])
    const onReply= useCallback((text:string)=>{
        onReplyHandler(text,chain)
    },[])

    // return useMemo(()=>
       return     (<div style={{marginLeft:level*10+"px"}}>
            <p>{reply.text}</p>
            <div style={{marginLeft:(1+level)*10+"px"}}>
                <AddReply onReply={onReply}/>
            </div>
            {
                reply.replies.map(el=><ReplyMemo chain={{reply:el,prev:chain}} key={el.id} reply={el} level={level+1} onReplyHandler={onReplyHandler}/>)
            }
        </div>)

        // ,[reply,reply.replies])

}


const ReplyMemo = memo(Reply,(prev,next)=>{
    console.log(prev.reply.text+" || "+next.reply.text)
    console.log((prev.reply != next.reply))
    console.log((prev.reply.replies != next.reply.replies))
    console.log((prev.reply != next.reply)
        || (prev.reply.replies != next.reply.replies))
    console.log("________________")
    return (prev.reply != next.reply)
        || (prev.reply.replies != next.reply.replies);
})

type IReply = {
    id:string;
    text:string;
    replies:IReply[]
}

type IChain = {
    reply:IReply,
    prev:null|IChain
}


const TestPage:FC = ()=>{
    const [replies,setReplies] = useState<IReply[]>([])


    // const addReply = useCallback((text:string,reply?:IReply)=>{
    //     alert(text)
    //     let newReply = {id:new Date().toISOString(),text:text,replies:[]}
    //     if (reply){
    //         reply.replies = [newReply,...reply.replies]
    //         setReplies(rootReplies=>[...rootReplies])
    //     }
    //     else{
    //         setReplies(rootReplies=>[newReply,...rootReplies])
    //     }
    //     console.log(replies)
    // },[replies])


    const addReplyMemo = useCallback(async (text:string,chain?:IChain)=>{
        let newReply = {id:new Date().toISOString(),text:text,replies:[]}



        if (chain){
            chain.reply.replies = [newReply, ...chain.reply.replies]
            // reply.replies = [newReply,...reply.replies]
            // setReplies(rootReplies=>[...rootReplies])
            console.log("inCHAIN")
            let current = chain.prev;
            while(current){
                console.log("WHILE")
                current.reply.replies = [...current.reply.replies]
                current = current.prev;
            }
            console.log("END")
            setReplies(rootReplies=>[...rootReplies])
        }
        else{
            setReplies(rootReplies=>[newReply,...rootReplies])
            // setChains(prev=>{
            //     return {...prev,[newReply.id]:{reply:newReply,prev:null}}
            // })
        }
        console.log(replies)
    },[replies])


    // const [chains, setChains] = useState<{[key:string]:IChain}>(initStartChains())

    function initStartChains(){
        return replies.reduce((dict,el)=>{
            dict[el.id]={reply:el,prev:null};
            return dict;
            },{} as any)
    }


    // const startChains = useMemo(()=>{
    //     replies.reduce((sum,el)=>sum[el.id]={reply},{})
    // },[replies])

    return (
        <>
            <AddReply onReply={addReplyMemo}/>
            {/*{replies.map(el=><ReplyMemo key={el.id} chain={chains[el.id]} reply={el} level={0} onReplyHandler={addReplyMemo}/>)}*/}
            {replies.map(el=><ReplyMemo key={el.id} chain={{reply:el,prev:null}} reply={el} level={0} onReplyHandler={addReplyMemo}/>)}
        </>
    )
}

export default TestPage;