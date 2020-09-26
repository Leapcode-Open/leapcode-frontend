import React, { Component, Fragment, useState } from 'react';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
import ErrorBox from '../Error';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan } from "react-icons/go";

var url = require('url');
const Heading = ({name, description }) => (
    <Fragment>
            <h3 className="font-medium mb-3">{name}</h3>
            <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm text-gray-700 mb-2"></div>    </Fragment>
)

const Issue = ({ step, onIssueSubmit, onIssueChange, info, error, onDelete, session }) => {


    const [prStatusLoading, changeLoading] = useState(false);
    const [issueInfo, setIssueInfoInfo] = useState(session.issue);

    const checkStatus = async () => {
        const gitURL = session.project.githubUrl;
        const {pathname} = url.parse(gitURL);
        changeLoading(true)
        fetch(API_URL+`/session/issue/${session._id}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json()).then(res => {
     
            setIssueInfoInfo(res.data);
            changeLoading(false)
        })

    }

    if(prStatusLoading)
        return (<SkeletonLoading mini />)

    if(issueInfo)
        return(
            <div className="py-6 border-b border-gray-300 font-inter">
                <Heading {...step} />
                <div className="flex">
                    <div className="w-6 py-4">
                        <GoIssueOpened size="20" />
                    </div>
                    <div className="p-3 flex-1 rounded" >
                        <h3 className="font-bold"> { issueInfo.title}</h3>
                        <div className='text-xs mt-1 text-gray-800'>Created by <span className="font-semibold">{issueInfo.user.login}</span></div>
                        <div className="flex mt-3">
                            <span onClick={() => checkStatus()} className="text-blue-800 cursor-pointer mr-3 text-xs hover:underline">Refresh Issue Information</span>
                            <span onClick={() => onDelete(info._id)} className="text-red-800 cursor-pointer  text-xs hover:underline flex items-center"><GoTrashcan className="mr-2" />Remove this Issue</span>
                        </div>
                    </div>
                </div>
               
            </div>
        )
   return (
       <div className="py-6 border-b border-gray-300 font-inter">
            <Heading {...step} />
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

export default Issue;
