import React, { Component, useState } from 'react'
import Card from '../Card'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import ProjectMenuSection from '../ProjectMenuSection';
import { Link, Redirect } from 'react-router-dom';
import SkeletonLoading from '../SkeletonLoading';
import Model from '../Model';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan, GoGitPullRequest, GoLinkExternal } from "react-icons/go";
import IssueListWrapper from '../IssueListWrapper';
var url = require('url');


const IssueBlock = ({ issue }) => {
    return (
        <div className="flex-1 pr-4">
            <div className="font-bold">{issue.title}</div>
            <div className="text-sm mt-3">
                <div className="flex">
                    <img className="w-6 rounded-full h-6" src={issue.user.avatar_url}></img>
                    <span className="ml-3">{issue.user.login}</span>
                    
                </div>
                <a className="flex mt-4 hover:underline items-center text-xs font-bold text-blue-700" target="_blank" rel="noopener noreferrer" href={issue.html_url} ><GoLinkExternal className="mr-2" /><span>View on Github</span></a>
            </div>
        </div>
    )
}




const CreateNewContributionModel = ({ isOpen, issue, onClose, project }) => {
    const [modelLoader, setModelLoader] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);

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
            if(res.slug)
                setRedirectUrl(`/v3/project/${project.slug}/contribution/${res.slug}`);
            
            setModelLoader(false)
        })
    }

    if(issue)
        return (
            <Model onClose={onClose} isOpen={isOpen}>
                { redirectUrl ? <Redirect to={redirectUrl} /> : null}
                <div className="p-6">
                    <div className="border-b border-gray-200 mb-4">
                        <h3 className="text-lg font-bold mb-1">Create on new contribution with this issue?</h3>
                        <p className="text-xs text-gray-500 mb-3">Start a conrtibution by picking this issue.</p>
                    </div>

                    { modelLoader ? <SkeletonLoading mini /> :
                    <div className="bg-gray-200 px-4 py-2 rounded">
                        <IssueBlock issue={issue} />
                    </div>     }                 
                    
                    <button onClick={createSessionAPI} className="mt-8 bg-green-800 hover:bg-green-900 px-6 py-2 font-bold text-sm text-white" >Confirm</button>
                    <button onClick={onClose} className="px-4 py-2 font-bold text-sm">Cancel</button>
                </div>
            </Model>
        )

    return (<div></div>)
}





export default class IssueList extends Component {

    state = {
        issues: [],
        loading: true,
        sessionCreateModelIsOpen: false,
        selectedIssue: null
    }

    // async componentDidMount() {

    //     const gitURL = this.props.project.githubUrl;
    //     const {pathname} = url.parse(gitURL);
    //     console.log(pathname);

    //     fetch(API_URL + `/github${pathname}/issue/`, {
    //         headers: await GET_TOKEN_HEADER()
    //     }).then(res => res.json())
    //     .then(res => {
    //         this.setState({
    //             issues: res,
    //             loading: false
    //         })
    //     })

    // }

    onClickCreateSession = (issue) => {
        this.setState({
            sessionCreateModelIsOpen: true,
            selectedIssue: issue
        })
    }



    createSession = async (issue) => {
        
    }


    modelClose = () => {
        this.setState({
            sessionCreateModelIsOpen: false,
            selectedIssue: null
        })
    }

    render() {
        return (
            <>
            <div className="bg-white border-gray-300">
                <ProjectMenuSection selected="ISSUE" project={this.props.project} />
            </div>
            <div className="max-w-4xl mx-auto mt-4">
                {/* { this.state.loading ? <SkeletonLoading /> : null} */}


                
                <CreateNewContributionModel project={this.props.project} isOpen={this.state.sessionCreateModelIsOpen} issue={this.state.selectedIssue} onClose={this.modelClose} />
           
                
                {/* { this.state.issues.map((issue) => (
                    <Card className="px-4 py-4 mb-4">
                        <div href={issue.html_url}>
                            <div className="flex justify-between items-center">
                                <IssueBlock issue={issue} />

                                <div className="w-32 flex justify-end">
                                    {
                                        issue.sessions.length == 0 ? <div>
                                        <button onClick={() => this.onClickCreateSession(issue)} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded">Pick this</button>
                                    </div> : <span className="px-4 py-2 bg-blue-700 text-white text-sm opacity-50 font-bold rounded">Picked up</span> }
                                
                                   
                                </div>
                            </div>
                            
                        </div>
                    </Card>
                ))
                    
                } */}

                <IssueListWrapper issues={this.state.issues} project={this.props.project} />
                
            </div>
            </>
        )
    }
}
