'use strict'

module.exports = computeTranspose

/* Computes the transpose that puts the reduced dimensions at the
 * end of the array so that we can blockindex it.
 *
 * The way I'm doing this is pretty sub-optimal, but even if you
 * have a 10-d array with non-singleton dimensions, the amount
 * of work in computing the mean will dwarf anything that goes
 * on here.
 */
function computeTranspose( dimension, axes ) {
  var untransposed = []
    , transposed = []

  for(var i=0; i<dimension; i++) {
    if( axes.indexOf(i) === -1 ) {
      untransposed.push(i)
    } else {
      transposed.push(i)
    }
  }

  return untransposed.concat(transposed)

}
