import { useState, useEffect, useRef, useContext } from "react";
import Hero from "../components/hero/Hero";
import { DarkModeContext } from "../components/DarkModeContext";

const Home = () => {
    return (
        <>
            <Hero />
            <div></div>
        </>
    );
};

export default Home;
