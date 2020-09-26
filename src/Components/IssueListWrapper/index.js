import React, { useState, useEffect, Fragment } from 'react';
import CreateNewContributionModel from '../CreateNewContributionModel';
import IssueBlock from '../IssueBlock';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
import Card from '../Card';
import { set } from 'lodash';
import Model from '../Model';
var url = require('url');


const OuterLater = ({model, children, isOpen, onClose, modelHeading}) => {
    if(model)
        return (
            <Model isOpen={isOpen} onClose={onClose}>
                    <div className="border-b border-gray-200 mb-4 p-4">
                        <h3 className="text-lg font-bold mb-1">{modelHeading}</h3>
                    </div>
                {children}
            </Model>
        )

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}


const IssueListWrapper = ({ project, noRedirect, model, isOpen, onClose, modelHeading, firstTime, onIssueAdded }) => {

    const [modelIsOpen, setModelIsOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);


    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(function effectFunction() {
        async function fetchData() {
            const gitURL = project.githubUrl;
            const {pathname} = url.parse(gitURL);
            fetch(API_URL + `/github${pathname}/issue/?labels=${project.labels ? project.labels : 'nill'}`, {
                headers: await GET_TOKEN_HEADER()
            }).then(res => res.json())
            .then(res => {
               setIssues(res);
               setLoading(false);
            })
        }
        fetchData();
    }, []);


    const onClickPickIssue = (issue) => {
        window.analytics.track('Picked up Issue', {
            project: project.slug,
            issue: issue.title
        });
        setSelectedIssue(issue);
        setModelIsOpen(true);
    }

    if(loading)
        return (
            <OuterLater model={model} isOpen={isOpen}>
                <SkeletonLoading mini />
            </OuterLater>
        
        )


    
    
    return (
        <Fragment>
            <OuterLater model={model} isOpen={isOpen} onClose={onClose} modelHeading={modelHeading}>
            { issues.filter(a => !a.pull_request).map(issue => (
                <div className='p-4 bg-white border-b border-gray-200'>
                    <div className="flex justify-between items-center">
                        <IssueBlock issue={issue} />

                        <div className="w-32 flex justify-end">
                            {
                                !issue.sessions ? <div>
                                <button onClick={() => onClickPickIssue(issue)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded">Pick this</button>
                            </div> : <span className="px-4 py-2 bg-blue-700 text-white text-sm opacity-50 font-bold rounded">Picked up</span> }
                        
                        
                        </div>
                    </div>
                    
                </div>
            )) }

            { issues.length == 0 ? <div>
                <p className="text-gray-700 text-sm text-center py-10">No open issues found on this project on Github</p>
            </div> : null }
                
            </OuterLater>

        <CreateNewContributionModel onIssueAdded={onIssueAdded} firstTime={firstTime} noRedirect={noRedirect} project={project} isOpen={modelIsOpen} issue={selectedIssue} onClose={() => setModelIsOpen(false)}  />

        </Fragment>

    )
}

export default IssueListWrapper;