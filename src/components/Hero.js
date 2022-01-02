import { useState, useEffect, useRef, useContext } from "react";
import Scroller from "../components/Scroller";
import { DarkModeContext } from "../components/DarkModeContext";

const Hero = () => {
    const { darkMode } = useContext(DarkModeContext);
    const navBarOffset = 80; // the height of the nav bar
    let bodyHeight = window.innerHeight - navBarOffset;
    let minHeight = 400;
    const [containerHeight, setContainerHeight] = useState(bodyHeight > minHeight ? bodyHeight : minHeight);
    const [itemHeight, setItemHeight] = useState(0);
    const containerRef = useRef(null);
    const itemRef = useRef(null);

    const addScroller = (key, style, reverse = false) => {
        return (
            <div key={key} className="relative h-28" style={style}>
                <Scroller gap={10} speed={1} reverse={reverse}>
                    <span className="relative inline-block text-redsand-400 dark:text-redsand-600 w-auto h-auto text-9xl font-display font-black pointer-events-none">
                        SABIA
                    </span>
                    <span
                        className={`${
                            darkMode ? "outlinedTextDark" : "outlinedText"
                        } relative inline-block text-redsand-500 w-auto h-auto text-9xl font-display font-black pointer-events-none`}
                        style={{ transform: "rotate(180deg) translateY(11px)" }}
                    >
                        SABIA
                    </span>
                </Scroller>
            </div>
        );
    };

    // Calculates how many rows are just enough to fill the container. This does not take into consideration any rotations applied.
    const findOptimalAmountOfRows = (containerHeight, itemHeight) => {
        if (containerHeight <= 0 || itemHeight <= 0) {
            console.warn("Unable to find optimal amount of rows to add. Either containerHeight = 0 or itemHeight = 0.");
            return 0;
        }
        //console.log("containerHeight", containerHeight);
        //console.log("itemHeight", itemHeight);

        let rows = 0;
        for (let availableHeight = containerHeight; availableHeight > 0; availableHeight -= itemHeight) {
            rows++;
        }
        //console.log("rows", rows);
        return rows;
    };

    // Add as many scrollers as can fit into the containing element
    const appendScrollers = (containerHeight, itemHeight, extra = 0) => {
        let elements = [];
        let scrollerStyle = {
            transform: `rotate(-20deg) translate(-75px, -600px)`,
            width: "200%",
        };
        let key = 1; // NOTE: Key "starts" at 1 here since there is already an element which will begin with key 0.
        for (let totalRows = findOptimalAmountOfRows(containerHeight, itemHeight) + extra; key <= totalRows; key++) {
            elements.push(addScroller(key, scrollerStyle, key % 2 !== 0));
        }

        return elements;
    };

    // Handle calculation of heights upon load and upon resizing
    useEffect(() => {
        // Set initial widths
        setContainerHeight(containerRef.current.offsetHeight);
        setItemHeight(itemRef.current.offsetHeight);
        //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
        //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);

        // On resize, recalculate width
        window.addEventListener("resize", (e) => {
            setContainerHeight(containerRef.current.offsetHeight);
            setItemHeight(itemRef.current.offsetHeight);
            //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
            //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);
        });
    }, []); //empty dependency array so it only runs once at render

    return (
        <>
            <div
                style={{ height: `${containerHeight}px` }}
                ref={containerRef}
                className="relative block bg-redsand-500 overflow-hidden"
            >
                <style>{`
                    .outlinedText {
                        -webkit-text-stroke: 2px #CC7568;
                        -webkit-font-smoothing: antialiased;
                    }
                    .outlinedTextDark {
                        -webkit-text-stroke: 2px #953F33;
                        -webkit-font-smoothing: antialiased;
                    }
                `}</style>
                <div
                    className="relative w-full h-28"
                    ref={itemRef}
                    style={{ transform: "rotate(-20deg) translate(-75px, -600px)", width: "200%" }}
                >
                    <Scroller gap={10} speed={1}>
                        <span className="relative inline-block text-redsand-400 dark:text-redsand-600 w-auto h-auto text-9xl font-display font-black pointer-events-none">
                            SABIA
                        </span>
                        <span
                            className={`${
                                darkMode ? "outlinedTextDark" : "outlinedText"
                            } relative inline-block text-redsand-500 w-auto h-auto text-9xl font-display font-black pointer-events-none`}
                            style={{ transform: "rotate(180deg) translateY(11px)" }}
                        >
                            SABIA
                        </span>
                    </Scroller>
                </div>
                {appendScrollers(containerHeight, itemHeight, 7)}
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
