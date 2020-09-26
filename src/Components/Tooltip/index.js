import React, { Component } from 'react'

export default class Tooltip extends Component {
    render() {
        return (
            <div class="relative mx-2">
                <div class="bg-black text-white text-xs rounded py-1 px-4 right-0 bottom-full">
                    Tooltip left
                    <svg className="absolute text-black h-2 left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/>
                </div>
            </div>
        )
    }
}
