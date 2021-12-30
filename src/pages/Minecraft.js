import { useContext } from 'react'
import MinecraftBlock from "../components/three/MinecraftBlock.js"
import { DarkModeContext } from "../components/DarkModeContext";

const Minecraft = () => {
    const { darkMode } = useContext(DarkModeContext)
    const gradientColor = darkMode ? "#464a4a" : "#777979";

    const KateHouseImg = () => {
        const image = darkMode ? "kateshousenight.jpg" : "kateshouse.jpg";
        return (
            <svg
                className="relative block h-full w-full"
                version="1.1" 
                viewBox="0 0 3.7795315 3.2047288" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <clipPath id="shape" >
                        <path d="M878,677Q782,854,618.5,775.5Q455,697,257.5,704.5Q60,712,61,500.5Q62,289,227,157.5Q392,26,590,82.5Q788,139,881,319.5Q974,500,878,677Z"></path>
                    </clipPath>
                </defs>
                <image transform="matrix(.0043655 0 0 .0043655 -.26628 -.28603)" clip-path="url(#shape)" href={image}/>
            </svg>
        )
    }

    const MarketImg = () => {
        const image = darkMode ? "villagenight.jpg" : "villageday.jpg";
        return (
            <svg 
                className="relative block h-full w-full"
                version="1.1" 
                viewBox="0 0 3.7795289 3.3141136"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <clipPath id="a">
                        <path d="m865 664.5q-36 164.5-200.5 168t-308.5-20.5-195.5-168 25.5-262.5 195.5-154 282.5-45.5 200.5 154 0.5 328.5z" fill="currentColor"/>
                    </clipPath>
                </defs>
                <image transform="matrix(.0050867 0 0 .0050867 -.71143 -.92286)" clip-path="url(#a)" href={image}/>
            </svg>
        )
    }

    return (
        <div className="text-fadedsky-800 dark:text-fadedsky-200">
            <MinecraftBlock className="relative block rounded-lg z-0 w-full h-72" />
            <div style={{background: `linear-gradient(${gradientColor}, transparent)`, marginTop: "-1px"}} className="relative block h-20 w-full"></div>
            <h1 className="absolute block w-full text-center text-4xl md:text-7xl font-bold -mt-60">Witcher's Modpack</h1>
            <div className="px-20 mt-5">
                <div className="relative flex w-full h-96 flex-col md:flex-row mb-12 md:mb-0">
                    <span className="flex-1 flex flex-col justify-center items-start mb-4 md:mb-0">
                        <p className="relative block text-lg md:text-xl">
                            Handcrafted for a vanilla plus experience. Dive into new dimensions, build bustling factories, and fight bosses to become an unstoppable force. This pack is optimized for multiplayer servers and is updated frequently, so be sure to check back here for any updates.
                        </p>
                    </span>
                    <span className="flex-1 relative flex justify-center items-center h-full w-full overflow-hidden">
                        <KateHouseImg />
                    </span>
                </div>
                <div className="relative flex w-full h-96 flex-col-reverse md:flex-row mb-16">
                    <span className="flex-1 relative flex justify-center items-center h-full w-full overflow-hidden mt-4 md:mb-0">
                        <MarketImg />
                    </span>
                    <span className="flex-1 flex flex-col justify-center items-start">
                        <p className="relative block text-lg md:text-xl">
                            Home to a community of power hungry opportunity seekers just like yourself. Claim land and defend it from squatters, undead armies, and deceptive traders trying to impose on your land. Join in adventures to seek lost treasures that will give you a step up beyond the rest. Shape this world how you see fit. 
                        </p>
                    </span>
                </div>
                <h2 className="text-3xl mt-4 mb-2">Manual Installation</h2>
                <p className="relative block">Installation of this modpack will require...</p>
                <ul className="relative block">
                    <li className="ml-7">Minecraft version 1.16.5</li>
                    <li className="ml-7">Forge version 36.2.20 (<a className="text-fadedsky-500 hover:underline" href="https://files.minecraftforge.net/net/minecraftforge/forge/index_1.16.5.html">download page</a>)</li>
                </ul>
                <p className="relative block">Once you've set up the correct versions, you can begin installing the modpack.</p>
                <h3 className="text-xl mt-3 mb-2">Downloads</h3>
                <ol className="list-decimal">
                    <li className="ml-7">Config folders (<a className="text-fadedsky-500 hover:underline" href="https://mega.nz/file/EI52yBqa#wWwaDr1Lemw9C5qpG190S2ZCZ0RaIbk2XMNKpb8R2j0">download page</a>)</li>
                    <li className="ml-7">Mod folder (<a className="text-fadedsky-500 hover:underline" href="https://mega.nz/file/tEohmI6L#xHrBilVlGJrVTattuphshiipvIhOVj7iZMfYKxqQXo0">download page</a>)</li>
                </ol>
                <h3 className="text-xl mt-3 mb-2">Installation Instructions</h3>
                <ol className="list-decimal">
                    <li className="ml-7">Make sure you've installed forge. Simply run the forge jar file obtained from the website and install the forge client (not the server).</li>
                    <li className="ml-7">Navigate to your <b>.minecraft</b> folder. (For Windows: Searching %appdata% in the Windows search will lead you to the folder.)</li>
                    <li className="ml-7">Extract <b>mods.zip</b> and drag the mods folder into the .minecraft folder. Make sure there isn't a mods folder nested within the mods folder.</li>
                    <li className="ml-7">Extract <b>config.zip</b> and drag the defaultconfig and config folders into the .minecraft folder. Again, make sure to avoid nested folders.</li>
                </ol>
            </div>
            <div className="relative block h-32"></div>
        </div>
    )
}

export default Minecraft
