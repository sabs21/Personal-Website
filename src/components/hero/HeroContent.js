import React from "react";

const quoteIcon = () => {
    return (
        <svg
            className="relative block w-10 h-10 md:w-20 md:h-20 text-redsand-900 dark:text-redsand-50 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
        </svg>
    );
};

const HeroContent = () => {
    return (
        <div className="relative block w-80 md:w-160 h-auto mx-auto rounded-xl backdrop-blur border-4 border-white dark:border-black py-6 px-8 md:px-16">
            <div className="absolute block w-full h-full top-0 left-0 bg-white dark:bg-black opacity-40"></div>
            <div className="absolute bg-white dark:bg-black rounded-full -top-14 -left-14 md:-top-20 md:-left-20 overflow-hidden">
                <img
                    className="relative block w-28 h-28 md:w-40 md:h-40 p-1 rounded-full"
                    src="website-headshot.jpg"
                    alt="Nick wearing ski gear"
                />
            </div>
            <div className="relative flex justify-center items-center w-full h-auto">{quoteIcon()}</div>
            <div className="relative block font-extralight font-body w-full text-xl md:text-3xl text-redsand-900 dark:text-redsand-50">
                The name's
            </div>
            <h1 className="relative block font-bold font-body w-full text-5xl md:text-8xl text-justify whitespace-nowrap text-redsand-900 dark:text-redsand-50">
                NICK SABIA
            </h1>
            <div className="relative block font-extralight font-body w-full text-xl md:text-3xl text-right text-redsand-900 dark:text-redsand-50">
                thanks for dropping by!
            </div>
        </div>
    );
};

export default HeroContent;
