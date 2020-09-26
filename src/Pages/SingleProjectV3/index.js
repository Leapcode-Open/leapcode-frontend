import React, { Component } from 'react'
import Card from '../../Components/Card';
import ActivityV3 from '../../Components/ActivityV3';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import Layout from '../../Components/Layout';
import SessionCard from '../../Components/SessionCard';
import IssueList from '../../Components/IssueList';
import ContributionList from '../../Components/ContributionsLists';
import ContributionDetails from '../../Components/ContributionDetails';
import { GoMarkGithub } from "react-icons/go";
import SkeletonLoading from '../../Components/SkeletonLoading';
import ContributorsListModel from '../../Components/ContributorsListModel';
import RelatedProjects from '../../Components/RelatedProjects';


const projectDetails = {
    name:'First Pull Request',
    description:`🚀✨ Help beginners to contribute to open source projects`,
    org:'first-contributions',
    slug:'first-pr-request',
    issues: [],
    people: []
}






export default class SingleProjectV3 extends Component {

    state = {
        project: projectDetails,
        pageparam: '',
        loading: true,
        contributorListModelIsOpen: false
    }


    async componentDidMount() {
        
        fetch(API_URL + `/project/slug/${this.props.match.params.id}`, {
            headers: await GET_TOKEN_HEADER()
        })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    this.setState({
                        error: res.error,
                        loading: false
                    })
                }

                else {
                    this.setState({
                        project: res,
                        loading: false
                    })
                    window.analytics.page(this.props.match.url);
                }
                
            })
        this.setState({
            pageparam:this.props.match.params.id
        })
    }   


    openContributorList = () => {
        this.setState({
            contributorListModelIsOpen: true
        })
    }
    render() {

        const { project } = this.state;
        //console.log('pageid', this.props.match.params)


        if(this.state.loading)
        return (
            <Layout {...this.props}>
                <div className="mx-auto">
                        <div className="">
                            <Card className="px-6 pt-6">
                                <div className="max-w-4xl mx-auto flex justify-between">
                                    <div className="flex-1 flex"> 
                                        <SkeletonLoading />
                                    </div>
                                </div>
                            </Card>
                        </div>
                </div>
            </Layout>
        )

        if(this.state.error)
            return (
                <Layout {...this.props}>
                <div className="mx-auto">
                        <div className="">
                            <Card className="px-6 pt-6">
                                <div className="max-w-4xl mx-auto flex justify-between">
                                    <div className="text-center py-8"> 
                                        <p className="text-center">
                                            Oops. Seems like this project doesnt exist.

                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                </div>
            </Layout>
            )
        return (
            <Layout {...this.props}>
            <div className="mx-auto">
                <div className="">
                    
                    <Card noBorder className="px-6 pt-6">
                        <div className="max-w-4xl mx-auto flex justify-between">
                            <div className="flex-1"> 
                                <div className="mb-3 text-xs text-gray-500">
                                    <Link to="/projects" className="hover:underline text-xs">Projects </Link><span className="font-semibold text-gray-500">/ {project.name }</span>
                                </div>
                                <div className="flex flex-col justify-between pb-3">
                                    <div>
                                    <h2 className="mb-2">{project.organisation} <span className='opacity-50'>/</span> <span className="font-bold">{project.name}</span></h2>
                                        {/* <div className="text-gray-800 text-sm" dangerouslySetInnerHTML={{ __html: project.githubInfo ? project.githubInfo.description : project.description }} ></div> */}
                                        <div dangerouslySetInnerHTML={{ __html: project.description}} className='text-gray-700 text-sm'></div>
                                    </div>

                                    {
                                        project.githubInfo ? <div>
                                            <div className="flex">
                                                { project.githubInfo.languages ? Object.keys(project.githubInfo.languages).map(la => <div className="px-2 py-1 bg-blue-100 text-blue-500 text-xs mt-3 rounded mr-2">{la}</div> ) :  <div className="px-2 py-1 bg-blue-100 text-blue-500 text-xs mt-3 rounded">{project.githubInfo.language}</div> }
                                                

                                            </div>
                                        </div> : null
                                    }

                                    <div className="flex mt-6">
                                        <a className='flex items-center text-blue-700 text-sm hover:underline' target="_blank" rel="noopener noreferrer" href={project.githubUrl}><GoMarkGithub color="#4d4d4d" className="mr-2" /><span>View on Github</span></a>
                                        {/* { project.gitpod ? project.gitpod.length > 0 ? <a target="_blank" href={project.gitpod} className='ml-6'><img src="https://gitpod.io/button/open-in-gitpod.svg"></img></a> : null : null } */}
                                    </div>
                                    
                                </div>
                            </div>


                            <div className="w-64 flex flex-col items-end justify-center">
                                <div className="flex flex-row">
                                    {
                                        project.contributors.slice(0, 5).map((contributor) => <div key={contributor._id} className="-ml-4"><Link to={`/u/${contributor.username}`}><img className="rounded-full w-10 border-2 border-white" src={contributor.displayPhoto} /></Link></div> )
                                    }

                                   {
                                       project.contributors.length > 5 ? <div onClick={this.openContributorList} className="-ml-4 rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center text-xs font-bold text-gray-600"> + {project.contributors.length - 5 }</div> : null 
                                   }
                                </div>

                                { project.contributors.length == 0 ? <span className="text-xs text-gray-600 text-right">Be the first contributor by <br /> picking up an issue</span> : null }
                                
                            </div>
                            

                        </div>
                    </Card>
                </div>

                <div className="pb-12">
                        
                        <Route path={this.props.match.path  + '/issue/'} exact render={(props) => <IssueList currentUser={this.props.currentUser} {...props} project={project} />} />
                        <Route path={this.props.match.path  + '/contribution/'} exact render={(props) => <ContributionList currentUser={this.props.currentUser} {...props} project={project} />} />
                        <Route path={this.props.match.path  + '/contribution/:slug'} exact render={(props) => <ContributionDetails currentUser={this.props.currentUser} {...props} project={project} />} />

                        <Route path={this.props.match.path  + '/activity/'} exact  render={(props) => <ActivityV3 currentUser={this.props.currentUser} {...props} session={[]} project={project} />} />
                        <Route path={this.props.match.path  + '/activity/:lessonId'} exact  render={(props) => <ActivityV3 {...props} currentUser={this.props.currentUser}  session={[]} project={project} />} />
                 

                </div>
                {this.state.contributorListModelIsOpen ? <ContributorsListModel onClose={() => this.setState({ contributorListModelIsOpen: false })} isOpen={this.state.contributorListModelIsOpen} contributors={project.contributors} /> : null }
                
                
                <div className="max-w-4xl mx-auto -mt-6">
                    <RelatedProjects projectSlug={project.slug} />

                </div>
            </div>
            </Layout>
        )
    }
}


                  /* <div className="flex justify-between items-center py-4">
                        <h3 className="font-semibold text-base my-6">Pull Requests</h3>
                        <div>
                            <div className="px-6 py-2 bg-blue-800 text-sm text-white rounded" >Create a new Contribution</div>

                        </div>
                    </div>
                    
                    <div className="">
                        {
                            project.sessions.map(session => <SessionCard session={session} /> )
                        }
                    </div> */