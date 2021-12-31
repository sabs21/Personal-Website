import React from "react";
import Scroller from "../components/Scroller";

const Home = () => {
    const navBarOffset = 80; // the height of the nav bar
    return (
        <div style={{ height: `${window.innerHeight - navBarOffset}px` }} className="relative block bg-redsand-500">
            <div className="relative w-full h-16">
                <Scroller gap={10}>
                    <span className="relative inline-block bg-white w-20 h-16"></span>
                </Scroller>
            </div>
        </div>
    );
};

export default Home;
