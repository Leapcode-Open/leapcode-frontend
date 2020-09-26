import React, { useState, useEffect, useRef } from 'react'
import { API_URL, API_HEADERS, GET_TOKEN_HEADER } from '../../constants';
import Cookies from 'js-cookie'
import { GoRepoForked, GoRepoClone, GoGist } from 'react-icons/go';

var url = require('url');

export const CloneStep = (props) => {
    const [forkExist, setForkExist] = useState(true);
    const [loading, setLoading] = useState(true);
    const [forking, setForking] = useState(false);
    const [forkDetails, setForkDetails] = useState(null);
    const [copySuccess, setcopySuccess] = useState(null);
    const textAreaRef = useRef(null);
    useEffect( () => {


        async function getData() {
            const gitURL = props.project.githubUrl;
            const {pathname} = url.parse(gitURL);
            fetch(API_URL+`/github${pathname}/checkfork`, {
                headers: await GET_TOKEN_HEADER()
            }).then(async res => {
                if(res.ok) {
                    const d = await res.json();
                    setForkDetails(d);
                    setLoading(false)
                }

                else {
                    setLoading(false)
                    setForkDetails(null)
                }   
            });
        }

        getData()

    }, [])

    const forkRepo = async () => {
        const ghtoken = Cookies.get('LC_GHA');
        const gitURL = props.project.githubUrl;
        const {pathname} = url.parse(gitURL);
       
        setLoading(true);
        setForking(true)
        fetch(API_URL+`/github${pathname}/createfork`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER(),
            body: JSON.stringify({
                ghtoken
            })
        }).then(async res => {
            if(res.ok) {
                const details = await res.json();
                setLoading(false);
                setForking(false)
                setForkDetails(details);
            }

            else {
                setLoading(false);
                setForking(false)
                setForkDetails(null);
            }
        })
    }


    const copyToClipboard = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        // e.target.focus();
        setcopySuccess('Copied!')

      };


    if(loading)
        return(
            <div className="flex items-center">
                <div className="mr-4"><div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-10 w-10"></div></div>
        <small className="text-gray-700">{ forking ? 'Forking Repository' : 'Loading fork details' }</small>
            </div>
        )
        
   
    if(forkDetails)
            return (
                <div className="">
                    <div onClick={copyToClipboard} className="flex items-center justify-center cursor-pointer">
                        {/* <h4 className="text-green-800 mb-2 text-sm font-semibold">Forked on your profile! clone clone</h4> */}
                        <GoRepoClone />
                        <div className="p-2 ml-2 bg-gray-200 text-sm font-medium font-inter flex items-center rounded flex-1">
                            <span className="text-blue-800">git clone {forkDetails.clone_url}</span> 
                        </div>
                        <span className="ml-3 rounded-full hover:bg-blue-100"><GoGist /></span>
                    </div>

            <small className="text-gray-700 mt-2 ml-6">{copySuccess ? <span className="text-green-800 font-bold">Code copied!</span> : <span>Click to Copy</span>}</small>
                    <textarea ref={textAreaRef} className='opacity-0 h-1'  value={`git clone ${forkDetails.clone_url}`} />

{/*                     
                    <div className="flex items-center">
                        <div className="w-8">
                            <GoRepoForked></GoRepoForked>
                        </div>
                        <div>
                            <div className="font-semibold"><a className="hover:underline" href={forkDetails.html_url}>{forkDetails.full_name}</a></div>
                            {forkDetails.parent ? <small className="text-gray-700 font-sm">Forked from <a className="hover:underline" href={forkDetails.parent.html_url}>{forkDetails.parent.full_name}</a></small> : null }
                        </div>
                    </div> */}
                    
       
                </div>
            )
    return (
        <div className="">
            <small>Fork does not exist on your profile. Fork the repo to clone.</small>
        </div>
    )
}
