import React from 'react'
import { Link } from "react-router-dom"

const NavLink = ({ text, to }) => {
    return (
        <Link to={to} className="relative inline-flex justify-center items-center w-auto h-12 rounded-lg transition-colors">
            <span className="relative inline-block text-xl text-redsand-100 hover:text-redsand-50 mx-2 hover:underline">{text}</span>
        </Link>
    )
}

export default NavLink
