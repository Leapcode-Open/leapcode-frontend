import React, { Component, useState } from 'react'
import Card from '../Card'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import ProjectMenuSection from '../ProjectMenuSection';
import { Link } from 'react-router-dom';
import SkeletonLoading from '../SkeletonLoading';
import Model from '../Model';
import Tick from '../SVG/Tick';
import RelatedProjects from '../RelatedProjects';
var url = require('url');
const moment = require('moment')


const PRStatus = ({ state, merged, justifyEnd }) => {

    if(merged)
        return (<div className={`flex items-center mt-2 ${justifyEnd ? 'justify-end' : ''}`}><Tick color="#4CAF50" /> <span className="ml-2 font-bold text-sm font-inter" >Merged  🎉</span></div>)
    if(state == 'closed')
        return  <div><span className="w-2 h-2 rounded-full bg-red-700 inline-block mr-2"></span>Closed</div>

    if(state == 'open')
        return  <div><span className="w-2 h-2 rounded-full bg-green-700 inline-block mr-2"></span>Open</div>

    else 
        return <div><span className="w-2 h-2 rounded-full bg-orange-700 inline-block mr-2"></span>{state}</div>
}

const IssueBlock = ({ issue }) => {
    return (
        <div className="">
            <div className="font-bold">{issue.title}</div>
            <div className="text-sm mt-3">
                <div className="flex">
                    <img className="w-6 rounded-full" src={issue.user.avatar_url}></img>
                    <span className="ml-3">{issue.user.login}</span>
                </div>
            </div>
        </div>
    )
}




const CreateNewContributionModel = ({ isOpen, issue, onClose, project }) => {
    const [modelLoader, setModelLoader] = useState(false);


    const createSessionAPI = async () => {
        setModelLoader(true);

        fetch(API_URL+ '/session/v3/', {
            method:'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                issue,
                issueId: issue.number,
                projectId: project._id
            })
        }).then(res => res.json())
        .then((res) => {
            window.alert(res.slug)
        })
    }

    if(issue)
        return (
            <Model onClose={onClose} isOpen={isOpen}>
                <div className="p-6">
                    <div className="border-b border-gray-200 mb-4">
                        <h3 className="text-lg font-bold mb-1">Create on new contribution with this issue?</h3>
                        <p className="text-xs text-gray-500 mb-3">Start a conrtibution by picking this issue.</p>
                    </div>
                    <div className="bg-gray-200 px-4 py-2 rounded">
                        <IssueBlock issue={issue} />
                    </div>                        
                    
                    <button onClick={createSessionAPI} className="mt-8 bg-green-800 hover:bg-green-900 px-6 py-2 font-bold text-sm text-white" >Confirm</button>
                    <button onClick={onClose} className="px-4 py-2 font-bold text-sm">Cancel</button>
                </div>
            </Model>
        )

    return (<div></div>)
}





export default class ContributionList extends Component {

    state = {
        sessions: [],
        loading: true,
        sessionCreateModelIsOpen: false,
        selectedIssue: null
    }

    async componentDidMount() {

        const gitURL = this.props.project.githubUrl;
        const {pathname} = url.parse(gitURL);

        fetch(API_URL + `/session?projectId=${this.props.project._id}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            this.setState({
                sessions: res,
                loading: false
            })
        })

    }



    render() {
        return (
            <>
            <div className="bg-white">
                <ProjectMenuSection selected="YOURCONTRIBUTION" project={this.props.project} />
            </div>
            <div className="max-w-4xl mx-auto mt-4">
                { this.state.loading ? <SkeletonLoading /> : null}           
                
                { this.state.sessions.map((session) => (
                    <div className="bg-white border-b border-gray-200 hover:shadow hover:bg-gray-100">
                        <Link className="px-4 py-6 block" to={`contribution/${session.slug}`}>
                            <div className="flex justify-between items-center">

                                <div className="flex-1">
                                    {/* <h6 className="text-xs opacity-75 mb-2">{session.name}</h6> */}
                                    { session.issue  ? <div>
                                        <h3 className="font-bold">{session.issue.title}</h3>
                                        <small className="text-gray-600 font-medium text-xs">Last updated {moment(session.updatedAt).fromNow()} </small>
                                        </div> : null}
                                </div>

                                <div className="w-64 text-right">
                                    <div className="mt-0 text-xs">{ session.pullRequest ? <PRStatus justifyEnd {...session.pullRequest}></PRStatus> : <div className=""><span className="w-2 h-2 rounded-full bg-red-700 inline-block mr-2 font-inter"></span>No Pull Request Connect</div> }</div>
                                </div>

                            </div>
                        </Link>
                    </div>
                ))
                    
                }



            { this.state.sessions.length == 0 && !this.state.loading ? <div className="flex flex-col items-center mt-20  py-10">
                <p className="text-gray-700 text-sm text-center mb-4">You have not contributed on this project via leapcode</p>
                <Link to={`/v3/project/${this.props.project.slug}/issue`} className="px-4 py-2 bg-black text-white text-sm font-bold font-inter hover:bg-gray-900">Find an issue to work on</Link>
            </div> : null }





            {/* <RelatedProjects projectSlug={this.props.project.slug} /> */}
                
                
            </div>
            </>
        )
    }
}
