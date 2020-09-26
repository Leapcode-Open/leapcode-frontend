import React, { Component } from 'react'
import ProjectMenuSection from '../ProjectMenuSection'
import { Link } from 'react-router-dom'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import SkeletonLoading from '../SkeletonLoading'
import Card from '../Card'
import IssueV3 from '../IssueV3'
import PRBlockV3 from '../PRBlockV3';
export default class ContributionDetails extends Component {

    state = {
        loading: true,
        session: {}
    }

    async componentDidMount() {
        //console.log('123', this.props)
        const { slug } = this.props.match.params
        fetch(API_URL+`/session/slug/${slug}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            this.setState({
                loading: false,
                session: res
            })
        })
    }
    render() {
        if(this.state.loading)
        return (
            <div>
                <div className="bg-white">
                    <ProjectMenuSection selected="YOURCONTRIBUTION" project={this.props.project} />
                </div>

                <div className="mt-4 max-w-4xl mx-auto">
                    {/* <Link  className="text-gray-700 hover:underline text-sm font-medium">Back to all contributions</Link> */}
                    <SkeletonLoading />
                </div>
            </div>
        )


        const { session } = this.state;

        return (
            <div>
                <div className="bg-white">
                    <ProjectMenuSection selected="YOURCONTRIBUTION" project={this.props.project} />
                </div>

                <div className="mt-4 max-w-4xl mx-auto">
                    {/* <Link  className="text-gray-700 hover:underline text-sm font-medium">Back to all contributions</Link> */}
                    <div className="my-6">
                        <h2><Link className="hover:underline opacity-75" to="/">Contribution</Link> / {session.issue ? session.issue.title : session.name}</h2>
                        <h3></h3>
                    </div>

                    <div className="mt-4">
                        <Card>
                            <div className="px-6 py-4">
                                <h2 className="font-bold font-inter text-gray-700 text-sm">Issue</h2>
                                {
                                    session.issue ? <IssueV3 session={session} /> : <div>Issue not connected</div>
                                }
                            </div>
                        </Card>
                    </div>

                    <div className="mt-4">
                        <Card>
                            <div className="px-6 py-4">
                                <h2 className="font-bold font-inter text-gray-700 text-sm">Pull Request</h2>
                                <PRBlockV3 session={session} project={this.props.project} /> 
                            </div>
                        </Card>
                    </div>


                </div>
            </div>
        )
    }
}
