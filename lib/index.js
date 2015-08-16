'use strict'

var cwise = require('cwise')
  , selectAxes = require('./select-axes')
  , computeShape = require('./compute-shape')
  , computeTranspose = require('./compute-transpose')
  , fill = require('ndarray-fill')
  , ndarray = require('ndarray')

module.exports = awise

var reduceOperator = cwise({
  args: ['array','scalar','scalar','scalar','index'],
  body: function( A, getter, setter, reduceFunc, index ) {
    setter(index, reduceFunc( getter(index),  A, index) )
  }
})

var cache = {}

function awise( options ) {

  options = options || {}

  var reduce = options.reduce
  var post = options.post

  if( initialize === undefined ) {
    initialize = function() {return 0}
  }

  if( reduce === undefined ) {
    throw new Error('awise:: error: reduce function must be provided as an option.')
  }

  return function(a, opts) {
    var output, transposed, axes, transpose, reducedShape, n, i, m,
        resultDimension, resultShape, resultDtype, getter, setter

    opts = opts || {}
    output = opts.output
    axes = selectAxes(a.dimension,opts.axis, opts.axes)

    // Put the reduced dimensions at the end of the array, mainly for convenience so
    // that things are easily separable. This is a big part of what should be factored
    // out in order to simplify.
    transpose = computeTranspose( a.dimension, axes )

    // Compute the shape of the output:
    resultDimension = a.dimension - axes.length
    resultShape = computeShape( a.shape, axes )
    resultDtype = a.dtype

    if( resultDimension === 0 ) {
      // Resulting dimensionality=0 is a special case that's easiest to handle completely
      // separately:

      // If output destination unspecified, create new:
      if(output===undefined) {
        if( resultDtype==='array' ) {
          output = ndarray([0],[1])
        } else {
          output = ndarray(new a.data.constructor(1),[1])
        }
      }

      // Initialize the output array:
      fill(output, initialize)

      // Getters and setters for the single output value:
      getter = function(dummy) {
        return output.data[0]
      }
      setter = function(dummy, value) {
        output.data[0] = value
      }

      // Component-wise reduce operation:
      reduceOperator(a, getter, setter, reduce)

      // If post-processing function specified, do it:
      if( post ) post( output, a.shape)

      // Return the output value as a scalar:
      return output.get(0)

    } else {

      // Transpose the array (symbolically, not actually in memory):
      transposed = a.transpose.apply(a,transpose)

      // If output destination unspecified, create new:
      if(output===undefined) {
        m = resultShape.reduce(function(l,j){return l*j})
        if( resultDtype==='array' ) {
          output = ndarray(Array(m),resultShape)
        } else {
          output = ndarray(new a.data.constructor(m), resultShape)
        }
      }

      // Initialize the output array:
      fill( output, initialize )

      // Getters and setters that take a full component-wise index and map it
      // to the index of the reduced element:
      getter = function(index) {
        // Just get on the full index--trailing dimensions are what's being
        // reduced, and they're at the end due to the transpose so they just
        // get ignored.
        return output.get.apply(output, index)
      }
      setter = function(index, value) {
        // This one is bad and slow. We should dynamically generate this code
        // and actually skip over the unused dimensions.
        output.set.apply(output, index.slice(0,resultDimension).concat(value))
      }

      // Component-wise reduce operation:
      reduceOperator(transposed, getter, setter, reduce)

      // Return the output value as a scalar:
      if( post ) {
        // Map the reduced axes to the shape of the reduced axes:
        reducedShape = transpose.slice(resultDimension).map(function(i) { return a.shape[i] })

        // Execute post:
        post( output, reducedShape )
      }

      // BAM.
      return output
    }

  }

}
