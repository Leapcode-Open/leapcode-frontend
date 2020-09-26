import React, { Component } from 'react'
import { storage } from '../../config/firebase';
import SkeletonLoading from '../SkeletonLoading';
export default class BadgesList extends Component {


    state = {
        badges: [],
        loading: true
    }


    async componentDidMount() {
        const { badges } = this.props;
        var storageRef = storage.ref();
        const newList = await Promise.all(badges.map(async (badge) => ({
            ...badge,
            downloadurl: await storageRef.child(badge.image).getDownloadURL()
        })));



        this.setState({
            badges: newList,
            loading: false
        })
    }
    render() {
        const { badges, loading } = this.state;
        if(loading)
            return (
                <div><SkeletonLoading mini /></div>
            )
        return (
            <div className="">
                { badges.map(badge => (
                    <div key={badge._id} className="flex py-3 items-center">
                        <div className="w-8 h-8">
                            <img src={badge.downloadurl} />
                        </div>
                        <span className="ml-3 text-sm text-gray-900">{badge.name}</span>
                    </div>
                )) }
            </div>
        )
    }
}
