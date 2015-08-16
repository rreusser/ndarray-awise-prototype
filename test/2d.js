'use strict'

var assert = require('chai').assert
  , ndarray = require('ndarray')
  , awise = require('../lib')
  , ndt = require('ndarray-tests')
  , ops = require('ndarray-ops')


describe( "2d mean", function() {

  var mean = awise({
    reduce: ops.sum,
    post: function(a,n) {
      ops.mulseq(a, 1/n.reduce(function(p,m){return p*m},1) )
    }
  })

  it("works with regular js arrays",function() {
    var A = ndarray([1,2,3,4], [2,2])
    var m = mean(A,{axis: 0})
    assert( ndt.equal( m, ndarray([2,3]) ) )
  })

  it("sums in the first axis",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = mean(A,{axis: 0})
    assert( ndt.equal( m, ndarray([2,3]) ) )
  })

  it("sums in the second axis",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = mean(A,{axis: 1})
    assert( ndt.equal( m, ndarray([1.5,3.5]) ) )
  })

  it("sums in both axes",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = mean(A,{axes: [0,1]})
    assert.closeTo( m, 2.5, 1e-8 )
  })

  it('reduces over the final dimension if not specified', function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    assert( ndt.equal( mean(A), mean(A,{axis:1}), 1e-8 ) )
  })
})

describe( "2d product", function() {

  var prod = awise({
    initialize: function() { return 1; },
    reduce: function(s, x) { return s*x; },
  })

  it("product in the first axis",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = prod(A,{axis: 0})
    assert( ndt.equal( m, ndarray([3,8]) ) )
  })

  it("product in the second axis",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = prod(A,{axis: 1})
    assert( ndt.equal( m, ndarray([2,12]) ) )
  })

  it("product in both axes",function() {
    var A = ndarray(new Float64Array([1,2,3,4]), [2,2])
    var m = prod(A,{axes: [0,1]})
    assert.closeTo( m, 24, 1e-8 )
  })

})
