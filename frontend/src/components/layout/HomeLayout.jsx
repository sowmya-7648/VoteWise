import React from 'react'
import Navbar from '../navbar/Navbar'
import { Outlet } from 'react-router-dom'

function HomeLayout() {
    return (
        <div>
            <Navbar />
            <Outlet />

        </div>
    )
}

export default HomeLayout