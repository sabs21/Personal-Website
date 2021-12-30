import { useContext } from 'react'
import MinecraftBlock from "../components/three/MinecraftBlock.js"
import { DarkModeContext } from "../components/DarkModeContext";

const Minecraft = () => {
    const { darkMode } = useContext(DarkModeContext)
    const gradientColor = darkMode ? "#464a4a" : "#777979";
    return (
        <div>
            <MinecraftBlock className="relative block rounded-lg z-0 w-full h-72" />
            <div style={{background: `linear-gradient(${gradientColor}, transparent)`, marginTop: "-1px"}} className="relative block h-20 w-full"></div>
            <div className="px-8 text-fadedsky-800 dark:text-fadedsky-200">
                <h1 className="text-5xl mt-4 mb-2">Witcher's Modpack</h1>
                <p className="relative block">
                    Handcrafted for a vanilla plus experience. Dive into new dimensions, build bustling factories, and fight bosses to become an unstoppable force. This pack is optimized for multiplayer servers and is updated frequently, so be sure to check back here for any updates.
                </p>
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
