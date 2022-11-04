import {useCallback, useEffect, useState} from "react";

export function useAsync<ValueType, ErrorType>(callback:(...params:any[])=>Promise<ValueType>, dependencies:any[] = [],loadingDefault=true){
    const [loading, setLoading] = useState(loadingDefault);
    const [value,setValue] = useState<ValueType | null>(null)
    const [error,setError] = useState<ErrorType | null>(null)


    const memorizedCallback = useCallback((...params:any[])=>{
        setLoading(true);
        setValue(null);
        setError(null)

        return callback(...params)
            .then(value=>{setValue(value); return value})
            .catch(error=>{setError(error);return Promise.reject(error)})
            .finally(()=>setLoading(false))
    },dependencies)

    // useEffect(()=>{
    //     memorizedCallback()
    // },[memorizedCallback])

    return {loading,error,value,setValue,execute:memorizedCallback};
}