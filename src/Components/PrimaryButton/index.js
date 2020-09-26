import React, { Component } from 'react';

export default class PrimaryButton extends Component {
  render() {
    return (
      <button onClick={this.props.onClick} disabled={this.props.disabled} className={`py-2 px-6 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold transition ${this.props.className}`}> {this.props.title} {this.props.children} </button>
    );
  }
}
