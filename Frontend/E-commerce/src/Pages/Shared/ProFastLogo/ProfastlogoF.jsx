import React from 'react'
import logo from '../../../assets/logo.png'
import { Link } from 'react-router'
function Profastlogo() {
    return (
        <Link to='/'>
            <div className='flex items-end'>
                <img className='mb-2' src={logo}></img>
                <p className='text-3xl -ml-2'>ProFast</p>
            </div>
        </Link>
    )
}
export default Profastlogo