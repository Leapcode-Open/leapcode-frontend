import React, { Component } from 'react'

export default class SkeletonLoading extends Component {
    render() {
        return (
            <div className="w-full p-2">
                        <div className="flex flex-col relative w-full bg-white overflow-hidden card translate-3d-none-after relative w-full bg-white overflow-hidden card translate-3d-none-after rounded ">
                            <div className="relative group text-primary-500">
                                <div className="absolute top-0 left-0 h-full w-full"><span className="skeleton-box group-hover:scale-110 transition-transform transform-center block h-full"></span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="pl-4 pr-4 pt-4 mb-4 text-left relative flex-grow">
                                    { this.props.mini ? <h3 className="text-lg font-bold text-gray-darkest mr-10 grid grid-cols-3 gap-4">
                                        <span className="skeleton-box h-5 col-span-3 inline-block"></span>
                                    </h3> : 
                                    <h3 className="text-lg font-bold text-gray-darkest mr-10 grid grid-cols-3 gap-4">
                                        <span className="skeleton-box h-5 col-span-3 inline-block"></span>
                                        <span className="skeleton-box h-5 col-span-2 inline-block"></span>
                                        <span className="skeleton-box h-5 col-span-1 inline-block"></span>
                                        <span className="skeleton-box h-5 col-span-1 inline-block"></span>
                                        <span className="skeleton-box h-5 col-span-2 w-2/3 inline-block"></span>
                                    </h3> }
                                </div>        
                            </div>
                        </div>
            </div>
        )
    }
}
