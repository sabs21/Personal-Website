import React from "react";
import Hero from "../components/hero/Hero";
import TextDisplayCard from "../components/TextDisplayCard";
import VideoProject from "../components/VideoProject";
import ImageProject from "../components/ImageProject";
import { Link } from "react-router-dom";
import ReactLogo from "../components/svg/ReactLogo";
import TiltedDivider from "../components/svg/TiltedDivider";
import Trifecta from "../components/svg/Trifecta";
import PHPMySQL from "../components/svg/PHPMySQL";
import Java from "../components/svg/Java";
import NextJS from "../components/svg/NextJS";
import CSharp from "../components/svg/CSharp";
import C from "../components/svg/C";
import ThreeGLSL from "../components/svg/ThreeGLSL";
import NoSQL from "../components/svg/NoSQL";

const Home = () => {
    return (
        <>
            <Hero />
            <div className="-mt-32">
                <div className="relative block w-full h-auto">
                    <TiltedDivider className="relative block fill-current text-fadedsky-50 dark:text-fadedsky-900 w-full" />
                </div>
                <div className="relative block z-10 px-10 md:px-40 py-10 bg-fadedsky-50 dark:bg-fadedsky-900">
                    <h1 className="relative block text-7xl font-display font-bold text-fadedsky-900 dark:text-fadedsky-50">
                        I am a...
                    </h1>
                    <h2 className="relative block text-5xl font-display font-bold text-fadedsky-900 dark:text-fadedsky-50 mt-10 mb-4">
                        Full Stack Web Developer &amp; Software Engineer
                    </h2>
                    <p className="text-lg font-body text-fadedsky-900 dark:text-fadedsky-50">
                        My coding journey began in the field of web development and has since snowballed. I currently
                        have 3 years of web development experience with 2 of those years being in the industry. I've
                        worked on various websites, and nearly all had different tech stacks. This versatility allows me
                        to quickly adjust to the tools I need to best fulfill a project's requirements.
                    </p>
                    <h3 className="relative block text-3xl font-display font-bold text-fadedsky-900 dark:text-fadedsky-50 mt-6 mb-4">
                        Languages &amp; Technologies
                    </h3>
                    <i className="relative block text-lg font-body text-fadedsky-700 dark:text-fadedsky-300 mb-4">
                        Hover over each card to learn more about my proficiencies...
                    </i>
                    <div className="relative flex justify-center lg:justify-around items-center flex-wrap">
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="React"
                                text="I first began using React when I helped work on SplashDash (an analytics tool for marketing agencies) during my time at Develomark. My portfolio website is built using React and is my library of choice."
                            >
                                <ReactLogo clasName="mt-5" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="HTML/CSS/Javascript"
                                text="The classic trifecta. JavaScript was the first language I had ever learned. Before I moved onto any frameworks, I mastered these three things to give me a solid foundation to build upon. I've written websites using the trifecta mostly for experimentation as well as for some assignments."
                            >
                                <Trifecta className="relative block m-auto max-h-80 p-8" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="PHP/MySQL"
                                text="When handling server-side requests on an Apache server, PHP is my go-to purely for its speed. I've used PHP and MySQL to build a search engine + crawler and a task tracking Chrome extension for Develomark. I also made a mock security forum for my Computer Security course using PHP and MySQL."
                            >
                                <PHPMySQL className="relative block m-auto h-80 p-6" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="Java"
                                text="I was taught Java throughout the Computer Science Honors program at CCSU. My most notable Java project was for my Design Patterns course where I worked with 2 others to build a discord racing bot. The bot allows you to race other people in the server and lets you buy, upgrade, and repair cars."
                            >
                                <Java className="p-10 w-full h-full" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="Next.JS"
                                text="The team I was on used Next.JS when working on a volunteer management system for Kevin's Community Center. On top of having many shortcuts (like routing pages using a folder structure), Next.JS offered a gentle introduction into React style development which kept team velocity high."
                            >
                                <NextJS className="p-14" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="NoSQL"
                                text="My software engineering team used Firebase to store events and user data for Kevin's Community Center's volunteer management system. For the discord racing bot, we used MongoDB to allow for flexibility throughout the project, especially during the early stages of anarchy."
                            >
                                <NoSQL className="p-8 mt-4" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="C#"
                                text="For my Game Development course, I worked with 3 others to create a game in Unity (which uses C# for scripting). The game we created is a rougelike called Planetary Doom and can be found on itch.io. I wrote the final boss and upgrade system logic for the game."
                            >
                                <CSharp className="p-24 -mt-10" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="Three.JS/GLSL"
                                text="I recreated a scene on the docks of Nantucket based on the memories I had there. I had to make custom shaders with GLSL for the flame in the hurricane lantern. The rest was a lot of modelling and texturing using Blender."
                            >
                                <ThreeGLSL className="p-8 -mt-6" />
                            </TextDisplayCard>
                        </span>
                        <span
                            className="relative flex-1 h-auto max-w-sm rounded-xl mb-6 shadow-md"
                            style={{ minWidth: "24rem" }}
                        >
                            <TextDisplayCard
                                title="C"
                                text="For my Systems Programming course, I recreated snake in C using the ncurses library for graphics."
                            >
                                <C className="p-24 -mt-10" />
                            </TextDisplayCard>
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative block z-10 px-10 md:px-40 py-10 mb-20 bg-fadedsky-50 dark:bg-fadedsky-900">
                <h1 className="relative block text-7xl font-display font-bold text-fadedsky-900 dark:text-fadedsky-50">
                    Projects
                </h1>
                <VideoProject
                    number="01."
                    src="media/Kcc_Demo_Final.webm"
                    title="Kevin's Community Center"
                    text="The team I was on used Next.JS when working on a volunteer management system for Kevin's Community Center. On top of having many shortcuts (like routing pages using a folder structure), Next.JS offered a gentle introduction into React style development which kept team velocity high."
                />
                <ImageProject
                    number="02."
                    src="sunset.jpg"
                    alt="Preview of the Nantucket sunset scene I created in Three.JS"
                    title="Nantucket Sunset"
                    text="When I was in high school, I would go up to Cape Cod with my mom and best friend to soak in the nautical atmosphere. Nantucket was just a ferry ride away, so one time we decided to visit and roam around the island. After a day of art gallaries, traversing the small windy roads, and endulging in lobster, we were walking back to the ferry to head back to Hyannis when I saw this gorgeous sunset over the docks. This sunset is forever locked in my mind, one which takes me back to Nantucket and high school in general whenever I think of it. As for what I used to make this, I used Three.JS and used glsl/webgl to create shaders for the hurricane lantern. This scene was originally going to be the homepage for my website, but I decided to go this route instead."
                >
                    <Link to="/sunset">
                        <button className="relative flex justify-center mt-8 mb-6 float-right items-center w-48 h-16 bg-redsand-600 hover:bg-redsand-800 text-white font-display font-bold text-xl rounded-md shadow-md">
                            See the Sunset
                        </button>
                    </Link>
                </ImageProject>
                <ImageProject
                    number="03."
                    src="planetary_doom.jpg"
                    alt="Preview of Planetary Doom, a game me and three others built using Unity"
                    title="Planetary Doom"
                    text="Planetary Doom is a 2D roguelike where you're a ship whose purpose is to save earth from incoming threats. Use scrap from fallen enemies to improve your ship's systems and face larger onslaughts of asteroids and enemy ships. This project was completed in a month using both agile practices and Unity. The team consisted of myself and three others."
                >
                    <a href="https://maciox55.itch.io/planetary-doom" target="_blank">
                        <button className="relative flex justify-center mt-8 mb-6 float-right items-center w-48 h-16 bg-redsand-600 hover:bg-redsand-800 text-white font-display font-bold text-xl rounded-md shadow-md">
                            Play the Game
                        </button>
                    </a>
                </ImageProject>
                <VideoProject
                    number="04."
                    src="media/Forum_492_Final.webm"
                    title="Forum 492"
                    text="I created this forum as my final project in my Computer Security course. Everything was made from scratch to allow myself to fully understand how to make a secure login system, so no libraries or npm packages here. Throughout the project, I explored how to avoid common web security issues such as Cross Site Scripting (XSS) and SQL Injection. I also familiarized myself with security concepts like intrusion detection, secure protocols, and public key cryptography as well as respected security info sources such as OWASP and Talos."
                />
                <VideoProject
                    number="05."
                    src="media/Search_Engine_Demo_Final.webm"
                    title="Duda Search Engine"
                    text="I built a crawler to populate a database full of info which the search functionality could then use to effectively search the database. The backend of the crawler and search capabilities were built using PHP and a MySQL database while the front end was built using HTML/CSS/Javascript. The crawler detects paragraphs and relates each paragraph to its respective header text, then stores what it finds into the database. Also, the crawler makes note of every single word it comes across and how many times it gets repeated in a page. This is done to guage how related a certain page is to the search query in a simple way and also doubles as a way to spell check the user without the need of a dictionary. The search functionality will also generate suggestions based off of previously searched searches made by other users. This search engine was built to crawl and work with Duda built websites only and I am the sole developer of the engine."
                />
            </div>
        </>
    );
};

export default Home;
