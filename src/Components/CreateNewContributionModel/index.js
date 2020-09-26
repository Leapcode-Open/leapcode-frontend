import React, { useState } from 'react';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import Model from '../Model';
import { Redirect } from 'react-router-dom';
import SkeletonLoading from '../SkeletonLoading';
import IssueBlock from '../IssueBlock';





const CreateNewContributionModel = ({ isOpen, issue, onClose, project, firstTime, noRedirect, onIssueAdded }) => {
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
                projectId: project._id,
                firstTime
            })
        }).then(res => res.json())
        .then((res) => {
            if(res.slug) {
                if(noRedirect) {
                    onIssueAdded()
                }

                else {
                    setRedirectUrl(`/v3/project/${project.slug}/contribution/${res.slug}`);
                }
            }
                
            
            //setModelLoader(false)
        })
    }

    if(issue)
        return (
            <Model onClose={onClose} isOpen={isOpen}>
                { redirectUrl ? <Redirect to={redirectUrl} /> : null}
                <div className={`p-6 ${modelLoader ? 'opacity-25 pointer-events-none' : ''} `}>
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


export default CreateNewContributionModel;