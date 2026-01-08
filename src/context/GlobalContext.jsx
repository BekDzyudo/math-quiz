import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext()

export const GlobalProvider = ({children}) =>{
    const [isTheme, setIsTheme] = useState(localStorage.getItem("theme") || "cupcake")
    const [activeModal, setActiveModal] = useState(false)
    const [result, setResult] = useState(null)
    
    // userData - sessionStorage'dan olish va saqrash
    const [userData, setUserData] = useState(() => {
        try {
            const saved = sessionStorage.getItem("user-data");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('❌ Error loading user data from sessionStorage:', error);
            return null;
        }
    });

    // userData o'zgarganda sessionStorage'ga saqlash
    useEffect(() => {
        if (userData) {
            try {
                sessionStorage.setItem("user-data", JSON.stringify(userData));
                console.log('💾 User data saved to sessionStorage:', userData);
            } catch (error) {
                console.error('❌ Error saving user data to sessionStorage:', error);
            }
        }
    }, [userData]);
    
    return (
        <GlobalContext.Provider value={{isTheme, setIsTheme, userData, setUserData, setActiveModal, activeModal, result, setResult}}>
            {children}
        </GlobalContext.Provider>
    )
}