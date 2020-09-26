import React, { Component, Fragment, useState } from 'react';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
import ErrorBox from '../Error';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan, GoMarkGithub } from "react-icons/go";
import ReactMarkdown from 'react-markdown';
var url = require('url');
const Heading = ({name, description }) => (
    <Fragment>
            <h3 className="font-medium mb-3">{name}</h3>
            <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm text-gray-700 mb-2"></div>    </Fragment>
)

const IssueV3 = ({ onIssueSubmit, onIssueChange, error, session }) => {


    const [prStatusLoading, changeLoading] = useState(false);
    const [issueInfo, setIssueInfoInfo] = useState(session.issue);
    const [bodyExpand, setbodyExpand] = useState(false)

    const checkStatus = async () => {
        const gitURL = session.project.githubUrl;
        const labels = session.project.labels;
        const {pathname} = url.parse(gitURL);
        changeLoading(true)
        fetch(API_URL+`/session/${session._id}/issue?labels=${labels}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json()).then(res => {
     
            setIssueInfoInfo(res);
            changeLoading(false)
        })

    }

    if(prStatusLoading)
        return (<SkeletonLoading mini />)

    if(issueInfo)
        return(
            <div className="py-3 border-gray-300 font-inter">
      
                <div className="flex">
                    <div className="w-6 py-4">
                        <GoIssueOpened size="20" />
                    </div>
                    <div className="p-3 flex-1 rounded" >
                        <h3 className="font-bold"> { issueInfo.title}</h3>
                        <div className='text-xs mt-1 text-gray-800'>Created by <span className="font-semibold">{issueInfo.user.login}</span></div>
                        <div className={`my-4 text-sm font-inter bg-gray-200 p-3  ${bodyExpand ? "" : 'h-24 overflow-scroll'}`}>
                            <ReactMarkdown source={issueInfo.body} />
                        </div>
        <div className="text-gray-500 text-sm cursor-pointer hover:underline" onClick={() => setbodyExpand(!bodyExpand)}>{bodyExpand ? "Collapse issue body" : 'Expand issue body'}</div>
                        <div className="flex mt-6">
                            <span onClick={() => checkStatus()} className="text-blue-500 font-medium cursor-pointer mr-6 text-sm hover:underline">Refresh Issue Information</span>
                            <a className='flex items-center text-gray-800 text-sm hover:underline  font-medium' target="_blank" rel="noopener noreferrer" href={issueInfo.html_url}><GoMarkGithub color="#4d4d4d" className="mr-2" /><span>View issue on Github</span></a>

                            {/* <span onClick={() => onDelete(info._id)} className="text-red-800 cursor-pointer  text-xs hover:underline flex items-center"><GoTrashcan className="mr-2" />Remove this Issue</span> */}
                        </div>
                    </div>
                </div>
               
            </div>
        )
   return (
       <div className="py-4 border-gray-300 font-inter">
    
            <div className="mt-5">
                { error ? <ErrorBox error={error} /> : null }
                <small className="text-xs block mb-1">Enter Issue ID</small>
                <form onSubmit={onIssueSubmit}>
                    <div className="flex">
                        <input onChange={onIssueChange} required className="px-3 py-2 text-sm border border-gray-400 w-full rounded" placeholder="#"/> 
                        <button type="submit" className="text-sm text-white font-medium px-3 py-1 bg-blue-500 hover:bg-blue-600 w-1/3 ml-3 rounded" >Connect Issue</button>
                    </div>
                </form>
            </div>
       </div>
   )
}

export default IssueV3;
