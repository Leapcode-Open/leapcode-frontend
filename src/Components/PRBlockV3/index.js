import React, { Component, Fragment, useState } from 'react'
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
import ErrorBox from '../Error';
import { GoInfo, GoIssueClosed, GoIssueOpened, GoIssueReopened, GoTrashcan, GoGitPullRequest, GoMarkGithub } from "react-icons/go";
import PullRequestList from '../PullRequestList';
import Tick from '../SVG/Tick';
import Model from '../Model';
import Confetti from 'react-confetti';
import PrimaryButton from '../PrimaryButton';

var url = require('url');



const CongratsProject = (props) => {

    if(props.loading)
        return (
            <Model {...props}>
                <SkeletonLoading mini />
            </Model>
        )

    else {
        return (
            <Model {...props}>
                <Confetti active={props.isOpen} />
                <div className="flex flex-col items-center text-center py-32 px-32" style={{ backgroundSize:'cover' }}>
                    <h2 className="text-3xl font-bold px-6 mb-5">Congrats on the merge!</h2>
                    <h2 className="text-3xl font-bold px-6 mb-5">🔥100 points has been added to your profile</h2>
                    {/* <p className="font-bold text-lg mt-6 mb-8 text-green-900">🎉 {props.course.points} Points</p> */}
                    <PrimaryButton onClick={() => window.location.reload()} className="py-3 text-sm" title="Explore More Issues" />
                </div>
            </Model>
        )
    }
    
}
    





const Heading = ({name, description }) => (
    <Fragment>
            <h3 className="font-medium mb-3">{name}</h3>
            <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm text-gray-700 mb-2"></div>
    </Fragment>
)


const PRBlockV3 = ({ session, project, firstTime }) => {

    const [prStatusLoading, changeLoading] = useState(false);
    const [prInfo, setPrInfo] = useState(session ? session.pullRequest : null);
    const [prModel, setprModel] = useState(false)
    const [error, seterror] = useState(null);
    const [successModel, setSuccessModel] = useState(false);
    const [successModelLoading, setsuccessModelLoading] = useState(false);
    const [successModelDetails, setSuccessModelDetai] = useState(null);


    const checkStatus = async () => {
        const gitURL = session.project.githubUrl;
        const {pathname} = url.parse(gitURL);
        changeLoading(true)
        fetch(API_URL+`/session/prCheck/${session._id}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json()).then(res => {
    
            setPrInfo(res.data);
            changeLoading(false)
        })

    }


    const onDelete = async () => {

        changeLoading(true);
        fetch(API_URL+`/session/${session._id}/pr/delete`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(!res.error)
                window.location.reload();

            else {
                seterror(res.error);
            }
            
        })
    }


    const updatePRonSession = async () => {
        setSuccessModel(true);
        setsuccessModelLoading(true);

        fetch(API_URL+`/session/${session._id}/pr/update`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER()
        }).then( res => res.json() )
        .then(res => {
            if(res.error) {
                setSuccessModel(false);
                setsuccessModelLoading(false);
                seterror(res.error)
            }
                

            else {
                setSuccessModel(true);
                setsuccessModelLoading(false);
                setSuccessModelDetai(res);
            }
        });
    }

    if(prStatusLoading)
        return (<SkeletonLoading mini />)

    if(prInfo) {

        const ifPRStatusChange = !prInfo.merged ? session.ifMerged ? true : false : false;
        return(
            <div className="py-4 font-inter">
                {error ? <ErrorBox error={error} /> : null }
                <div className="flex">
                    <div className="w-6 py-4">
                        <GoGitPullRequest className="" size="20" />
                    </div>
                    {
                        prStatusLoading ? <SkeletonLoading mini /> :
                            <div className="p-3 flex-1 rounded" >
                                <h3 className="font-bold"> { prInfo.title}</h3>
                                <div className='text-xs mt-1 text-gray-800'>Created by <span className="font-semibold">{prInfo.user.login}</span></div>
                                <div className="flex mt-4 mb-2 items-center">
                                    {/* <span onClick={() => checkStatus()} className="text-blue-800 cursor-pointer mr-3 text-xs hover:underline">Refresh PR Information</span> */}
                                    { !prInfo.merged ? <span onClick={() => onDelete(session._id)} className="text-red-800 cursor-pointer font-medium mr-5 text-sm hover:underline">Detach this PR</span> : null }
                                    <a className='flex items-center text-gray-700 font-medium text-sm hover:underline' target="_blank" rel="noopener noreferrer" href={prInfo.html_url}><GoMarkGithub color="#4d4d4d" className="mr-2" /><span>View pull request on Github</span></a>

                                </div>
                                <div className="mt-3 mb-3">
                                    { successModel ? <CongratsProject isOpen={successModel} loading={successModelLoading} onClose={() => setsuccessModelLoading(false)} /> : null }
                                    
                                        {
                                            ifPRStatusChange || prInfo.merged ? <div className='flex items-center '>
                                                    <Tick color={'#4CAF50'} />
                                                    <span className="ml-2 font-bold text-base">Successfully merged this PR! 🎉</span>
                                                </div> : null 
                                        }
                                        
                                    
                                    {
                                        ifPRStatusChange ?  <button onClick={() => updatePRonSession()} className="px-4 py-2 bg-black hover:bg-gray-900 text-white font-bold text-sm mt-4">🔥 Claim Points 100</button> : null 
                                    }
                                   
                                </div>
                            </div>
                    }          
                </div>
                
            </div>
        )
    }


    if(session)
        return (
            <div className="py-4 font-inter">
                    <div className="mt-5">
                        { error ? <ErrorBox error={error} /> : null }
                        <div className="text-center">
                            <button onClick={() => setprModel(true)} className="px-4 py-2 bg-black text-white text-sm font-bold text-center">Find your Pull Request</button>

                        </div>
                        { prModel ? <PullRequestList firstTime={firstTime} project={project} session={session} isOpen={prModel} onClose={() => setprModel(false)} /> : null }
                    </div>
            </div>
        )


    return (<div className='bg-red-200 p-2 rounded text-sm text-center text-gray-800 font-inter font-medium'>
        You have not linked to any issue yet
    </div>)
}


export default PRBlockV3;