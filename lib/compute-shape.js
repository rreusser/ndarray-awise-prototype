'use strict'

module.exports = computeShape

/* Computes the shape of the resulting output. In other words,
 * it returns shape with any dimension listed in axes removed.
 * This will be the shape of the resulting output.
 *
 * The way I'm doing this is pretty sub-optimal, but even if you
 * have a 10-d array with non-singleton dimensions, the amount
 * of work in computing the mean will dwarf anything that goes
 * on here.
 */
function computeShape( shape, axes ) {
  var newDimension = shape.length - axes.shape
    , newShape = []

  for(var i=0,j=0; i<shape.length; i++) {
    if( axes.indexOf(i) === -1 ) newShape[j++] = shape[i]
  }

  return newShape

}
