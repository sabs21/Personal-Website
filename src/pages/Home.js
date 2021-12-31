import React from "react";
import Scroller from "../components/Scroller";

const Home = () => {
    const navBarOffset = 80; // the height of the nav bar
    return (
        <div style={{ height: `${window.innerHeight - navBarOffset}px` }} className="relative block bg-redsand-500">
            <style>{`
                .outlinedText {
                    -webkit-text-stroke: 2px white;
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
            <div className="relative w-full h-40">
                <Scroller gap={10} speed={1}>
                    <span className="relative inline-block text-white w-auto h-auto text-9xl font-display font-black">
                        SABIA
                    </span>
                    <span
                        className="outlinedText relative inline-block text-redsand-500 w-auto h-auto text-9xl font-display font-black"
                        style={{ transform: "rotate(180deg) translateY(11px)" }}
                    >
                        SABIA
                    </span>
                </Scroller>
            </div>
        </div>
    );
};

export default Home;
