import React, { Component } from 'react'
import PropTypes from 'prop-types';

class ScorePointer extends Component {
    render() {
        return (
        <span className={`font-semibold ${this.props.big ? 'text-xl' : 'text-sm'}`}>🔥 {this.props.points}</span>
        )
    }
}

ScorePointer.propTypes = {
    points: PropTypes.number.isRequired
  };

export default ScorePointer