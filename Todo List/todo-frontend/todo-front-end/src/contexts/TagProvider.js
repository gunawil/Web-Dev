import { useEffect, useState } from "react";
import { TagContext } from "./TagContext";
import { fetchTag } from "../services/tagService";

export function TagProvider({ children }){
    const [tags, setTags] = useState([]);

    useEffect(()=>{
        async function fetchData() {
            try{
                const data = await fetchTag();

                setTags(data);
            }catch (err){
                alert(`Error fetching data: ${err}`);
            }
        }

        fetchData();
    }, [])

    function onUpdateTag(tag, isAdd=false, isDelete=false){
        if (isDelete){
            setTags(prev => prev.filter(t=> t.tag_id !== tag.tag_id));
        }else{
            isAdd ? setTags(prev => [...prev, tag]):
                    setTags(prev => prev.map(t => t.tag_id === tag.tag_id ? {...t, ...tag}: t))
        }
    }

    return (
        <TagContext.Provider value={{tags, onUpdateTag}}>
            {children}
        </TagContext.Provider>
    )
}