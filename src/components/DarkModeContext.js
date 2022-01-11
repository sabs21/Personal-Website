import { useState, createContext } from 'react'

export const DarkModeContext = createContext();

function DarkModeContextProvider(props) {
    const [darkMode, setDarkMode] = useState(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

    function toggleDarkMode () {
        console.log(localStorage.theme);
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (localStorage.theme === 'dark') {
            document.documentElement.classList.remove('dark');
            localStorage.theme = "light";
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = "dark";
            setDarkMode(true);
        }
    }

    const value = { darkMode, toggleDarkMode };

    return (
        <DarkModeContext.Provider value={value}>
            {props.children}
        </DarkModeContext.Provider>
    )
}

export default DarkModeContextProvider;
