import React, { Component } from 'react'
import Card from '../Card';
import LessonV3 from '../LessonV3';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import SkeletonLoading from '../SkeletonLoading';
import _ from 'lodash'
import Model from '../Model';
import PrimaryButton from '../PrimaryButton';
import BackgroundConf from '../../assets/63965.png'
import Confetti from 'react-confetti'
import Tick from '../Tick';
import { API_URL, GET_TOKEN_HEADER } from '../../constants';
import ProjectMenuSection from '../ProjectMenuSection';


const activityData = {
    courses: [{
        id:'basics',
        name:'Basics',
        projectId:'first-pr-request',
        lessons: [{
            id:'Introduction',
            name: 'Intro to Pull Requests',
            description:'To build a complete web application with React from scratch, there are many important details you need to consider:',
        }, {
            id:'fork-and-clone',
            name:'Forking and cloning',
            steps:[{
                id:'setup',
                description:'',
                todo:[{
                    id:'fork',
                    title:'Fork this repository',
                    description:'Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.'
                }, {
                    id:'Clone the repository',
                    title:'Clone the repository',
                    description:'Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the clone button and then click the copy to clipboard icon.'
                }]
            }]
        }]
    }]
}



const BulletPoint = ({ selected, done }) => {
    if(selected)
        return <div className={`-ml-6 w-2 h-2 bg-black rounded-full`}></div>

    if(done)
        return <div style={{ marginLeft: '-28px' }} className={`w-4 h-4 bg-white rounded-full`}><Tick /></div>

    return  <div className={`-ml-6 w-2 h-2 bg-gray-300 rounded-full`}></div>

}


const SideLessonBlock = ({ id, name, doneBy, slug, projectSlug, selectedLesson, session, currentUser, completedUsers }) => {
    //console.log('sude', currentUser.uid, completedUsers)
    const done = _.includes(completedUsers, currentUser.uid);
    return (
        <div className="flex items-center mb-2">
        <BulletPoint selected={selectedLesson == slug} done={done}></BulletPoint>
        {/* <div className={`-ml-6 w-2 h-2 ${selectedLesson == slug ? 'bg-black' : 'bg-gray-300'} rounded-full`}>{ done ? <Tick /> : null}</div> */}
        <Link to={`/v3/project/${projectSlug}/activity/${slug}`} className={`text-sm font-inter ${ done ? 'ml-3' : 'ml-4'} text-gray-800 hover:text-gray-600 cursor-pointer ${selectedLesson == slug ? 'font-medium text-black' : ''}`}>{name}</Link>
        </div>
    )
   
}

const SideCourseBlock = ({name, lessons, projectSlug, slug, selectedLesson, session, currentUser}) => (
    <div className="mb-8">
        <div className="font-bold text-black text-sm uppercase mb-3">{ name }</div>
        { lessons.sort((a,b) => a.order - b.order).map((lesson) => <SideLessonBlock currentUser={currentUser} session={session} selectedLesson={selectedLesson} key={lesson._id} projectSlug={projectSlug} courseId={slug} {...lesson} /> )}
    </div>
)

//backgroundImage: `url(${BackgroundConf})`, 

const Congrats = (props) => (
    <Model {...props}>
        <Confetti active={props.isOpen} />

        <div className="flex flex-col items-center text-center py-32 px-32" style={{ backgroundSize:'cover' }}>
            <h2 className="text-3xl font-bold px-6 mb-5">Congrats!</h2>
            <h2 className="text-3xl font-bold px-6 mb-5">You did it</h2>
            <p className="font-bold text-lg mt-6 mb-8 text-green-900">🎉 {props.course.points} Points</p>
            <PrimaryButton onClick={props.nextCourse} className="py-4 text-sm" title="Go to Next Steps" />
        </div>
    </Model>
)

const CongratsProject = (props) => (
    <Model {...props}>
        <Confetti active={props.isOpen} />

        <div className="flex flex-col items-center text-center py-32 px-32" style={{ backgroundSize:'cover' }}>
            <h2 className="text-3xl font-bold px-6 mb-5">Congrats!</h2>
            <h2 className="text-3xl font-bold px-6 mb-5">You did it</h2>
            {/* <p className="font-bold text-lg mt-6 mb-8 text-green-900">🎉 {props.course.points} Points</p> */}
            <PrimaryButton onClick={props.onComplete} className="py-4 text-sm" title="Explore Issues" />
        </div>
    </Model>
)




export default class Activity extends Component {

