import React, {useState} from 'react';
import Model from '../Model';
import IssueListWrapper from '../IssueListWrapper';
import IssueBlock from '../IssueBlock';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';




const FPRIssueList = ({ project, onIssueAdded, session }) => {
    const [issueModel, setissueModel] = useState(false);

    const onDelete = async () => {
        fetch(API_URL+`/session/${project.firstSession._id}/deleteSession`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(!res.error) {
                window.location.reload()
            }

            else {
                //console.log(res)
            }
        });
    }


    if(project.firstSession)
        return (
            <div>
                <IssueBlock issue={project.firstSession.issue}></IssueBlock>
                <span onClick={() => onDelete(project.firstSession._id)} className="text-red-800 cursor-pointer block text-xs hover:underline mt-3">Detach this Issue</span>

            </div>
            
        )
    return (
        <div className="flex items-center">
            <div className>
                <button onClick={() => setissueModel(true)} className="px-4 py-2 bg-black text-white text-sm font-bold">Pick up an Issue</button>
            </div>

                <IssueListWrapper onIssueAdded={onIssueAdded} modelHeading={"Select your first issue"} firstTime project={project} noRedirect model isOpen={issueModel} onClose={() => setissueModel(false)} />
        </div>
    )
}

export default FPRIssueList;