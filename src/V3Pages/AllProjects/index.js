import React, { Component } from 'react'
import Layout from '../../Components/Layout'
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import { GoRepo } from 'react-icons/go';
import { Link } from 'react-router-dom';
import SkeletonLoading from '../../Components/SkeletonLoading';
import { RepoBlock } from '../../Components/RepoBlock';





// const RepoBlock = (props) => {
// return (
//         <div className="border rounded-lg bg-white mb-4 font-inter hover:shadow border-gray-300">
//             <div>
//                 <div className=' px-4 py-4 border-b border-gray-300'>
//                     <h2 className="flex items-center"><GoRepo />  <span className='ml-2 mr-2'>{props.organisation}</span> / <span className="ml-2 font-semibold">{props.name}</span></h2>
//                     { props.githubInfo ? <div>
//                                 <div className="flex">
//                                     {   props.githubInfo.languages ? <>
//                                         { Object.keys(props.githubInfo.languages).map((la) => (
//                                             <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs mt-3 rounded mr-2">{la}</div>
//                                         )) } </> : <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs mt-3 rounded">{props.githubInfo.language}</div>
//                                     }
                                    
//                                 </div>
//                             </div>  : null }
//                 </div>

//                 <div className="py-4 px-4">
//                     { props.githubInfo ? 
//                     <div className="flex items-center text-gray-700 text-sm mb-4">
//                         <span className="mr-2">By</span><img className="w-5 h-5 mr-2 rounded-full" src={props.githubInfo.owner.avatar_url}  /><div>{props.githubInfo.owner.login}</div> 
//                     </div> : null }


//                     <div className="text-sm" dangerouslySetInnerHTML={{ __html: props.description}}></div>
//                     <div className="mt-4">
//                         <Link to={`/v3/project/${props.slug}/activity`} className="text-blue-700 font-semibold text-sm hover:underline">Start Contributing →</Link>
//                     </div>
//                 </div>
//             </div>
          
//         </div>
// )
// }

export default class AllProjectsV3 extends Component {


    state = {
         projects: [],
         loading: true,
    }

    async componentDidMount() {
        fetch(API_URL+`/project?v3=true`, {
            headers: await GET_TOKEN_HEADER()
        }).then(async res => {
            if(res.ok) {
                const projects = await res.json()
                this.setState({
                    projects,
                    loading:false
                })
            }

            else {
                this.setState({
                    projects: [],
                    loading:false,
                    error: 'Some Error has occuered'
                })
            }
        });
    }
    render() {
       
        return (
            <Layout {...this.props}>
                <div className="mx-auto max-w-3xl pt-10">
                    <h3 className="font-bold text-lg">All Projects</h3>
                    {
                        this.state.loading ? <div className="mt-6"><SkeletonLoading className="mt-6" /></div> : null 
                    }
                    <div className='mt-6 pb-24'>

                        {
                            this.state.projects.filter(a => !a.hide).map(pro => <RepoBlock {...pro} />)
                        }
                        
                    </div>
                </div>
            </Layout>
        )
    }
}
