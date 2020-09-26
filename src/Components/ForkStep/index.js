import React, { useState, useEffect } from 'react'
import { API_URL, API_HEADERS, GET_TOKEN_HEADER } from '../../constants';
import Cookies from 'js-cookie'
import { GoRepoForked } from 'react-icons/go';

var url = require('url');

export const ForkStep = (props) => {
    const [forkExist, setForkExist] = useState(true);
    const [loading, setLoading] = useState(true);
    const [forking, setForking] = useState(false);
    const [forkDetails, setForkDetails] = useState(null);

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
                window.analytics.track('Forked Repo', {
                    project: props.project.slug
                });
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
                    <div>
                        <h4 className="text-green-800 mb-2 text-sm font-semibold">Forked on your profile!</h4>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12">
                            <GoRepoForked></GoRepoForked>
                        </div>
                        <div>
                            <div className="font-semibold"><a className="hover:underline" href={forkDetails.html_url}>{forkDetails.full_name}</a></div>
                            {forkDetails.parent ? <small className="text-gray-700 font-sm">Forked from <a className="hover:underline" href={forkDetails.parent.html_url}>{forkDetails.parent.full_name}</a></small> : null }
                        </div>
                    </div>
                    
       
                </div>
            )
    return (
        <div className="">
            <button onClick={forkRepo} className="bg-black text-white px-4 py-2 text-sm font-semibold">Fork this Repository</button>
        </div>
    )
}
