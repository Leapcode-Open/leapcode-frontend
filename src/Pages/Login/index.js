import React, { Component, useContext} from 'react'
import { UserContext } from "../../providers/UserProvider";
import { auth, signInWithGithub, provider } from '../../config/firebase';
import { IoLogoGithub } from 'react-icons/io'
import { API_URL, API_HEADERS } from '../../constants';
import { Redirect } from 'react-router-dom';
import Card from '../../Components/Card';
import Cookies from 'js-cookie'

export default class Login extends Component {

    state = {
        redirect: null,
        loading: true,
        error: null
    }


    async componentDidMount() {
        const currentUser = await auth().currentUser;
        if(!currentUser) {

            const search = this.props.location.search;
            const params = new URLSearchParams(search);
            const ghlogin = params.get('ghlogin');

            if(ghlogin=='true') {
                auth().signInWithRedirect(provider);
            }

            else {
                this.setState({
                    loading: false
                })
            }
        }

        else {

            auth().getRedirectResult().then(async result => {
                if(result.credential) {
                    const userToken = await auth().currentUser.getIdToken();
                    this.loginUser(result, userToken);
                }


                else {
                    //console.log('hello')
                    this.setState({
                        loading: false
                    })
                    this.setState({
                        redirect: '/'
                    })
                }
            })


           
        }

        

       

    }




    loginUser = (res, token) => {
        fetch(API_URL+`/auth/login`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify({
                token: token,
                username: res.additionalUserInfo ? res.additionalUserInfo.username : '',
                githubInfo: res.additionalUserInfo ? res.additionalUserInfo.profile : {}
            })
        }).then(res => res.json())
            .then(resapi => {

                const search = this.props.location.search;
                const params = new URLSearchParams(search);
                const toPath = params.get('topath') ? params.get('topath') : '/'

                Cookies.set('LC_GHA', res.credential.accessToken)
                window.analytics.identify(resapi._id);
                this.setState({
                    redirect: resapi.firstTime ? toPath : '/'
                })
            });
    }

    signupGithub = () => {
        this.setState({ loading: true })
  
        let ghprovider = provider;
        ghprovider.addScope('public_repo read:user user:email')
        auth().signInWithPopup(provider).then(async res => {
            const token = await auth().currentUser.getIdToken();
            const signupres = res;
            this.loginUser(res, token);
        }).catch(err => { 
            this.setState({ loading: true })
            //console.log(err)
        })
    }

    checkif = async () => {
        const token = await auth().currentUser.getIdToken();
        //console.log(token)
    }


    
    render() {


        if(this.state.redirect)
            return <Redirect to={this.state.redirect} />
     

        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <Card loading={this.state.loading} className="w-1/4 bg-white rounded-lg px-6 py-10 flex items-center flex-col">
                    <img className="w-48 mb-4" src={require('../../assets/leapcode-new-logo.svg')} />
                    {/* <h2 className="text-lg font-bold">Login to Leapcode</h2> */}
                    <div className="mt-6">
                        <div className="form-group flex-col justify-between flex">
                            <button className="py-3 px-8 font-bold bg-black text-white inline-flex items-center font-intra hover:bg-gray-900 rounded-lg" onClick={this.signupGithub}><IoLogoGithub class="mr-4" color={'#fff'} /><span>Login using GitHub</span></button>
                        </div>
                    </div>

                    {/* <button onClick={this.checkif}> Check if loggedin</button> */}

                </Card>
            </div>
        )
    }
}
