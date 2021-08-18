import React, { Component } from 'react';
import './style.css';
export default class Model extends Component {
    render() {

        const { isOpen, loading, onClose } = this.props;
        
        return (
            <div className={`modal  ${isOpen ? 'transition-all opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} fixed w-full h-full top-0 left-0 flex items-center justify-center`}>
                <div onClick={onClose} className="modal-overlay absolute w-full h-full bg-gray-900 opacity-25"></div>
                
                <div className="modal-container model-cus  model-ani transition-all bg-white md:w-2/5 w-full mx-auto rounded-lg shadow-lg z-50 overflow-hidden">
                
                    <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
                        <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                        <span className="text-sm">(Esc)</span>
                    </div>

                    <div className="modal-content text-left">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}