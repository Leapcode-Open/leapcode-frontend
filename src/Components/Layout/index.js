import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { GET_TOKEN_HEADER } from '../../constants';

class Layout extends Component {

  state = {
    userDetails: null
  }

  async componentDidMount() {

    fetch('http://localhost:5000/api/auth/user', {
      headers: await GET_TOKEN_HEADER()
    })
      .then(res => res.json())
      .then(res => {
        if(res.userDetails) {
          this.setState({
            userDetails: res.userDetails
          })
        }
      })
      .catch(err => {
        console.log(err);
      }) 
  }

  async componentDidUpdate(props) {
    if(props.currentUser) {
         
    }
  }
  render() {
      const { currentUser } = this.props;
      const { userDetails } = this.state;
    return (
    <Fragment>
      <div className=" w-screen bg-white border-b border-gray-200">
          <div className="mx-auto max-w-4xl py-2 flex justify-between items-center">
              <div>
                <Link to='/'>
                  <img src={require('../../assets/leapcode-new-logo.svg')} className="w-32"  />
                </Link>
              </div>

              <div className="flex items-center">

                <div>
                  <div className="dropdown-lc inline-block relative hover:bg-gray-100 rounded">
                    <button className=" text-gray-700 font-semibold py-1 px-2 rounded inline-flex items-center">
                      <div className="mr-2 flex items-center">
                        <img src={currentUser.photoURL} className="w-10 rounded-full border border-gray-300 mr-2" />
                        <span className="text-sm text-left">
                          <div>{currentUser.displayName ? currentUser.displayName : currentUser.username }</div>
                          {userDetails ? <div>🔥 {userDetails.points}</div> : <div className="opacity-25 text-gray-500">🔥 Loading</div> }
                        </span>
                      </div>
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
                    </button>
                    <ul className="dropdown-lc-menu absolute hidden rounded-md w-full bg-white shadow-sm border-gray-200 border">
                      <li className=""><div onClick={this.props.signOut} className="rounded-t rounded-b cursor-pointer hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap text-sm">Logout</div></li>
                    </ul>
                  </div>
                </div>
                  {/* <div>
                    <span onClick={this.props.signOut} className="text-blue-800 hover:underline text-sm mr-3 cursor-pointer">Logout</span>
                    <img src={currentUser.photoURL} className="w-8 rounded-full" />
                  </div> */}
              </div>
              
          </div>
          
      </div>
      <div className="w-full flex-1">
        {this.props.children}
      </div>


      <div className="footer bg-white py-6 relative bottom-0 w-full">
        <div className="max-w-4xl mx-auto">
        <small className="text-gray-500">Made with ❤️ by leapcode team</small>

        </div>
      </div>
      </Fragment>
    );

  }
}


// const Layout = (props) => {
//     let currentUser = useContext(AuthContext);
//     return <LayoutProp {...props} authLoading={currentUser.authLoading} signOut={currentUser.signOut} token={currentUser.token} setToken={currentUser.setToken} currentUser={currentUser.currentUser}></LayoutProp>
// }

export default Layout;