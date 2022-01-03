import { useState, useEffect, useRef, useContext } from "react";
import Scroller from "../Scroller";
import { DarkModeContext } from "../DarkModeContext";
import Backdrop from "./Backdrop.js";

const Hero = () => {
    const { darkMode } = useContext(DarkModeContext);
    const navBarOffset = 80; // the height of the nav bar
    let bodyHeight = window.innerHeight - navBarOffset;
    let minHeight = 400;
    const [containerHeight, setContainerHeight] = useState(bodyHeight > minHeight ? bodyHeight : minHeight);
    const containerRef = useRef(null);

    // Handle calculation of heights upon load and upon resizing
    useEffect(() => {
        if (containerHeight > 0) {
            // Set initial widths
            setContainerHeight(containerRef.current.offsetHeight);
            //setItemHeight(itemRef.current.offsetHeight);
            //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
            //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);

            // On resize, recalculate width
            window.addEventListener("resize", (e) => {
                setContainerHeight(containerRef.current.offsetHeight);
                //setItemHeight(itemRef.current.offsetHeight);
                //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
                //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);
            });
        }
    }, []); //empty dependency array so it only runs once at render

    return (
        <>
            <div
                style={{ height: `${containerHeight}px` }}
                ref={containerRef}
                className="relative block bg-redsand-500 overflow-hidden"
            >
                <Backdrop containerHeight={containerHeight} text={"SABIA"} />
            </div>
            <div
                className="absolute block w-full min-h-40 max-h-80"
                style={{
                    height: `${containerHeight / 2}px`,
                    top: `${containerHeight / 6 + 160}px`,
                }}
            >
                <div className="relative block w-1/2 h-auto mx-auto rounded-xl backdrop-blur border-4 border-white dark:border-black py-6 px-16">
                    <div className="absolute block w-full h-full top-0 left-0 bg-white opacity-40"></div>
                    <div className="absolute bg-white dark:bg-black w-40 h-40 rounded-full -top-20 -left-20 overflow-hidden p-1">
                        <img className="relative block w-full h-full rounded-full" src="website-headshot.jpg" />
                    </div>
                    <span className="relative inline-block w-full text-8xl font-display font-extralight text-center">
                        I'm <h1 className="relatie inline-block font-bold">Nick Sabia</h1>
                    </span>
                    <div className="relative block h-0.5 w-full bg-white my-6"></div>
                    <div className="relative w-full text-4xl font-body">
                        <h2>Full Stack Web Developer</h2>
                        <h2>Software Engineer</h2>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
