import { createContext } from "react";

export const CategoryContext = createContext({
    categories: [],
    onUpdateCategories: () => {},
    top3Categories: [],
})