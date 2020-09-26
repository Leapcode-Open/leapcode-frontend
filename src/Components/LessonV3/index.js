import React, { Component } from 'react'
import Card from '../Card'
import { API_URL, GET_TOKEN_HEADER} from '../../constants';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';
import Step from '../Step';
import StepV3 from '../StepV3';


const Pagination = ({ selected, done, index, onClick, lessonSlug }) => (<Link to={lessonSlug} onClick={() => onClick(index)} className={`${selected ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} ${done ? 'text-blue-700' : ''} w-8 h-8 flex cursor-pointer items-center justify-center rounded text-sm  mr-2`}>{index + 1}</Link>)



export default class Lesson extends Component {

    state = {
        selectedLesson: null,
        lesson: {},
        loading: true,
        course: {
            lessons: []
        },
        nextStep: null,
        redirect:null
    }


    fetchLessonData = async (slug, sessionId) => {
        return fetch(API_URL + `/lesson/slug/${slug}`, {
            headers: await GET_TOKEN_HEADER()
        });
    }

    componentDidMount() {
        this.setState({
            redirect:null
        })
        this.fetchLessonData(this.props.selectedLesson, this.props.session._id)
            .then(res => res.json())
            .then(res => {

                const nextStep = this.nextStep(res, res.course)

                this.setState({
                    lesson: res,
                    loading: false,
                    course: res.course,
                    nextStep,
                    redirect:null
                })
            });

    }

    componentDidUpdate = (prevProps) => {
        if(this.props.selectedLesson !== prevProps.selectedLesson ) {
          this.setState({
              loading: true,
              redirect:null
          });

          this.fetchLessonData(this.props.selectedLesson, this.props.session._id)
            .then(res => res.json())
            .then(res => {      
                const nextStep = this.nextStep(res, res.course)

                this.setState({
                    lesson: res,
                    loading: false,
                    course: res.course,
                    nextStep
                })
            });

            
       };
    };


    nextStep = (lesson, course) => {

        let slug = null;
        // const { lesson, course } = this.state;
       
        if(lesson.order >= 0) {
            if(lesson.order == (course.lessons.length-1)) 
                slug = null;
            
            else    
                slug = course.lessons[lesson.order+1].slug;
        }   

        //console.log('nextStep', lesson, lesson.order, course.lessons.length)
        return slug

    }


    onPaginationClickHandler = (index) => {
    
    }

    onCourseComplete = () => {
        const courseId = this.state.lesson.courseId;
        this.props.onCourseComplete(courseId);
    }


    onStepDone = () => {
        //('stp=done')
    }


    onNextLesson = async (nextStep) => {
        this.setState({ loading: true });

        fetch(API_URL+`/lesson/done/${this.state.lesson._id}`, {
            method:'POST',
            headers: await GET_TOKEN_HEADER()
        }).then(res => res.json())
        .then(res => {
            if(res.error)
                this.setState({
                    error: res.error,
                    loading:true
                })

            else if(!nextStep) {
                this.onCourseComplete();
            }

            else {
                this.props.onLessonDone(this.state.lesson._id, this.state.course._id);
                this.setState({ redirect: this.state.nextStep  })
            }
                

        });
    }


    // checkIfAllStepsDone = () => {
    //     if(this.state.lesson.steps) {
    //         let flag = 0;
    //         const withInfo = this.state.lesson.steps.filter(step => step.info || step.type == 'NO');
    //         if(this.state.lesson.steps.length == withInfo.length)
    //             return true
    //         return false
    //     }

    //     else
    //         return true
    // }


    checkIfAllStepsDone = () => {

        const steps = this.state.lesson.steps;
        const { project } = this.props;
        let count = 0 + steps.filter(step => (step.type == 'FORK') || (step.type == 'CLONE') || (step.type == 'NO') || step.type == 'PR').length;
      
        if(steps.filter(step => step.type == 'FPR-ISSUE').length > 0) {
            if(project.firstSession)
                count = count+1;
        }
        //('steps2', steps.length, count, steps);
        if(steps.filter(step => step.type == 'PR').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.pullRepullRequest) {
                    if(project.firstSession.pullRepullRequest.state == 'merged')
                        count = count+1;
                }
            }
        }

        if(steps.filter(step => step.type == 'ISSUE_SELECT').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.issueExist) {
                        count = count+1;
                }
            }
        }

        if(steps.filter(step => step.type == 'ISSUE').length > 0) {
            if(project.firstSession) {
                if(project.firstSession.issueExist) {
                        count = count+1;
                }
            }
        }
        //console.log('steps3', steps.length, count);
       

        if(steps.length == count)
            return true
        
        else
            return false
    }

    render() {

        if(this.state.redirect)
            return <Redirect to={this.state.redirect} />

        if(this.state.loading)
            return <Card loading />


        const { lesson, nextStep } = this.state;
        const { project } = this.props;


        const allStepsDone = this.checkIfAllStepsDone();
        //console.log('asdasd', allStepsDone)

        return (
            <Card className="p-6 font-inter lessonDiv">
                <h1 className="text-lg font-bold mb-4">{lesson.name} {this.state.selectedLesson}</h1>
                <div dangerouslySetInnerHTML={{ __html: lesson.description }} className='text-sm text-gray-800'></div>
                <div  className="text-sm text-gray-700 mb-2"></div>

                <div className='mt-4'>
                    { 
                        lesson.steps.sort((a,b)=> a.order - b.order).map(step => <StepV3 project={project} onDone={this.onStepDone} step={step} session={this.props.session} />)
                    }
                </div>
                <div className="mt-10 flex justify-between items-center">
                    {/* <div className="flex">
                        {
                            this.state.course.lessons.map((l, index) => <Pagination key={index} lessonSlug={l.slug} selected={l.slug == this.props.selectedLesson} onClick={this.onPaginationClickHandler} index={index} /> )
                        }
                    </div> */}
                    <div></div>
                    <div>
                      
                      <div className={` ${!allStepsDone ? 'opacity-25 pointer-events-none' : ''} `}>
                        { nextStep ?   
                        <div onClick={() => this.onNextLesson(nextStep) } className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600">Next</div> : 
                        <button onClick={() => this.onNextLesson()} className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold  cursor-pointer hover:bg-blue-600">Next</button>
                        }
                        </div>
                    </div>
                </div>
               
            </Card>
        )
    }
}


/*                          <Link to={`${nextStep}`} className="py-2 px-6 rounded text-xs bg-blue-500 text-white font-semibold">Next Lesson</Link> : 

* */