    state = {
        courses: [],
        loading: false,
        selectedLesson: null,
        redirect: null,
        completedCourse: null,
        openComplete:false,
        actComplete:false,
        fullRedirect: null,
        allStepsCompleted: false,
        coursesList: [],
        t: true
    }

    componentDidMount() {
        const { lessonId } = this.props.match.params;
       
      
        if(lessonId) {
            this.setState({
                selectedLesson: lessonId,
                coursesList: this.props.project.courses.sort((a,b) => a.order - b.order)
            })

            window.analytics.track('Activity', {
                lessonId
            });

        }
           
        else {
            
            const courseList = this.props.project.courses;
            // console.log(this.props.project.courses);
            // if(courseList.length == 0)
            //     this.setState({ fullRedirect: `/v3/project/${this.props.project.slug}/issue` })
            // console.log(this.props.currentUser.uid);
            //console.log('test test test');
            if(this.props.project.courses && this.props.project.courses.length > 0) {
                let flag = 0;

                for(var i=0; i< courseList.length; i++) {
                    if(courseList[i].lessons) {
                        const currentCourse = courseList[i];

                        
                        
                        for(var j=0; j < currentCourse.lessons.length; j++) {
                            if(!_.includes(currentCourse.lessons[j].completedUsers, this.props.currentUser.uid)){
                                this.setState({
                                    selectedLesson: currentCourse.lessons[j].slug,
                                    redirect:currentCourse.lessons[j].slug,
                                    coursesList: this.props.project.courses.sort((a,b) => a.order - b.order)
                                })
                                flag=1;
                                
                                break;
                            }

                        }   
                        if(flag==1)
                            break;

                        

                        else {
                            if(i == courseList.length - 1) {
                                //console.log('test test test');
                                this.setState({
                                    selectedLesson: courseList[0].lessons[0].slug,
                                    redirect:courseList[0].lessons[0].slug,
                                    allStepsCompleted: true,
                                    coursesList: this.props.project.courses.sort((a,b) => a.order - b.order)
                                })
                                break;
                            }
                        }
                    }
                }


                // if(this.props.project.courses[0].lessons.length > 0) {
                //     //const index = _.findIndex(sortedCourses, { slug: courseId});
                //     this.setState({
                //         selectedLesson: this.props.project.courses[0].lessons[0].slug,
                //         redirect:this.props.project.courses[0].lessons[0].slug,
                //     })
                // }
                   
            }
        }
    }

    getFirstLessonSlug = () => {
        if(this.props.project.courses && this.props.project.courses.length > 0) {
            if(this.props.project.courses[0].lessons.length > 0)
                    return this.props.project.courses[0].lessons[0].slug

        return null
        }
    }


    onLessonUpdate = (slug) => {
      
    }


    onActivityComplete = () => {
        const { project } = this.props;
        window.location.href=`/v3/project/${project.slug}/issue`;
    }

    onCourseComplete = async (courseId) => {
        const sortedCourses = this.props.project.courses.sort((a,b) => a.order - b.order);

        window.analytics.track('Course Complete', {
            courseId
        });

        fetch(API_URL+`/course/done/${courseId}`, {
            method: 'POST',
            headers: await GET_TOKEN_HEADER()
        })
            .then(res => res.json())
            .then(res => {
                if(res.error)
                    this.setState({
                        error: res.error,
                        loading:true
                    });
                
                
                
                else if(res.type == 'ADDED_ALREADY') {
                    //console.log('AASDD----ADDED_ALREADY')
                    const index = _.findIndex(sortedCourses, { _id: courseId});
                    //console.log('AASDD----ADDED_ALREADY', index)
                    if(sortedCourses[index+1]) {

                        let nextStep = sortedCourses[index+1].lessons[0];
                        if(nextStep) {
                            //console.log('AASDD----NEXT STEP', nextStep)

                            this.setState({
                                loading: false,
                                completedCourse: sortedCourses[index],
                            });
                                this.nextCourse()
                        }
                    }

                    else {
                        //console.log('complete - 1')
                        this.setState({
                            actComplete: true
                        })
                    }
                    
                }

                else {
                    //this.setState({ redirect: this.state.nextStep  });
                    const index = _.findIndex(sortedCourses, { _id: courseId});
                    if(sortedCourses[index+1]) {
                        let nextStep = sortedCourses[index+1].lessons[0];
                        //console.log('qwe', nextStep)
                        if(nextStep) {
                            this.setState({
                                loading: false,
                                completedCourse: sortedCourses[index],
                                openComplete: true
                            })
                        }
                    }

                    else {
                       // console.log('complete - 2')
                        this.setState({
                            actComplete: true
                        })
                    }

                }
                    


            })


        

    }


  


