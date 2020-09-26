import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ScorePointer from '../ScorePointer';
import { Link } from 'react-router-dom';
import BadgesList from '../BadgesList';

class ProfileAvatarHalf extends Component {
    render() {
        const { className, fullName, points, currentUser, user, loading, badges, invite } = this.props;

        if(loading)
            return (
                <div className={`flex items-center ${className}`}>
                    <div className="w-12 h-12 mr-3"><img className="rounded-full" src={currentUser.photoURL} /></div>
                    <div className="">
                        <h3 className="text-lg">{currentUser.displayName}</h3>
                        <small className="text-xs text-gray-400 my-10 text-center block">Loading</small>
                    </div>
            </div>
            )
   
        return (
            <div>
                <div className={`flex items-center ${className} pb-8 border-gray-300 border-b`}>
                        <div className="w-12 h-12 mr-3"><img className="rounded-full" src={currentUser.photoURL} /></div>
                        <div className="">
                            <h3 className="text-lg"><Link className="hover:underline" to={`/u/${user.username}`}>{currentUser.displayName ? currentUser.displayName : <span className="text-gray-700 text-sm">{`@${user.username}`}</span>}</Link></h3>
                            <ScorePointer loading={loading} points={user.points} />
                        </div>
                </div>

                <div className="py-6 px-6 border-gray-300 border-b">
                        <h3 className="text-xs uppercase text-gray-700 font-bold mb-3">Badges</h3>
                        <BadgesList badges={badges} />
                        {
                            badges.length == 0 ? <div className="text-xs text-gray-500 text-center mt-6">You have no active badges. Contribute to more projects to get badges.</div> : null }
                        
                    </div>

                { invite ? 
                 <div className="py-6 px-6 border-gray-300 border-b">     
                    <h3 className="text-xs uppercase text-gray-700 font-bold mb-3">Invite & Earn🔥</h3>
                    <p className="text-xs text-gray-700">Invite a friend to leapcode and earn 100 points when your friend joins. Here is your invite code:</p>
                    <div className="p-3 bg-gray-200 mt-4 text-xs text-gray-700 rounded">{invite ? invite.code : ""}</div>
                    <div className="mt-4">
                        {
                            invite.usersList.map((u) => (
                                <div key={u._id} className="mb-2 flex">
                                    <div className="w-4 h-4"><img src={u.displayPhoto} className="rounded-full" /></div>
                                    <Link to={`/u/${u.username}`} className="text-xs ml-3 text-gray-700 hover:underline">{u.displayName ? u.displayName : u.username}</Link>
                                </div>
                            ))
                        }
                    </div>
                  {/* <img className="h-auto" src={require('../../assets/humaaans.png')}  /> */}
                </div> : null }

                {/* <div className="py-6 px-6">     
                    <h3 className="text-xs uppercase text-gray-700 font-bold mb-3">Join our tribe</h3>
                    <p className="text-xs text-gray-700">Ask questions, meet other fellow contributors on our slack group</p>
                    <button className=" rounded-lg mt-3 bg-gray-900 hover:bg-gray-800 px-4 py-2 font-inter font-medium text-sm text-white">Join Slack</button>
                    
                </div> */}

            </div>
            
            
                   
            
        )
    }
}



ProfileAvatarHalf.propTypes = {
    className: PropTypes.string,
    fullName: PropTypes.string,
    points: PropTypes.number
  };

export default ProfileAvatarHalf