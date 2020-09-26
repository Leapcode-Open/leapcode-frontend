import React, { Component } from 'react'
import { auth, signInWithGithub, provider } from '../../config/firebase';
import SkeletonLoading from '../../Components/SkeletonLoading';

export default class Logout extends Component {

    componentDidMount() {
        auth().signOut().then((res) => {
            window.location.href="https://leapcode.io"
        })
    }

    render() {
        return (
            <div>
                <SkeletonLoading />
            </div>
        )
    }
}
