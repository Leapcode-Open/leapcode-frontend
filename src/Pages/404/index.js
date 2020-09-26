import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NoPage extends Component {
    render() {
        return (
            <div className="w-full h-screen flex items-center flex-col flex justify-center">
                <h1 className='font-bold text-xl mb-3'>Oops.. Seems like you hit a  wrong page</h1>
                <Link to='/' className="bg-blue-500 px-4 py-2 font-inter text-white font-bold">Take me to the dashboard</Link>   
            </div>
        )
    }
}