    nextCourse = () => {
        const sortedCourses = this.props.project.courses.sort((a,b) => a.order - b.order);
        const index = _.findIndex(sortedCourses, { _id: this.state.completedCourse._id});
        const { project, session } = this.props;

        if(sortedCourses[index+1]) {
            let nextStep = sortedCourses[index+1].lessons[0];

            if(nextStep) {
                //window.location.href = `/v3/project/${project.slug}/activity/${nextStep.slug}`
                // this.setState({
                //     redirect: nextStep.slug,
                //     selectedLesson: sortedCourses[index+1].lessons[0].slug
                // })
                this.setState({
                    openComplete: false,
                    actComplete: false
                })

                window.analytics.track('Next Course', {
                    slug: nextStep.slug
                });


                this.props.history.push(`${nextStep.slug}`);
            }
        }
    }


    onLessonDone = (lessonId, courseId) => {
        let coursesList = JSON.parse(JSON.stringify(this.state.coursesList));
        const courseIndex = _.findIndex(coursesList, ['_id', courseId]);
        const lessonIndex = _.findIndex(coursesList[courseIndex].lessons, ['_id', lessonId]);
       
        coursesList[courseIndex].lessons[lessonIndex].completedUsers.push(this.props.currentUser.uid);
        this.setState({
            coursesList,
            t: !this.state.t
        })

        window.analytics.track('Lesson Done', {
            lessonId,
            courseId
        });
        //this.props.onLessonDone(this.props.match.params.lessonId)
    }


    render() {
        const { project, match, session } = this.props;
   
       // const selectedLesson= match.params.lessonId ?  match.params.lessonId : this.getFirstLessonSlug();
        const selectedLesson= match.params.lessonId ?  match.params.lessonId : null;
        //const sortedCourses = project.courses.sort((a,b) => a.order - b.order);
        const sortedCourses = this.state.coursesList;

        if(this.state.fullRedirect)
            return <Redirect to={this.state.fullRedirect} />

        if(this.state.redirect)
            return <Redirect to={`/v3/project/${project.slug}/activity/${this.state.redirect}`} />

            
        if(selectedLesson)
            return (
                <>
                <div className="bg-white border-gray-300 border-b">
                        <ProjectMenuSection project={project} selected={'GETSTARTED'} />
                </div>
                    <div className="flex pb-24  max-w-4xl mx-auto">
                        <div className="w-2/5">
                          
                            <div className="h-full border-l border-gray-300 ml-4 pl-5 pt-12">
                                {
                                    sortedCourses.map(course => <SideCourseBlock currentUser={this.props.currentUser} session={session} selectedLesson={selectedLesson} key={course._id} projectSlug={project.slug} {...course} />)
                                }
                                {/* <div className="font-bold text-black text-sm uppercase">Basics</div> */}
                            </div>
                        </div>
                        <div className="flex-1 pt-12">
                            <div>
                                { this.state.allStepsCompleted ? <div className="">You have completed your steps</div> : null }
                            </div>

                            <LessonV3 onLessonDone={this.onLessonDone} project={project} session={session} onLessonUpdate={this.onLessonUpdate} onCourseComplete={this.onCourseComplete} selectedLesson={selectedLesson} />
                        </div>
                        { this.state.openComplete ? 
                        <Congrats nextCourse={this.nextCourse} course={this.state.completedCourse} isOpen={this.state.completedCourse} /> : null }
                        { this.state.actComplete ? <CongratsProject onComplete={this.onActivityComplete} isOpen={this.state.actComplete} /> : null }
                    </div>
                </>
            )



        if(this.props.project.courses.length == 0)
            return (
                <>
                <div className="bg-white">
                        <ProjectMenuSection project={project} selected={'GETSTARTED'} />
                </div>
                    <Card className="flex px-8 py-12 mt-8 max-w-4xl mx-auto">
                        <div className="w-full flex items-center flex-col">
                            <h1 className="text-center font-bold text-lg">Ohh hoo.. Seems like there is no guide for this project</h1>
                            <p className="text-center text-sm text-gray-600 mt-2">The maintainer has not setup get started steps for this project</p>
                            <div className="mt-8">
                                <Link to={`/v3/project/${project.slug}/issue`} className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold  cursor-pointer hover:bg-blue-600">Check for issues</Link>

                            </div>
                        </div>
                    </Card>
                </>
            )
        return <SkeletonLoading />
    }
}
