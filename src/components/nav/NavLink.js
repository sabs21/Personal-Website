import React from 'react'
import { Link } from "react-router-dom"

const NavLink = ({ text, to }) => {
    return (
        <Link to={to} className="relative inline-flex justify-center items-center w-auto h-12 rounded-lg hover:bg-cyan-200 hover:dark:bg-cyan-700 transition-colors">
            <span className="relative inline-block text-xl text-cyan-900 dark:text-cyan-50 mx-2">{text}</span>
        </Link>
    )
}

export default NavLink
