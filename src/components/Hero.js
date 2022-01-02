import { useState, useEffect, useRef, useContext } from "react";
import Scroller from "../components/Scroller";
import { DarkModeContext } from "../components/DarkModeContext";

const Hero = () => {
    const { darkMode } = useContext(DarkModeContext);
    const navBarOffset = 80; // the height of the nav bar
    const [containerHeight, setContainerHeight] = useState(window.innerHeight - navBarOffset);
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
            transform: `rotate(-20deg) translate(-75px, -500px)`,
            width: "120%",
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
                style={{ transform: "rotate(-20deg) translate(-75px, -500px)", width: "120%" }}
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
    );
};

export default Hero;
