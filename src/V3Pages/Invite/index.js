import React, { Component, Fragment } from 'react'
import { API_URL, GET_TOKEN_HEADER } from '../../constants'
import { GoRss } from 'react-icons/go'
import Card from '../../Components/Card'
import firebase from '../../config/firebase';
import { Redirect } from 'react-router-dom';
export default class Invite extends Component {

    state = {
        code: '',
        loading: false,
        invite: null,
        invitee: null,
        error:null,
        redirect: null
    }

    checkCode = async (e) => {
        e.preventDefault();

        

        this.setState({ loading: true });
        
        fetch(API_URL+'/invite', {
            method:'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({ code: this.state.code })
        }).then(res => res.json())
        .then(async res => {
            if(res.error) {
                this.setState({
                    error: res.error,
                    loading: false,
                })
            }
              
            else {
                this.setState({
                    loading: false,
                    invite: res.invite,
                    invitee: res.invitee,
                    type: res.type
                });
                const ff = await firebase.auth().currentUser.getIdTokenResult(true);
            }
        }).catch((err) => {
            this.setState({
                error: err.error,
                loading: false,
            })
        })
    }



    componentDidMount() {

        const { claims } = this.props
        if(claims) {
            if(claims.claims.contributor) {
                this.setState({
                    redirect: '/'
                })
            } 
        }
    }


    render() {


        const { invite, invitee, redirect, type } = this.state;

        if(redirect)
            return (<Redirect to={redirect} />)

        if(invite)
            return (<div className="w-screen h-screen flex flex-col items-center justify-center">
                <img className="w-32 mb-8" src={require('../../assets/leapcode-new-logo.svg')} />
                <Card className="w-1/4 bg-white rounded-lg px-6 py-10 flex items-center flex-col">

                        { type == 'CUSTOMINVITE'? <h2>Thanks to {invitee.name}, You are in!</h2> : <Fragment>
                        <img className="rounded-full w-20 h-20 mb-8 border border-gray-200" src={invitee.displayPhoto} />
                        <div>{invitee.displayName ? invitee.displayName : `@${invitee.username}` } has invited you! 🎉</div>
                    </Fragment> }
                    


                    <p className="text-sm text-gray-700 text-center my-4">Welcome to the Leapcode community. Get access to open source projects & resources to help you get started.</p>
                    <a href='/' className="w-full py-3 text-sm bg-black text-white text-center rounded font-bold mt-3">Go To Dashboard</a>
                    
                </Card>
            </div>)


        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">

                <img className="w-32 mb-8" src={require('../../assets/leapcode-new-logo.svg')} />
               
                <Card loading={this.state.loading} className="w-1/4 px-6 py-10">
                    
                    <h6 className="font-bold">Have an invite code?</h6>

                      { this.state.error ? <div className="py-2 px-4 rounded my-3 text-sm bg-red-200 text-gray-800">{this.state.error}</div> : null}  
                    
                    <form onSubmit={this.checkCode} className="w-full mt-6">
                        <input placeholder="Enter your invite code" required className="text-sm shadow mb-4 appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => this.setState({ code: e.target.value })} />
                        <button className="px-4 py-2 mt-3 bg-blue-700 text-white text-sm rounded font-bold">Continue</button>
                    </form>
                </Card>

                <Card className="mt-6  w-1/4 bg-white rounded-lg px-6 py-10 flex flex-col">
                    
                    <p className="text-sm text-gray-700 py-3 text-center"> Leapcode is currently in Private Beta. Join our waitlist to get early access when we launch.</p>
                    <a href="https://leapcode-open.typeform.com/to/YKAb4w" className="w-full py-3 text-sm bg-black text-white text-center rounded font-bold mt-4">Join the waitlist</a>
                    <p className="text-sm text-gray-700 py-3 text-center mt-2">P.S: Want to cut the line? Just tweet about us by tagging @leapcodeio</p>
                    
                </Card>

            </div>
        )
    }
}
