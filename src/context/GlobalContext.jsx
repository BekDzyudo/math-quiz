import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext()

export const GlobalProvider = ({children}) =>{
    const [isTheme, setIsTheme] = useState(localStorage.getItem("theme") || "cupcake")
    const [activeModal, setActiveModal] = useState(false)
    const [result, setResult] = useState(null)
    
    // userData - localStorage'dan olish va saqlash (sessionStorage o'rniga)
    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem("user-data");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('❌ Error loading user data from localStorage:', error);
            return null;
        }
    });

    // userData o'zgarganda localStorage'ga saqlash
    useEffect(() => {
        if (userData) {
            try {
                localStorage.setItem("user-data", JSON.stringify(userData));
                console.log('💾 User data saved to localStorage:', userData);
            } catch (error) {
                console.error('❌ Error saving user data to localStorage:', error);
            }
        } else {
            // userData null bo'lsa, localStorage'dan o'chirish (logout)
            localStorage.removeItem("user-data");
        }
    }, [userData]);
    
    return (
        <GlobalContext.Provider value={{isTheme, setIsTheme, userData, setUserData, setActiveModal, activeModal, result, setResult}}>
            {children}
        </GlobalContext.Provider>
    )
}