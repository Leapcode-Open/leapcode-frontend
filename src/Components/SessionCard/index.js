import React, { Component } from 'react';
import Card from '../Card';
import { Link } from 'react-router-dom';

const PRStatus = ({ state }) => {
    if(state == 'closed')
        return  <div><span className="w-2 h-2 rounded-full bg-green-700 inline-block mr-2"></span>Closed</div>

    else 
        return <div><span className="w-2 h-2 rounded-full bg-orange-700 inline-block mr-2"></span>{state}</div>
}




export default class SessionCard extends Component {
    
    render() {


        const { session } = this.props;
        return (
            <Link to={`/session/${session.slug}/activity`}>
                <Card className='mb-4 hover:shadow'>
                    <div className="py-6 px-6">
                        <div className="flex">
                            <div className="">
                                <h4 className="text-sm mb-1">{session.name}</h4>
                                {/* <h3 className="text-base font-bold mb-1">{session.project.organisation} / {session.project.name}</h3> */}
                                <div className="">
                                    {session.pullRequest ? <div className="font-bold mb-3">{session.pullRequest.title}</div> : null }
                                </div>
                                <div className="text-xs flex">
                                    <div className="">{ session.pullRequest ? <PRStatus state={session.pullRequest.state}></PRStatus> : <div className=""><span className="w-2 h-2 rounded-full bg-red-700 inline-block mr-2"></span>No Pull Request Connect</div> }</div>
                                    {/* <div className="">{ session.completed ? <span className="text-green-900">Completed</span> : <div><span className="w-2 h-2 rounded-full bg-orange-700 inline-block mr-2"></span>In Progress</div> }</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }
}
