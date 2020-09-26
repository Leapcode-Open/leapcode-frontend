import React, { useState, useEffect, Fragment } from 'react';
import Model from '../Model';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
var url = require('url');




const Outer = ({ children, model, loading, modelHeading, isOpen, onClose }) => {

    if(model) {


        return (
            <Model loading={loading} isOpen={isOpen} onClose={onClose}>
                
                <div className="border-b border-gray-200 mb-0 p-4">
                        <h3 className="text-lg font-bold mb-1">{modelHeading}</h3>
                </div>
                { loading ? <SkeletonLoading mini /> : null}
                {children}
            </Model>
        )

    }
        

    if(loading)
            return <SkeletonLoading mini />
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
const PullRequestList = ({ isOpen, onClose, project, session }) => {

    const [prs, setprs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const gitURL = project.githubUrl;
            const {pathname} = url.parse(gitURL);
            fetch(API_URL + `/github${pathname}/pull/`, {
                headers: await GET_TOKEN_HEADER()
            }).then(res => res.json())
            .then(res => {
                setprs(res);
                setLoading(false);
            })
        }
        fetchData();
    }, []);


    const attachToSession = async (pr) => {
        setLoading(true);
        fetch(API_URL+`/session/${session._id}/pr`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                pullRequest: pr,
                pullRequestId: pr.number,
                prExist: true
            })
        }).then(res => res.json())
        .then(res => {
            if(!res.error)
                window.location.reload();

            //setLoading(false);
        })

        //console.log(pr);
    }



    return(
        <Outer model modelHeading="Select the PR" loading={loading} isOpen={isOpen} onClose={onClose}>
            { !loading ?  
            <div className="p-4">
            {
                prs.map(pr => {
                    return(
                        <div onClick={() => attachToSession(pr)} className="p-3 flex justify-between items-center flex-1 rounded hover:bg-gray-200 cursor-pointer hover--display-parent" >
                                <div className="flex-1">
                                    <h3 className="font-bold"> { pr.title}</h3>
                                    <div className='text-sm text-gray-800'>Created by <span className="font-semibold">{pr.user.login}</span></div>
                                     
                                </div>

                                <div className="w-24 hover--display text-right">
                                    <button className="px-4 py-2 text-xs text-white font-bold rounded bg-blue-600 hover:bg-blue-700">
                                        Select
                                    </button>
                                </div>
                                
                        </div>
                    )
                })
            }

            { prs.length == 0 ? <div>
                <p className="text-gray-700 text-sm text-center py-10">Could not find any pull request made by you on Github</p>
            </div> : null }
            </div> : null }
            
        </Outer>
    )
}


export default PullRequestList;