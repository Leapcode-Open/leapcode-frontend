import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const menus  = [{
    id:0,
    title: 'Get Started✌️',
    id:'GETSTARTED',
    url:'activity'
}, {
    id:1,
    title: ' Issues🔥',
    id:'ISSUE',
    url:'issue'
}, {
    id:2,
    title: 'Your Contributions🚀',
    id:'YOURCONTRIBUTION',
    url:'contribution'
}]


export default class ProjectMenuSection extends Component {
    render() {
        const { selected, project } = this.props;
        return (
            <ul className="flex max-w-4xl mx-auto">
                { menus.map( menu => (
                    <li key={menu.id} className={` mr-8 text-sm hover:opacity-100 ${ selected == menu.id ? `font-bold border-b-2 border-black` : `opacity-75` }`}><Link className="py-4 px-2 block" to={`/v3/project/${project.slug}/${menu.url}`}>{menu.title}</Link></li>
                )) }
               
            </ul>
        )
    }
}
