import { createContext, useState } from "react";

export const GlobalContext = createContext()

export const GlobalProvider = ({children}) =>{
    const [isTheme, setIsTheme] = useState(localStorage.getItem("theme") || "cupcake")
    // const [userData, setUserData] = useState(
    //     JSON.parse(localStorage.getItem("user-data")) || null
    //   );
    const [userData, setUserData] = useState(
        JSON.parse(sessionStorage.getItem("user-data")) || null
      );
    return (
        <GlobalContext.Provider value={{isTheme, setIsTheme, userData, setUserData}}>
            {children}
        </GlobalContext.Provider>
    )
}