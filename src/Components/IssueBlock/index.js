import React from 'react';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan, GoGitPullRequest, GoLinkExternal } from "react-icons/go";


const PRStatus = ({ session }) => {
    if(session.pullRequest) {
        if(session.pullRequest.merged)
            return (<div className="flex mt-2 items-center">
                <div className="rounded-full"><GoGitPullRequest color="" /></div>
                <div className='text-sm font-bold font-inter ml-2 text-gray-900'>Pull Request</div>
            </div>)
    }
}

const IssueStatus = ({ issue }) => {
    if(issue.state == 'open')
        return (
            <div className="flex mt-2 items-center">
                <div className="rounded-full"><GoIssueOpened color="" /></div>
                <div className='text-sm font-bold font-inter ml-2 text-gray-900'>Open</div>
            </div>
        )

    if(issue.state == 'closed')
            return (
                <div className="flex mt-2 items-center">
                    <div className="rounded-full"><GoIssueClosed /></div>
                    <div className='text-sm font-bold font-inter ml-2 text-gray-900'>Closed</div>
                </div>
            )

    return (<div></div>)
}

const IssueBlock = ({ issue }) => {
    return (
        <div className="flex-1 pr-4">
            <div className="font-bold">{issue.title}</div>
            <div className="text-sm mt-3">
                <div className="flex">
                    <img className="w-5 rounded-full h-5" src={issue.user.avatar_url}></img>
                    <span className="ml-3">{issue.user.login}</span>
                    
                </div>
                <div className="flex-col flex mt-1">
                        {/* <IssueStatus issue={issue} /> */}
                </div>
                <a className="flex mt-4 hover:underline items-center text-xs font-bold text-blue-700" target="_blank" rel="noopener noreferrer" href={issue.html_url} ><GoLinkExternal className="mr-2" /><span>View on Github</span></a>
            </div>
        </div>
    )
}

export default IssueBlock;