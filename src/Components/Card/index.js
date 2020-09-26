import React, { Component } from 'react'
import SkeletonLoading from '../SkeletonLoading'

export default class Card extends Component {

    render() {
        if(this.props.loading)
            return (
                <div className={`bg-white rounded-lg shadow-cs transition-shadow duration-100 ease-out   ${this.props.className}`}>
                    <SkeletonLoading />
                </div>
            )
        return (
            <div className={`bg-white rounded-lg shadow-cs transition-shadow duration-100 ease-out ${this.props.noBorder ? '' : ''} ${this.props.className}`}>
                {this.props.children}
            </div>
        )
    }
}
