import { useState } from "react";

const TextDisplayCard = ({ children, title, text }) => {
    const [hovered, setHovered] = useState(false);
    const handleHover = () => {
        setHovered(true);
    };
    const handleLeave = () => {
        setHovered(false);
    };
    const handleClick = () => {
        setHovered(!hovered);
    };

    return (
        <span onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClick}>
            <div className="relative w-full h-auto p-2 text-center text-2xl font-display font-medium z-10 bg-fadedsky-900 dark:bg-fadedsky-100 dark:text-fadedsky-900 text-fadedsky-100 rounded-t-xl">
                {title}
            </div>
            <div className="w-full h-80 border-4 border-t-0 border-fadedsky-900 dark:border-fadedsky-50 overflow-hidden rounded-b-xl">
                {children}
                <div
                    className={`absolute ${
                        hovered ? "opacity-90" : "opacity-0"
                    } z-0 h-80 mt-10 top-1 left-1 right-1 bottom-1 dark:bg-fadedsky-900 bg-fadedsky-50 transition-opacity rounded-xl`}
                ></div>
                <p
                    className={`absolute ${
                        hovered ? "opacity-100" : "opacity-0"
                    } z-0 text-fadedsky-900 dark:text-fadedsky-50 top-0 left-0 w-full h-80 mt-11 py-6 px-6 transition-opacity text-lg overflow-auto`}
                >
                    {text}
                </p>
            </div>
        </span>
    );
};

export default TextDisplayCard;
