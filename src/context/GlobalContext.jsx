import { createContext, useState } from "react";

export const GlobalContext = createContext()

export const GlobalProvider = ({children}) =>{
    const [isTheme, setIsTheme] = useState(localStorage.getItem("theme") || "cupcake")
    return (
        <GlobalContext.Provider value={{isTheme, setIsTheme}}>
            {children}
        </GlobalContext.Provider>
    )
}