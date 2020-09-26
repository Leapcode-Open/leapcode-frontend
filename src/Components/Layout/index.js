import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Layout extends Component {
  render() {
      const { currentUser } = this.props;
    return (
    <Fragment>
      <div className=" w-screen bg-white border-b border-gray-200">
          <div className="mx-auto max-w-4xl py-4 flex justify-between items-center">
              <div>
                <Link to='/'>
                  <img src={require('../../assets/leapcode-new-logo.svg')} className="w-32"  />
                </Link>
              </div>

              <div className="flex items-center">
                  <span onClick={this.props.signOut} className="text-blue-800 hover:underline text-sm mr-3 cursor-pointer">Logout</span>
                  <img src={currentUser.photoURL} className="w-8 rounded-full" />
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