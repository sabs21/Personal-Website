import React from "react";
import LinkedInLogo from "../components/svg/LinkedInLogo";
import GitHubLogo from "../components/svg/GitHubLogo";
import Mail from "../components/svg/Mail";
import TiltedDivider from "../components/svg/TiltedDivider";
import BiggerGear from "../components/svg/BiggerGear";
import SmallerGear from "../components/svg/SmallerGear";

const Footer = () => {
    return (
        <div className="overflow-hidden">
            <TiltedDivider className="relative block fill-current text-fadedsky-300 dark:text-fadedsky-700 w-full -scale-x-100 -mb-0.5" />
            <div className="relative flex flex-col md:flex-row justify-between items-center px-10 md:px-40 pt-12 pb-16 h-auto bg-fadedsky-300 dark:bg-fadedsky-700">
                <div className="absolute block text-fadedsky-100 dark:text-fadedsky-800 top-5 -left-16">
                    <BiggerGear className="absolute top-5 left-3 w-72 h-72 fill-current animate-reverse-spin-very-slow" />
                    <SmallerGear className="absolute top-0 left-56 w-40 h-40 fill-current animate-spin-slow" />
                </div>
                <h1 className="relative block text-4xl md:text-7xl w-full text-center md:text-left md:w-auto font-display font-bold text-fadedsky-900 dark:text-fadedsky-50">
                    Let's Build Something.
                </h1>
                <div className="relative flex h-16 justify-end items-center">
                    <a
                        className="relative w-16 h-16 rounded-2xl bg-redsand-400 dark:bg-redsand-200 hover:bg-redsand-600 hover:dark:bg-redsand-400 transition-colors"
                        href="https://www.linkedin.com/in/nick-sabia-252a22224/"
                    >
                        <LinkedInLogo className="fill-fadedsky-300 dark:fill-fadedsky-700" />
                    </a>
                    <a
                        className="relative w-16 h-16 ml-4 rounded-2xl bg-redsand-400 dark:bg-redsand-200 hover:bg-redsand-600 hover:dark:bg-redsand-400 transition-colors"
                        href="https://github.com/sabs21"
                    >
                        <GitHubLogo className="fill-fadedsky-300 dark:fill-fadedsky-700 p-2" />
                    </a>
                    <a
                        className="relative w-16 h-16 ml-4 rounded-2xl bg-redsand-400 dark:bg-redsand-200 hover:bg-redsand-600 hover:dark:bg-redsand-400 transition-colors"
                        href="mailto:sabian@my.ccsu.edu"
                    >
                        <Mail className="fill-fadedsky-300 dark:fill-fadedsky-700 p-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
