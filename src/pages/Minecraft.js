import React from 'react'
import MinecraftBlock from "../components/three/MinecraftBlock.js"

const Minecraft = () => {
    return (
        <div>
            <MinecraftBlock className="relative block rounded-lg z-0 w-full h-72" />
            <img src="diamond-divider.png"></img>
            <div className="px-8">
                <h1 className="text-5xl text-fadedsky-800 dark:text-fadedsky-200 mt-4 mb-2">Witcher's Modpack</h1>
                <p className="relative block text-fadedsky-800 dark:text-fadedsky-300">
                    Handcrafted for a vanilla plus experience. Dive into new dimensions, build bustling factories, and fight bosses to become an unstoppable force. This pack is optimized for multiplayer servers and is updated frequently, so be sure to check back here for any updates.
                </p>
            </div>
        </div>
    )
}

export default Minecraft
