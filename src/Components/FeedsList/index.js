import React, { Component } from 'react'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import Card from '../Card'
import SkeletonLoading from '../SkeletonLoading';
import PickIssueFeed from './FeedContainer/PickIssue';
import NewJoinFeed from './FeedContainer/NewJoinFeed';
import MergePRFeed from './FeedContainer/MergePRFeed';



const FeedController = ({feed}) => {
 
    if(feed.verb == 'pickupIssue')
        return <PickIssueFeed feed={feed} />

    if(feed.verb == 'registered')
        return <NewJoinFeed feed={feed} />

    if(feed.verb == 'mergedPR')
        return <MergePRFeed feed={feed} />


    return (<span></span>)

}

export default class FeedsList extends Component {

    state = {
        loading: true,
        feeds : []
    }

    async componentDidMount() {
        const url = `/feed`;


        fetch(API_URL+url, {
            headers: await GET_TOKEN_HEADER()
        })
        .then(res => res.json())
        .then((res) => {
            this.setState({
                feeds: res,
                loading: false
            });
            
        });
    }
    render() {
        const { loading, feeds } = this.state;

        if(loading)
            return (
                <Card>
                    <SkeletonLoading mini />
                </Card>
            )
        return (
            <div>
                {
                    feeds.filter(a => a.userInfo).map((feed) => {
                        return <FeedController key={feed.id} feed={feed} />
                    })
                }
            </div>
        )
    }
}
