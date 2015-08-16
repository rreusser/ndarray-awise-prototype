'use strict'

module.exports = selectAxes

function selectAxes(dimension, axis, axes) {

  if( axes !== undefined && axis !== undefined ) {
    throw new Error('ndarray-awise-prototype(): error: only one of axis and axes may be provided as options.')
  }

  if( axis === undefined && axes === undefined ) {
    return [dimension-1]
  } else if ( axes === undefined ) {
    axes = [axis]
  }

  return axes
}

