import { useState, useEffect, useMemo } from "react";
import { TaskContext } from "./TaskContext";
import { fetchTask } from "../services/taskServices";
import {format} from 'date-fns';

export function TaskProvider({ children }){
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchTask();
                setTasks(data);
            }catch(err){
                alert(`Error fetching data: ${err}`);
            }
        }

        fetchData();
    }, [])

    const todayTask = useMemo(()=>{
        const today = format(new Date(), 'yyyy-MM-dd');
        
        const filterTask = [...tasks].filter(task => task.task_date === today && !task.task_completed);
        return filterTask.length;
    }, [tasks])

    const upcomingTask = useMemo(()=>{
        const today = format(new Date(),'yyyy-MM-dd');

        const filterTask = [...tasks].filter(task=> task.task_date > today && !task.task_completed)
        return filterTask.length
    }, [tasks]);

    function onUpdateTask(task, isAdd=false, isDelete=false){
        if (isDelete){
            setTasks(prev => prev.filter(t =>  t.task_id !== task.task_id));
        }else{
            isAdd ? setTasks(prev => [...prev, task]):
               setTasks(prev => prev.map(t => t.task_id === task.task_id ? {...t, ...task}: t))
        }
    }

    function onUpdateTagList(tagId, tagDesc='', tagColorCode=''){
        if (tagDesc || tagColorCode){
            setTasks(prevTasks => prevTasks.map(task => {
                return {...task, tags:task.tags.map(tag => tag.tag_id === tagId ? {...tag, 
                        tag_description:tagDesc, tag_color_code:tagColorCode}
                    : tag),};
            }))
        }else{
            setTasks(prevTasks => prevTasks.map(task=>{
                return {...task, tags:task.tags.filter(tag => tag.tag_id !== tagId)}
            }))
        }
    }

    return (
        <TaskContext.Provider value={{ tasks, onUpdateTask, onUpdateTagList, todayTask, upcomingTask}}>
            {children}
        </TaskContext.Provider>
    )
}