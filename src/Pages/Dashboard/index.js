import React, { Component, useContext } from 'react'
import Card from '../../Components/Card'
import ScorePointer from '../../Components/ScorePointer'
import ProfileAvatarHalf from '../../Components/ProfileAvatarHalf'
import { Link } from 'react-router-dom'
import { AuthContext } from "../../providers/AuthProvider";
import Layout from '../../Components/Layout'
import NewSessionModel from '../../Components/NewSessionModel'
import YourSessions from '../../Components/YourSessions'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'



const DashLoading = () => (
    <div className="mx-auto max-w-4xl">
        <h2 className="text-xl font-black py-16">Loading your Dashboard</h2>
        <div className="flex md:gap-10">
            <div className="w-2/5">
                <Card loading>
                    
                </Card>
            </div>
        </div>
    </div>                
)

class Dashboard extends Component {


    state = {
        isNewSessionOpen: false,
        user: null,
        loading: true,
        badges: []
    }



    async componentDidMount() {
        fetch(API_URL+`/auth/user`, {
            headers: await GET_TOKEN_HEADER()
        }).then(res => {

            if (res.status == '401') {
                window.location.href="/logout"
            }

            return res.json()
        
        })
        .then(res => {
            if(res.userDetails)
                this.setState({
                    user: res.userDetails,
                    badges: res.Badges,
                    loading:false
                })
            else {
                this.setState({
                    loading: false
                })
            }
        })
    }



    render() {

       

        if(this.props.authLoading)
            return (<DashLoading />)

       
        return (
            <Layout {...this.props}>
            <div className="mx-auto max-w-4xl">
                <h2 className="text-xl .font-medium py-10">Welcome <span className= "font-black">{ this.props.userDetails ? this.props.userDetails.displayName : '' }!</span></h2>
                <div className="flex md:gap-10">
                    <div className="w-2/5">
                        <Card>
                            <>
                                <ProfileAvatarHalf loading={this.state.loading} user={this.state.user} badges={this.state.badges} currentUser={this.props.currentUser} className=" px-6 py-6 border-b-2 border-gray-200" fullName="Sethu Sathyan" points='20' />
                            </>
                        </Card>
                    </div>
                    <div className="flex-1 ml-8">
                        <div>
                            <h2 className="font-bold text-black text-xl font-bold mb-3">Your Projects</h2>
                            <p className="font-regular text-gray-700">Ready to jump back in?</p>
                            <YourSessions />


                        </div>
                    </div>
                </div>
            </div>
            </Layout>
        )
    }
}


// const Dashboard = (props) => {
//     console.log('test',props)
//     let currentUser = useContext(AuthContext);
//     return <DashboardMain {...props} authLoading={currentUser.authLoading} signOut={currentUser.signOut} token={currentUser.token} setToken={currentUser.setToken} currentUser={currentUser.currentUser}></DashboardMain>

// }


export default Dashboard