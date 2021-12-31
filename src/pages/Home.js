import { useState, useEffect, useRef, useContext } from "react";
import Scroller from "../components/Scroller";
import { DarkModeContext } from "../components/DarkModeContext";

const Home = () => {
    const { darkMode } = useContext(DarkModeContext);
    const navBarOffset = 80; // the height of the nav bar
    const [containerHeight, setContainerHeight] = useState(window.innerHeight - navBarOffset);
    const [itemHeight, setItemHeight] = useState(0);
    const containerRef = useRef(null);
    const itemRef = useRef(null);

    const addScroller = (key, reverse) => {
        return (
            <div key={key} className="relative w-full h-28">
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

    // Add as many scrollers as can fit into the containing element
    const appendScrollers = () => {
        if (containerHeight <= 0 || itemHeight <= 0) {
            console.warn("Unable to add scrollers. Either containerHeight = 0 or itemHeight = 0.");
            return;
        }

        let elements = [];
        let key = 1; // NOTE: Key "starts" at 1 here since there is already an element which will begin with key 0.
        // Populate scroller with as many items as will fit (and then two more).
        // We subtract one from the available width right away since there will always be at least one item in the scroller.
        for (let availableHeight = containerHeight - itemHeight; availableHeight > 0; availableHeight -= itemHeight) {
            console.log("availableHeight", availableHeight);
            elements[key] = addScroller(key, key % 2 === 0);
            key++;
        }

        return elements;
    };

    // Handle calculation of heights upon load and upon resizing
    useEffect(() => {
        // Set initial widths
        setContainerHeight(containerRef.current.getBoundingClientRect().height);
        setItemHeight(itemRef.current.getBoundingClientRect().height);

        // On resize, recalculate width
        window.addEventListener("resize", (e) => {
            setContainerHeight(containerRef.current.getBoundingClientRect().height);
            setItemHeight(itemRef.current.getBoundingClientRect().height);
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
            <div className="relative w-full h-28" ref={itemRef}>
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
            <div className="relative w-full h-28">
                <Scroller gap={10} speed={1} reverse>
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
            {appendScrollers()}
        </div>
    );
};

export default Home;
