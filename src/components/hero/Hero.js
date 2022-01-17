import { useState, useEffect, useRef } from "react";
import Backdrop from "./Backdrop.js";
import HeroContent from "./HeroContent";

const Hero = () => {
    const navBarOffset = 80; // the height of the nav bar
    let bodyHeight = window.innerHeight - navBarOffset;
    let minHeight = 600;
    const [containerHeight, setContainerHeight] = useState(bodyHeight > minHeight ? bodyHeight : minHeight);
    const containerRef = useRef(null);

    const handleResize = (e) => {
        if (containerRef) {
            setContainerHeight(containerRef.current.offsetHeight);
        }
    };

    // Handle calculation of heights upon load and upon resizing
    useEffect(() => {
        if (containerRef && containerHeight > 0) {
            // Set initial widths
            setContainerHeight(containerRef.current.offsetHeight);

            // On resize, recalculate width
            window.addEventListener("resize", handleResize);
        }

        // Returning anything from useEffect happens when the component is unmounted
        return window.removeEventListener("resize", handleResize);
    }, []); //empty dependency array so it only runs once at render

    return (
        <>
            <div
                style={{ height: `${containerHeight}px` }}
                ref={containerRef}
                className="relative block bg-gradient-to-r from-redsand-500 to-fadedsky-500 overflow-hidden"
            >
                <Backdrop containerHeight={containerHeight} text={"SABIA"} />
            </div>
            <div
                className="absolute block w-full min-h-40 max-h-80"
                style={{
                    height: `${containerHeight / 2}px`,
                    top: `${containerHeight / 6 + 150}px`,
                }}
            >
                <HeroContent />
            </div>
        </>
    );
};

export default Hero;
