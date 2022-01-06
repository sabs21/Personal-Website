import { useState, useEffect, useRef, useContext } from "react";
import Scroller from "../Scroller";
import { DarkModeContext } from "../DarkModeContext";

const Backdrop = ({ containerHeight, text }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [itemHeight, setItemHeight] = useState(0);
    const itemRef = useRef(null);

    const addScroller = (key, style, reverse = false) => {
        return (
            <div key={key} className="relative h-28" style={style}>
                <Scroller gap={0} speed={1} reverse={reverse}>
                    <svg
                        width="380"
                        height="210"
                        viewBox="0 0 380 200"
                        className="relative inline-block w-auto h-auto text-9xl font-display font-black pointer-events-none"
                    >
                        <defs>
                            <mask id="upright" x="0" y="0" width="390" height="200">
                                <rect x="0" y="0" width="380" height="200" fill="#fff"></rect>
                                <text textAnchor="left" x="0" y="102">
                                    {text}
                                </text>
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="380"
                            height="200"
                            mask="url(#upright)"
                            fill={darkMode ? "#0A1A1D" : "#EDF8F9"}
                            fillOpacity="1"
                        ></rect>
                    </svg>
                    <svg
                        width="393"
                        height="210"
                        viewBox="0 0 390 200"
                        className={`${
                            darkMode ? "outlinedTextDark" : "outlinedText"
                        } relative inline-block w-auto h-auto text-9xl font-display font-black pointer-events-none`}
                        style={{ transform: "rotate(180deg) translateY(93px)" }}
                    >
                        <defs>
                            <mask id="upsidedown" x="0" y="0" width="400" height="115">
                                <rect x="0" y="0" width="400" height="115" fill="#fff"></rect>
                                <text textAnchor="left" x="0" y="102" fill="transparent" stroke="black" strokeWidth="1">
                                    {text}
                                </text>
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="390"
                            height="200"
                            mask="url(#upsidedown)"
                            fill={darkMode ? "#0A1A1D" : "#EDF8F9"}
                            fillOpacity="1"
                        ></rect>
                    </svg>
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
        setItemHeight(itemRef.current.offsetHeight);
        //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
        //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);

        // On resize, recalculate width
        window.addEventListener("resize", (e) => {
            setItemHeight(itemRef.current.offsetHeight);
            //console.log("containerRef offsetHeight", containerRef.current.offsetHeight);
            //console.log("itemRef offsetHeight", itemRef.current.offsetHeight);
        });
    }, []); //empty dependency array so it only runs once at render

    return (
        <>
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
                    <svg
                        width="380"
                        height="210"
                        viewBox="0 0 380 200"
                        className="relative inline-block w-auto h-auto text-9xl font-display font-black pointer-events-none"
                    >
                        <defs>
                            <mask id="upright" x="0" y="0" width="390" height="200">
                                <rect x="0" y="0" width="380" height="200" fill="#fff"></rect>
                                <text textAnchor="left" x="0" y="102">
                                    {text}
                                </text>
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="380"
                            height="200"
                            mask="url(#upright)"
                            fill={darkMode ? "#0A1A1D" : "#EDF8F9"}
                            fillOpacity="1"
                        ></rect>
                    </svg>
                    <svg
                        width="393"
                        height="200"
                        viewBox="0 0 394 200"
                        className={`${
                            darkMode ? "outlinedTextDark" : "outlinedText"
                        } relative inline-block w-auto h-auto text-9xl font-display font-black pointer-events-none -ml-1`}
                        style={{ transform: "rotate(180deg) translateY(93px)" }}
                    >
                        <defs>
                            <mask id="upsidedown" x="0" y="0" width="400" height="115">
                                <rect x="0" y="0" width="400" height="115" fill="#fff"></rect>
                                <text textAnchor="left" x="0" y="102" fill="transparent" stroke="black" strokeWidth="1">
                                    {text}
                                </text>
                            </mask>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="390"
                            height="200"
                            mask="url(#upsidedown)"
                            fill={darkMode ? "#0A1A1D" : "#EDF8F9"}
                            fillOpacity="1"
                        ></rect>
                    </svg>
                </Scroller>
            </div>
            {appendScrollers(containerHeight, itemHeight, 7)}
        </>
    );
};

export default Backdrop;
