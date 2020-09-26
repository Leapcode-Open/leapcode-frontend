import React, { Component } from 'react';

export default class ErrorBox extends Component {
  render() {
    return (
        <div className="py-1 px-2 bg-red-300 text-xs text-gray-900 rounded mb-2">{this.props.error}</div>
    );
  }
}
