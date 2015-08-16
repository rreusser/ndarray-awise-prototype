'use strict'

var assert = require('chai').assert
  , computeShape = require('../lib/compute-shape')

describe('computing a new shape',function() {
  it('1d array',function() {
    assert.deepEqual( computeShape([10],[0]), [] )
  })

  it('4d array, axes=2,3',function() {
    assert.deepEqual( computeShape([7,8,9,10], [2,3]), [7,8] )
  })

  it('4d array, axes=1,3',function() {
    assert.deepEqual( computeShape([7,8,9,10], [1,3]), [7,9] )
  })

  it('4d array, axes=0,1,2,3',function() {
    assert.deepEqual( computeShape([7,8,9,10], [0,1,2,3]), [] )
  })

  it('4d array, axes=7,8,9,10',function() {
    assert.deepEqual( computeShape([7,8,9,10], [3,1,2]), [7] )
  })
})
