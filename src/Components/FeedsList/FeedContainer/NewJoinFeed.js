import React from 'react';
import FeedLayout from './FeedLayout';
import { Link } from 'react-router-dom';
const moment = require('moment');

const NewJoinFeed = ({ feed }) => {
    const {userInfo, time} = feed;
    return (
        <FeedLayout>
            <div className="flex" >
                <div className="w-10 h-10">
                    <img className="rounded-full" src={userInfo.displayPhoto} />
                </div>
                <div className="flex-1 ml-4 text-sm">
                    <div className="font-bold"><Link className="hover:underline" to={`/u/${userInfo.username}`}>{userInfo.displayName ? userInfo.displayName : <span>{`@${userInfo.username}`}</span>}</Link> <span className="font-thin ml-1">joined leapcode 🎉</span></div> 
                    <div>
                        <div className="flex">
                            <div className="text-xs font-bold text-gray-500">{moment(moment.utc(time)).fromNow()}</div>
                        </div>
                    </div>

                </div>
            </div>
        </FeedLayout>
        
    )
}

export default NewJoinFeed