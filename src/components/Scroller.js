// Scrolls whatever is within it from left to right infinitely
import { useState, useEffect, useRef } from "react";

const Scroller = ({ children, gap }) => {
    // We only need to care about ther elements on the ends.
    // If the left-most item's left side is greater than -10px, then spawn a new item on the left.
    // Alternatively, calculate how many items I can fit in the scrolling bar, then add two more (ne on each end). Then, when the left-most item gets to 0, shift all items to the left by the item width.
    const [containerWidth, setContainerWidth] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const containerRef = useRef(null);
    const itemRef = useRef(null);
    let spacing = gap;
    let spacingStyling = { marginLeft: `${spacing / 2}px`, marginRight: `${spacing / 2}px` };

    if (spacing === undefined || spacing < 0 || Number.isNaN(spacing)) {
        spacing = 0;
    }

    const appendItems = () => {
        if (containerWidth <= 0 || itemWidth <= 0) {
            console.warn("Unable to scroll items. Either containerWidth = 0 or itemWidth = 0.");
            return;
        }
        // Edge cases: item width = 0, container width = 0;
        let elements = [];
        let key = 1; // NOTE: Key "starts" at 1 here since there is already an element which will begin with key 0.
        // Populate scroller with as many items as will fit (and then two more).
        // We subtract one from the available width right away since there will always be at least one item in the scroller.
        for (
            let availableWidth = containerWidth - (itemWidth + spacing);
            availableWidth > 0;
            availableWidth -= itemWidth + spacing
        ) {
            elements[key] = (
                <span key={key} className="relative inline-block w-auto" style={spacingStyling}>
                    {children}
                </span>
            );
            key++;
        }

        // Add these to ensure that we have at least three items.
        elements[key] = (
            <span key={key} className="relative inline-block w-auto" style={spacingStyling}>
                {children}
            </span>
        );
        elements[key + 1] = (
            <span key={key + 1} className="relative inline-block w-auto" style={spacingStyling}>
                {children}
            </span>
        );

        return elements;
    };

    // Handle calculation of widths upon load and upon resizing
    useEffect(() => {
        // Set initial widths
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
        setItemWidth(itemRef.current.getBoundingClientRect().width);

        // On resize, recalculate width
        window.addEventListener("resize", (e) => {
            setContainerWidth(containerRef.current.getBoundingClientRect().width);
            setItemWidth(itemRef.current.getBoundingClientRect().width);
        });
    }, []); //empty dependency array so it only runs once at render

    console.log(containerWidth + " | " + itemWidth);

    // I may need to randomize the animation name for it to work.
    return (
        <>
            <style>{`
                .animatedScroller {
                    animation-name: scrollLeft;
                    animation-duration: 3s;
                    animation-iteration-count: infinite;
                }
                @keyframes scrollLeft {
                    from {
                      transform: translateX(0px);
                    }
                  
                    to {
                      transform: translateX(${itemWidth + spacing});
                    }
                }
            `}</style>
            <div ref={containerRef} className="relative block w-full h-full whitespace-nowrap overflow-hidden">
                <div className="animatedScroller relative block w-full h-full whitespace-nowrap overflow-hidden">
                    <span key={0} ref={itemRef} className="relative inline-block w-auto" style={spacingStyling}>
                        {children}
                    </span>
                    {appendItems()}
                </div>
            </div>
        </>
    );
};

export default Scroller;
