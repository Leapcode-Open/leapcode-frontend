import React, { Component } from 'react'
import Model from '../Model'
import { Link } from 'react-router-dom'

export default class ContributorsListModel extends Component {
    render() {
        return (
            <Model onClose={this.props.onClose} isOpen={this.props.isOpen}>
                <div className='p-6'>
                    <div className="border-b border-gray-200 mb-4">
                        <h3 className="text-lg font-bold mb-1">Contributors on this project</h3>
                    </div>

                    <div className="">
                        {
                            this.props.contributors.map((contributor) => (
                                <Link key={contributor._id} to={`/u/${contributor.username}`}>
                                    <div className="flex items-center py-2 hover:bg-gray-100">
                                        <img src={contributor.displayPhoto} className="w-8 h-8 rounded-full" />
                                        <span className="ml-3">{contributor.displayName}</span>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </Model>
        )
    }
}
