import React, { Component } from 'react'
import Card from '../../Components/Card';
import Activity from '../../Components/Activity';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import Layout from '../../Components/Layout';
import { GoMarkGithub } from "react-icons/go";



const projectDetails = {
    name:'First Pull Request',
    description:`🚀✨ Help beginners to contribute to open source projects`,
    org:'first-contributions',
    slug:'first-pr-request',
    issues: [],
    people: []
}

export default class SingleProject extends Component {

    state = {
        project: projectDetails,
        pageparam: '',
        loading: true
    }


    async componentDidMount() {

        fetch(API_URL + `/session/slug/${this.props.match.params.id}`, {
            headers: await GET_TOKEN_HEADER()
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    session: res,
                    project: res.project,
                    loading: false
                })
            })
        this.setState({
            pageparam:this.props.match.params.id
        })
    }   
    render() {

        const { project, session } = this.state;

        if(this.state.loading)
            return (
                <div className="mx-auto max-w-4xl pt-16">
                    <div className="">
                        <Card className="px-6 py-6" loading>
                            
                        </Card>
                    </div>
                </div>
            )
        return (
            <Layout {...this.props}>
            <div className="mx-auto max-w-4xl pt-16">
                <div className="">
                    
                    <Card className="px-6 py-6">
                        <div className="mb-3 text-xs text-gray-700">
                            <Link to="/projects" className="hover:underline text-xs">Projects </Link><span className="font-semibold text-gray-700">/ {project.name }</span>
                        </div>
                        <div className="flex justify-between items-center pb-3">
                            <div>
                                <h2 className="font-bold mb-2">{project.name}</h2>
                                <p dangerouslySetInnerHTML={{ __html: project.description }} className="text-gray-700 text-sm"></p>
                                <a className='text-blue-700 text-sm hover:underline block mt-4 flex items-center' target="_blank" href={project.githubUrl}><GoMarkGithub className="mr-2" />View on Github</a>
                            </div>

                            <div className="w-1/4 flex justify-end">
                                {/* <a className='text-blue-700 text-xs hover:underline' target="_blank" href={project.githubUrl}>View on Github</a> */}
                            </div>
                            
                        </div>
                    </Card>
                </div>

                <div className="">

                <Router>
                    <Route path={this.props.match.path  + '/'} exact component={()=><h1>Select</h1>} />
                    <Route path={this.props.match.path  + '/activity/'} exact  render={(props) => <Activity {...props} session={session} project={project} />} />
                    <Route path={this.props.match.path  + '/activity/:lessonId'} exact  render={(props) => <Activity {...props}  session={session} project={project} />} />
            
                </Router>


                </div>
            </div>
            </Layout>
        )
    }
}
