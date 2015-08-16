'use strict'

var assert = require('chai').assert
  , ndarray = require('ndarray')
  , show = require('ndarray-show')
  , awise = require('../lib')
  , iota = require('iota-array')
  , ndt = require('ndarray-tests')
  , ops = require('ndarray-ops')


describe( "3d mean", function() {

  var mean = awise({
    reduce: function(s, x) { return s+x; },
    post:   function(a, n) {
      ops.mulseq(a, 1/n.reduce(function(p,m){return p*m},1) )
    }
  })

  it("computes the mean across two dimensions",function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    assert( ndt.equal(mean(A,{axes:[0,2]}), ndarray([7.5,11.5,15.5]), 1e-8 ))
  })

  it("computes the mean",function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    assert.closeTo( mean(A,{axes:[0,1,2]}), 11.5, 1e-3)
  })

  it("computes the mean in the first dimension",function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    assert.closeTo( mean(A,{axes:[0,1,2]}), 11.5, 1e-3)
  })

  it("computes the mean in the first dimension",function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    var m = mean(A,{axis:0})
    var e = ndarray([6,7,8,9,10,11,12,13,14,15,16,17],[3,4])
    assert( ndt.equal(m, e, 1e-8 ))
  })

  it('reduces over the final dimension if not specified', function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    assert( ndt.equal( mean(A), mean(A,{axis:2}), 1e-8 ) )
  })

  it("computes the mean in the second dimension",function() {
    var A = ndarray(new Float64Array(iota(24)), [2,3,4])
    var m = mean(A,{axis:1})
    var e = ndarray([4,5,6,7,16,17,18,19],[2,4])
    assert( ndt.equal(m, e, 1e-8 ))
  })
})
