import { useState, useEffect, useMemo } from "react";
import { CategoryContext } from "./CategoryContext";
import { fetchCategories } from "../services/categoryServices";

export function CategoryProvider({ children }){
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try{
                const data = await fetchCategories();
                setCategories(data);
            }catch(err){
                alert(`Error fetching data: ${err}`);
            }
        }
    
        fetchData();
    }, []);

    const top3Categories = useMemo(()=>{
        return [...categories].sort((a, b) => b.task_count - a.task_count).slice(0,3);
    }, [categories]);

    function onUpdateCategories(category, isAdd=false){    
        isAdd ? setCategories(prev => [...prev, category]) : 
            setCategories(prev => prev.map(cat => 
                cat.category_id === category.category_id ? {...cat, ...category}: cat));
    }

    function onUpdateTaskCount(triggerMethod='ADD', taskArray){
        const data = {
            'category_id': taskArray.category_id,
            'old_category_id': taskArray.old_category_id,
        }

        switch (triggerMethod) {
            case "ADD":
                setCategories(prev => prev.map(cat => 
                    cat.category_id === data.category_id ? {...cat, 'task_count': cat.task_count + 1}: cat));
                break;
            case "EDIT":
                const newCategoryId = Number(data.category_id);
                const oldCategoryId = Number(data.old_category_id);
                if (oldCategoryId && oldCategoryId !== newCategoryId){
                    setCategories(prev => prev.map(cat =>{
                        if (cat.category_id === oldCategoryId){
                            return {...cat, 'task_count': cat.task_count - 1};
                        } else if (cat.category_id === newCategoryId){
                            return {...cat, 'task_count': cat.task_count + 1};
                        } else{return cat};
                    }))
                }
                break;
            case "DELETE":
                setCategories(prev => prev.map(cat=>
                    cat.category_id === data.category_id ? {...cat, 'task_count': cat.task_count - 1}: cat
                ));
                break;
            default:
                break;
        }
    }

    return (
        <CategoryContext.Provider value={{ categories, onUpdateCategories, onUpdateTaskCount, top3Categories}}>
            {children}
        </CategoryContext.Provider>
    );
}