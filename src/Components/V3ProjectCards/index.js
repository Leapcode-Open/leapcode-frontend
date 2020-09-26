import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../Card'
import SearchProjectModel from '../SearchProjectModel'

const V3ProjectCards = (props) => {

    const [modelIsOpen, setModelIsOpen] = useState(false)
    return (
    <div className="mt-8">
    {  props.projects.map((project) => (
        <Link to={`/v3/project/${project.slug}/activity`}>
          <Card className='mb-4 hover:shadow'>
              <div className="py-6 px-6">
                  <div className="flex">
                      <div className="">
                          <h3 className="text-base font-bold mb-1">{project.name}</h3>
                          <h4 className="text-xs mb-1">{project.organisation} / {project.name}</h4>
                         
                      </div>
                  </div>
              </div>
          </Card>
        </Link>
    )) }
            
    {
        props.onlyProjects ? null :
        
      <Card className="mt-8 hover:shadow hover:bg-gray-100 cursor-pointer">
          <div  onClick={() => setModelIsOpen(true)} className="py-8 flex flex-col items-center justify-center">
              <h2 className="font-bold text-lg mb-2">Explore {props.projects.length == 0 ? '' : 'More '}Projects</h2>
              <p className="text-gray-700 text-sm">Earn points 🔥 by contributing to open source projects</p>
          </div>
      </Card>

    }
        { modelIsOpen ?
        <SearchProjectModel onClose={() => setModelIsOpen(false)} isOpen={modelIsOpen} /> : null }
      {/* { props.newSessionModel ? 
      <NewSessionModel onClose={() => this.setState({ newSessionModel: false})} isOpen={props.newSessionModel} /> : null } */}
</div>)
}

export default V3ProjectCards