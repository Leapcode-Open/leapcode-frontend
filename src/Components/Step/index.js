import React, { Component, Fragment, useState } from 'react';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../SkeletonLoading';
import ErrorBox from '../Error';
import Issue from '../Issue';
import PRBlock from '../PRBlock'
import FPRIssueList from '../FPRIssueList';
import PRBlockV3 from '../PRBlockV3';
var url = require('url');


const Heading = ({name, description }) => (
    <Fragment>
            <h3 className="font-medium mb-3">{name}</h3>
            <div dangerouslySetInnerHTML={{ __html: description }} className="text-sm text-gray-700 mb-2"></div>
    </Fragment>
)


// const PR = ({ step, onPRSubmit, onPRChange, info, error, onDelete, session }) => {


//     const [prStatusLoading, changeLoading] = useState(false);
//     const [prInfo, setPrInfo] = useState(session.pullRequest);

//     const checkStatus = async () => {
//         const gitURL = session.project.githubUrl;
//         const {pathname} = url.parse(gitURL);
//         changeLoading(true)
//         fetch(API_URL+`/session/prCheck/${session._id}`, {
//             headers: await GET_TOKEN_HEADER()
//         }).then(res => res.json()).then(res => {
//             console.log(res);
//             setPrInfo(res.data);
//             changeLoading(false)
//         })

//     }

//     if(prStatusLoading)
//         return (<SkeletonLoading mini />)

//     if(prInfo)
//         return(
//             <div className="py-6 border-b border-gray-300 font-inter">
//                 <Heading {...step} />
//                 <div className="p-3 bg-green-200 rounded" >
//                     <h3 className="font-bold"> { prInfo.title}</h3>
//                     <div className='text-sm text-gray-800'>Created by <span className="font-semibold">{prInfo.user.login}</span></div>
//                     <div className="flex mt-3">
//                         <span onClick={() => checkStatus()} className="text-blue-800 cursor-pointer mr-3 text-xs hover:underline">Refresh PR Information</span>
//                         <span onClick={() => onDelete(info._id)} className="text-red-800 cursor-pointer  text-xs hover:underline">Detach this PR</span>
//                     </div>
//                 </div>
//             </div>
//         )
//    return (
//        <div className="py-6 border-b border-gray-300 font-inter">
//             <Heading {...step} />
//             <div className="mt-5">
//                 { error ? <ErrorBox error={error} /> : null }
//                 <small className="text-xs block mb-1">Enter Pull Request ID</small>
//                 <form onSubmit={onPRSubmit}>
//                     <div className="flex">
//                         <input onChange={onPRChange} required className="px-3 py-2 text-sm border border-gray-400 w-full rounded" placeholder="#"/> 
//                         <button type="submit" className="text-sm text-white font-medium px-3 py-1 bg-blue-500 hover:bg-blue-600 w-1/3 ml-3 rounded" >Connect PR</button>
//                     </div>
//                 </form>
//             </div>
//        </div>
//    )
// }

// const ISSUE = ({ step, session }) => {
//     const [issueInfo, setPrInfo] = useState(session.issue);

//     return (
//         <div className="py-6 border-b border-gray-300 font-inter">
//              <h3 className="font-medium mb-3">{step.name}</h3>
//              <p className="text-sm text-gray-700 mb-2">{step.description}</p>
//              <div className="mt-5">
//                  <small className="text-xs block mb-1">Enter the URL of your Issue</small>
//                  <form >
//                     <div className="flex">
                    
//                             <input className="px-3 py-2 text-sm border border-gray-400 w-full rounded" placeholder="https://github.com/"/> 
//                             <button className="text-sm text-white font-medium px-3 py-1 bg-blue-500 hover:bg-blue-600 w-1/3 ml-3 rounded" >Connect Issue</button>
                
//                     </div>
//                  </form>
//              </div>
//         </div>
//     )
//  }

export default class Step extends Component {

    state = {
        loading: false,
        pr:null,
        issue: null,
        stepLoading: true,
        info: null,
        error: null
    }

    onPRSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            error:null
        });
        const { step, session } = this.props;
        const gitURL = session.project.githubUrl;
        const {pathname} = url.parse(gitURL);
        fetch(API_URL+`/github${pathname}/pull/${this.state.pr}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
    
            if(res.errors) {
                this.setState({
                    error: res.message,
                    loading:false
                })
            }

            else {
                if(res.sameUser)
                    this.onSubmit(res.data)
                else {
                    this.setState({
                        error: 'You are not the owner of this pull request',
                        loading:false
                    })
                }
            }
                
          
        });
    }


    onPRChange = (e) => {
        this.setState({
            pr: e.target.value
        })
    }

    onIssueChange = (e) => {
        this.setState({
            issue: e.target.value
        })
    }

    onIssueSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            error:null
        });
        const { step, session, project } = this.props;
        const gitURL = project.githubUrl;
        const {pathname} = url.parse(gitURL);
        fetch(API_URL+`/github${pathname}/issue/${this.state.issue}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            //console.log(res);
            if(res.errors) {
                this.setState({
                    error: res.message,
                    loading:false
                })
            }

            else {
                this.onSubmit(res.data)
            }
            
            
           
        }).catch(err => {
            this.setState({
                loading:false,
                error: err
            })
        });



    }

    onSubmit = async (info) => {
        const { step, session } = this.props;
        const type = step.type;

        fetch(API_URL+`/step/done/${session._id}/${step._id}`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                type,
                info
            })
        }).then(res => res.json())
        .then(res => {
            if(!res.error)
                window.location.reload();

            else {
                this.setState({
                    loading: false,
                    error: res.error,
                });
            }
            
           
        }).catch((err) => {
            this.setState({
                loading: false,
                error:'some error occuered'
            })
        })
    }


    removeStepInfo = async (id) => {
        this.setState({
            loading: true
        })
        fetch(API_URL+`/step/remove/done/${id}`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error)
                this.setState({
                    info: null,
                    loading: false
                });

            else
                window.location.reload();
           
        })
    }

  render() {
      const { step, session, project } = this.props;
      const {  error } = this.state;
        const info = this.state.info ? this.state.info : step.info

    if(this.state.loading)
        return <SkeletonLoading mini />

     if(step.type == 'PR')
        return (<PRBlockV3 project={project} session={session} onDelete={this.removeStepInfo} error={error} info={info} loading={this.state.loading} onPRChange={this.onPRChange} onPRSubmit={this.onPRSubmit} step={step} />)

    if(step.type == 'ISSUE_SELECT')
        return (<Issue session={session} onDelete={this.removeStepInfo} error={error} info={info}  loading={this.state.loading} onIssueChange={this.onIssueChange} onIssueSubmit={this.onIssueSubmit} step={step} />)


    if(step.type == 'FPR-ISSUE')
        return (<FPRIssueList session={project.session} project={project} loading={this.state.loading} step={step} />)

    if(step.type == 'NO')
        return <Heading {...step} />
    return (<Heading {...step} />)
  }
}
