import React from 'react'
import { Link } from "react-router-dom"

const NavLink = ({ text, to }) => {
    return (
        <Link to={to} className="relative inline-flex justify-center items-center w-auto h-12 rounded-lg bg-orange-200">
            <span className="relative inline-block text-xl text-gray-900 mx-2">{text}</span>
        </Link>
    )
}

export default NavLink
