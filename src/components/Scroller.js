// Scrolls whatever is within it from left to right infinitely
import { useState, useEffect, useRef } from "react";

const Scroller = ({ children, gap, speed, reverse }) => {
    // We only need to care about ther elements on the ends.
    // If the left-most item's left side is greater than -10px, then spawn a new item on the left.
    // Alternatively, calculate how many items I can fit in the scrolling bar, then add two more (ne on each end). Then, when the left-most item gets to 0, shift all items to the left by the item width.
    const [containerWidth, setContainerWidth] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const containerRef = useRef(null);
    const itemRef = useRef(null);
    const uniqueId = Math.floor(Math.random() * 999999);

    let spacing = gap; // float
    let spacingStyling = { marginLeft: `${spacing / 2}px`, marginRight: `${spacing / 2}px` };
    if (spacing === undefined || spacing < 0 || Number.isNaN(spacing)) {
        spacing = 0;
    }

    let animSpeed = speed; // float
    if (spacing === undefined || spacing < 0 || Number.isNaN(spacing)) {
        animSpeed = 1;
    } else {
        // Now we know that animSpeed is a valid number, so recalculate it as the reciprocol of the slowest speed. This allows for higher numbers to mean higher speeds.
        animSpeed = 20 / animSpeed;
    }

    let animDirection = "left";
    if (reverse) {
        animDirection = "right";
    }

    // Calculates how many items are just enough to fill the container width-wise. This does not take into consideration any rotations applied.
    const findOptimalAmountOfItems = (containerWidth, itemWidth, spacing) => {
        if (containerWidth <= 0 || itemWidth <= 0) {
            console.warn("Unable to find optimal amount of items to fit. Either containerWidth = 0 or itemWidth = 0.");
            return 0;
        }

        let items = 2; // We need at least 3 items in the scroller to achieve the desired scrolling effect. We already have the reference item, so we just add 2 items here to ensure we reach the needed 3 items.
        for (
            let availableWidth = containerWidth - (itemWidth + spacing);
            availableWidth > 0;
            availableWidth -= itemWidth + spacing
        ) {
            items++;
        }
        //console.log("items", items);
        return items;
    };

    // Add as many items as can fit onto the scroller.
    const appendItems = (containerWidth, itemWidth, spacing) => {
        let elements = [];
        let key = 1; // NOTE: Key "starts" at 1 here since there is already an element which will begin with key 0.
        // Populate scroller with as many items as will fit (and then two more).
        // We subtract one from the available width right away since there will always be at least one item in the scroller.
        for (let totalItems = findOptimalAmountOfItems(containerWidth, itemWidth, spacing); key <= totalItems; key++) {
            elements.push(
                <span key={key} className="relative inline-block w-auto" style={spacingStyling}>
                    {children}
                </span>
            );
        }

        return elements;
    };

    // Handle calculation of widths upon load and upon resizing
    useEffect(() => {
        // Set initial widths
        setContainerWidth(containerRef.current.offsetWidth);
        setItemWidth(itemRef.current.offsetWidth);
        //console.log("containerRef width", containerRef.current.offsetWidth);
        //console.log("itemRef width", itemRef.current.offsetWidth);

        // On resize, recalculate width
        window.addEventListener("resize", (e) => {
            if (containerRef.current !== null && itemRef.current !== null) {
                setContainerWidth(containerRef.current.offsetWidth);
                setItemWidth(itemRef.current.offsetWidth);
            }
            //console.log("containerRef width", containerRef.current.offsetWidth);
            //console.log("itemRef width", itemRef.current.offsetWidth);
        });
    }, []); //empty dependency array so it only runs once at render

    //console.log(containerWidth + " | " + itemWidth);
    //console.log("itemWidth and spacing calculation", -1 * (itemWidth + spacing));

    // I may need to randomize the animation name for it to work.
    return (
        <>
            <style>{`
                .animatedScroller_${uniqueId} {
                    animation-name: scroller_${uniqueId};
                    animation-duration: ${animSpeed}s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                @keyframes scroller_${uniqueId} {
                    from {
                      transform: translateX(${animDirection === "left" ? -1 * (itemWidth + spacing) : 0}px);
                    }
                    to {
                      transform: translateX(${animDirection === "left" ? 0 : -1 * (itemWidth + spacing)}px);
                    }
                }
            `}</style>
            <div ref={containerRef} className="relative block w-full h-full whitespace-nowrap overflow-hidden">
                <div
                    className={`animatedScroller_${uniqueId} relative block w-full h-full whitespace-nowrap`}
                    style={{ transform: `translateX(-${itemWidth + spacing}px)` }}
                >
                    <span key={0} ref={itemRef} className="relative inline-block w-auto" style={spacingStyling}>
                        {children}
                    </span>
                    {appendItems(containerWidth, itemWidth, spacing)}
                </div>
            </div>
        </>
    );
};

export default Scroller;
