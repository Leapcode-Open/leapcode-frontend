import React, { Component, Fragment } from 'react';
import Model from '../Model';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import PrimaryButton from '../PrimaryButton';
import SkeletonLoader from '../SkeletonLoading';
const AllProjects = ({ projects, onClick }) => (
    <div>
            <h4 className="font-bold text-base mb-3">Select a repository to work on</h4>
             {
                 projects.map((project) => (
                     <div onClick={() => onClick(project)} className="py-4 border-b border-gray-300 hover:bg-gray-200 pl-3 transition-all transition cursor-pointer">
                            <h3 className="mb-1"><span>{project.organisation}</span> / <span>{project.name}</span></h3>
                            <p className="text-xs text-gray-600">{project.description}</p>
                     </div>
                 ))
             }
    </div>
)


const SelectProjectBlock = ({ project, onChangeRequest }) => (
    <div className="">
        <div className="flex justify-between items-center">
            <div>
                <h4 className='font-bold text-xs mb-6'>Selected Project</h4>
                <h3 className="mb-1"><span>{project.organisation}</span> / <span>{project.name}</span></h3>
                <p className="text-xs text-gray-600">{project.description}</p>
            </div>
           
            <div onClick={onChangeRequest}  className="cursor-pointer text-xs text-blue-700 w-1/4 text-right">Change Project</div>
        </div>
        
        
    </div>
)
export default class NewSessionModel extends Component {

    state = {
        projects: [],
        loading: true,
        projectLoading: true,
        selectedProject: null,
        projectLoading: true
    }

    async componentDidMount() {
        fetch(API_URL+'/project', {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            this.setState({
                projects: res,
                projectLoading: false,
                loading: false
            })
        });
    }


    onProjectOnClick = (project) => {
        //console.log(project)
        this.setState({
            selectedProject: project
        })
    }

    onChangeRequest = () => {
        this.setState({
            selectedProject: null
        })
    }


    onCreate = async () => {
        this.setState({
            loading: true
        })
        fetch(API_URL+'/session', {
            method: 'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                projectId: this.state.selectedProject._id
            })
        })
        .then(res => res.json())
        .then(res=> {
            if(res._id)
                window.location.href=`/session/${res.slug}/activity`;
  //         console.log(res);
        })
    }
 


  render() {
      
    return (
     <Model {...this.props}>
         <div className='p-6'>
             <div className="border-b border-gray-200 mb-4">
                <h3 className="text-lg font-bold mb-1">Join a new project</h3>
                <p className="text-xs text-gray-500 mb-3">Exploring new projects to work on? Choose from our handpicked projects for you.</p>
             </div>

            { this.state.loading ? <SkeletonLoader /> : 
             <Fragment>
                { !this.state.selectedProject ? <AllProjects projects={this.state.projects} onClick={this.onProjectOnClick}/> : <SelectProjectBlock onChangeRequest={this.onChangeRequest} project={this.state.selectedProject} /> }
                
                { this.state.selectedProject ? 
                <div className="mt-10">
                    <PrimaryButton onClick={this.onCreate} className="py-3" title="Join the project"/>
                </div>  : null } 
                </Fragment> }



         </div>
     </Model>
    );
  }
}
