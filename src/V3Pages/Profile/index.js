import React, { Component } from 'react'
import Layout from '../../Components/Layout';
import Card from '../../Components/Card';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import SkeletonLoading from '../../Components/SkeletonLoading';
import ProfileAvatarHalf from '../../Components/ProfileAvatarHalf';
import ScorePointer from '../../Components/ScorePointer';
import V3ProjectCards from '../../Components/V3ProjectCards';
import BadgesList from '../../Components/BadgesList';

export default class Profile extends Component {


    state = {
        error: null,
        loading: true,
        profile: null,
        badges: []
    }

    async componentDidMount() {
        const { slug } = this.props.match.params;
        fetch(API_URL+`/profile/${slug}`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error)
                this.setState({
                    error: res.error,
                    loading: false,
                    
                })
            
            else {

                const projects =
                this.setState({
                    profile: res,
                    sessions: res.session,
                    projects: res.projects,
                    error: null,
                    loading:false,
                    badges: res.badges
                })
            }
        }).catch((err) => {
            this.setState({
                error: err.error,
                loading: false
            })
        })
    }


    render() {

        const { loading, profile, sessions, error, projects, badges } = this.state;

        if(loading)
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

        if(error)
            return (
                <Layout {...this.props}>
                    <div className="mx-auto">
                            <div className="">
                                <Card className="px-6 pt-6">
                                    <div className="max-w-4xl mx-auto flex justify-between">
                                        <div className="flex-1 text-center"> 
                                              <p className="text-center py-10 text-gray-600">{error}</p>
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
                            <Card className="px-6 pt-6 pt-8 py-10 mb-4">
                                <div className="max-w-4xl mx-auto flex justify-between">
                                    <div className="flex-1 flex flex-col justify-center items-center text-center"> 
                                        <div className="w-32">
                                            <img className="rounded-full" src={profile.displayPhoto} />
                                        </div>
                                        <div className="flex-1 flex mt-6 flex-col justify-center">
                                            <h1 className="font-bold">{profile.displayName ? profile.displayName : <span className="text-gray-500 text-sm font-regular">No Name</span>}</h1>
                                            <h3 className="text-sm text-gray-700">@{profile.username}</h3>
                                            <a href={profile.githubInfo.html_url} className="mt-1 text-xs text-blue-700 hover:underline">Github Profile</a>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="max-w-4xl mx-auto mt-8">
                                <div className="flex md:gap-10">
                                    <div className="w-2/5">
                                        <Card className="p-6">
                                            <div className={`flex items-center pb-4 border-gray-300 border-b`}>
                                                    <div className="">
                                                        <h4 className="text-xs uppercase text-gray-700 font-bold">Points</h4>
                                                        <ScorePointer big loading={loading} points={profile.points} />
                                                    </div>
                                            </div>
                                            <div className={`flex items-center py-4`}>
                                                    <div className="">
                                                        <h4 className="text-xs uppercase text-gray-700 font-bold">BADGES</h4>
                                                        <BadgesList badges={badges} />
                                                        {/* <small className="opacity-50 text-xs">No badges found</small> */}
                                                    </div>
                                            </div>
                                        </Card>
                                    </div>
                                    <div className="flex-1 ml-8">
                                        <div>
                                            <h2 className="font-bold text-black text-xl font-bold mb-3">Projects working on</h2>
                                            <V3ProjectCards projects={projects} onlyProjects />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </Layout>
        )

        
    }
}
