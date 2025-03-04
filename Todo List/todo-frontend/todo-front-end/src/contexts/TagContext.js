import { createContext } from "react";

export const TagContext = createContext({
    tags: [],
    onUpdateTag: () => {},
})