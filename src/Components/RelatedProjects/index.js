import React, { Component } from 'react'
import SkeletonLoading from '../SkeletonLoading'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import Card from '../Card'
import { RepoBlock } from '../RepoBlock'

export default class RelatedProjects extends Component {

    state = {
        loading: true,
        projects: []
    }

    async componentDidMount() {
        fetch(API_URL+`/project/related/${this.props.projectSlug}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(async res => {
            if(res.ok) {
                const projects = await res.json();
                this.setState({
                    projects,
                    loading:false
                })
            }
        })
    }
    render() {


        const { projects, loading } = this.state;

        if(this.state.loading)
            return (<div className="mt-24 border-t border-gray-300">
            {/* <h2 className="text-gray-800 mb-6 pt-6">Related Projects</h2> */}
            <div className="grid grid-cols-2 gap-3">
            <SkeletonLoading />

            </div>
        </div>)

        if(projects.length == 0)
            return (<div></div>)
        return (
            <div className="mt-12 mb-12 border-t border-gray-300">
                <h2 className="text-gray-800 mb-6 pt-6">Related Projects</h2>
                <div className="grid grid-cols-2 gap-3">
                { projects.map(project => (
                    <RepoBlock {...project} />
                )) }

                </div>
            </div>
        )
    }
}
