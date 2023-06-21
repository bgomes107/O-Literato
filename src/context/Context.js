import { createContext, useState, useEffect } from "react";
import AS_THEME from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({});

export const ContextProvider = ({ children }) => {

    const [theme, setTheme] = useState(false);

    // renderiza o valor do state
    useEffect(() => {
        const renderTheme = async () => {

            const values = await AS_THEME.getItem('@Theme');
            if (values !== null) {
                setTheme(JSON.parse(values));
            }

            console.log(values);
        }
        renderTheme();
    }, []);


    return (
      
            <ThemeContext.Provider value={{ theme, setTheme }}>
                {children}
            </ThemeContext.Provider>

    );
};