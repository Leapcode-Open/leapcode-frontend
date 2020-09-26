import React, { Component } from 'react'
import Card from '../../Components/Card';
import { Link } from 'react-router-dom';
import { API_URL, API_HEADERS, GET_TOKEN_HEADER } from '../../constants';
import Layout from '../../Components/Layout';

const projectsData = [{
    id:0,
    name:'First Pull Request',
    description:`🚀✨ Help beginners to contribute to open source projects`,
    org:'first-contributions',
    slug:'first-pr-request'
},{
    id:4,
    name:'firefox-data-docs',
    description:`A guide for Mozilla's developers and data scientists analyze and interpret the data gathered by the Firefox Telemetry system.`,
    org:'Mozilla',
    slug:'firefox-data-docs'
}, {
    id:1,
    name:'fx-private-relay',
    description:`Keep your email safe from hackers and trackers. Make an email alias with 1 click, and keep your address to yourself.`,
    org:'Mozilla',
    slug:'fx-private-relay'
}, {
    id:2,
    name:'tailwindcss',
    description:`A utility-first CSS framework for rapid UI development`,
    org:'tailwindcss',
    slug:'fx-private-relay'
}];



const ProjectBlock = ({project}) => (
    <Link to={`/projects/${project.slug}/activity`}>
        <Card className="p-6 hover:shadow">
            <h2 className="text-lg font-bold text-black mb-1">{project.name}</h2>
            <span className="block text-gray-800 text-xs hover:underline mb-2">{project.org}</span>
            <small className="text-gray-600 text-xs block font-inter">{project.description}</small>
        </Card>
    </Link>
)

export default class Projects extends Component {


    state = {
        projects: [],
        loading: true
    }

    componentDidMount = async () => {

       //const token = this.props.currentUser ? await this.props.currentUser.getIdToken() : 'no-token';
        fetch(API_URL+`/project/`, {
            headers: await GET_TOKEN_HEADER()
        })
            .then(res => res.json())
            .then(res => {
                if(res.error)
                    this.setState({
                        error: res.error
                    })

                else {
                    this.setState({
                        projects: res,
                        loading:false
                    });
                }
                
            })


        
    }
    render() {

        return (
            <Layout {...this.props}>
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-xl font-black py-16">Projects on Open</h2>
                    <div className="grid grid-cols-2 gap-4 ">
                        {
                            this.state.projects.map(project => (
                                <ProjectBlock key={project._id} project={project} />
                            ))
                        }

                        { this.state.loading ? <Card loading /> : null}
                        
                    </div>
                </div>
            </Layout>
        )
    }
}
