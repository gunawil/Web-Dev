import { createContext } from "react";

export const TaskContext = createContext({
    tasks: [],
    onUpdateTask: () =>{},
    onUpdateTagList: () =>{},
    todayTask: 0,
    upcomingTask: 0,
})