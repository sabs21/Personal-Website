import {
    React,
    useState
} from 'react'

const sunIcon = () => {
    return (
        <svg className="text-gray-100 fill-current" enableBackground="new 0 0 45.16 45.16" version="1.1" viewBox="0 0 45.16 45.16" xmlns="http://www.w3.org/2000/svg">
            <path d="m22.58 11.269c-6.237 0-11.311 5.075-11.311 11.312s5.074 11.312 11.311 11.312c6.236 0 11.311-5.074 11.311-11.312s-5.075-11.312-11.311-11.312z"/>
            <path d="m22.58 7.944c-1.219 0-2.207-0.988-2.207-2.206v-3.531c0-1.219 0.988-2.207 2.207-2.207s2.207 0.988 2.207 2.207v3.531c0 1.218-0.989 2.206-2.207 2.206z"/>
            <path d="m22.58 37.215c-1.219 0-2.207 0.988-2.207 2.207v3.53c0 1.22 0.988 2.208 2.207 2.208s2.207-0.988 2.207-2.208v-3.53c0-1.219-0.989-2.207-2.207-2.207z"/>
            <path d="m32.928 12.231c-0.861-0.862-0.861-2.259 0-3.121l2.497-2.497c0.861-0.861 2.259-0.861 3.121 0 0.862 0.862 0.862 2.26 0 3.121l-2.497 2.497c-0.861 0.862-2.258 0.862-3.121 0z"/>
            <path d="m12.231 32.93c-0.862-0.863-2.259-0.863-3.121 0l-2.497 2.496c-0.861 0.861-0.862 2.26 0 3.121s2.26 0.861 3.121 0l2.497-2.498c0.862-0.861 0.862-2.259 0-3.119z"/>
            <path d="m37.215 22.58c0-1.219 0.988-2.207 2.207-2.207h3.531c1.219 0 2.207 0.988 2.207 2.207s-0.988 2.206-2.207 2.206h-3.531c-1.219 0-2.207-0.987-2.207-2.206z"/>
            <path d="m7.944 22.58c0-1.219-0.988-2.207-2.207-2.207h-3.53c-1.219 0-2.207 0.988-2.207 2.207s0.988 2.206 2.207 2.206h3.531c1.218 0 2.206-0.987 2.206-2.206z"/>
            <path d="m32.928 32.93c0.862-0.861 2.26-0.861 3.121 0l2.497 2.497c0.862 0.86 0.862 2.259 0 3.12s-2.259 0.861-3.121 0l-2.497-2.497c-0.862-0.862-0.862-2.259 0-3.12z"/>
            <path d="m12.231 12.231c0.862-0.862 0.862-2.259 0-3.121l-2.497-2.496c-0.862-0.862-2.259-0.862-3.121 0-0.862 0.861-0.862 2.259 0 3.12l2.497 2.497c0.862 0.863 2.259 0.863 3.121 0z"/>
        </svg>
    );
}

const moonIcon = () => {
    return (
        <svg className="text-gray-900 fill-current" enable-background="new 0 0 45.16 45.16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
    );
}

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

    const handleClick = () => {
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

    return (
        <button onClick={handleClick} className="relative block w-10 h-10 p-2">
            {darkMode ? sunIcon() : moonIcon()}
        </button>
    )
}

export default DarkModeToggle
