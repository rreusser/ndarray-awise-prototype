'use strict'

var assert = require('chai').assert
  , selectAxes = require('../lib/select-axes')

describe( 'select axes', function() {

  describe('invalid cases', function() {
    it('throws an error if axis and axes options are both provided', function() {
      assert.throws(function() {
        selectAxes(3, [1,2], 0)
      },Error,/only one of axis and axes/)
    })
  })

  describe('no options provided', function() {
    it('selects the only dimension of a 1d array', function() {
      assert.deepEqual( selectAxes(1), [0])
    })

    it('selects the last dimension of a 2d array', function() {
      assert.deepEqual( selectAxes(2), [1])
    })

    it('selects the last dimension of a 3d array', function() {
      assert.deepEqual( selectAxes(3), [2])
    })

    it('selects the last dimension of a 10d array', function() {
      assert.deepEqual( selectAxes(10), [9])
    })
  })

  describe('1d arrays', function() {
    it('selecting the only axis', function() {
      assert.deepEqual( selectAxes(1,0), [0] )
    })
  })

  describe('2d arrays', function() {
    it('selecting the axis 0', function() {
      assert.deepEqual( selectAxes(2,0), [0] )
    })

    it('selecting the axis 1', function() {
      assert.deepEqual( selectAxes(2,1), [1] )
    })

    it('selecting both axes', function() {
      assert.deepEqual( selectAxes(2,undefined,[0,1]), [0,1] )
    })
  })
})
