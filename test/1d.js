'use strict'

var assert = require('chai').assert
  , ndarray = require('ndarray')
  , awise = require('../lib')
  , cwise = require('cwise')

describe( "1d mean", function() {

  var mul = cwise({
    args: ['array','scalar'],
    body: function(a,s) { a*=s }
  })

  var mean = awise({
    reduce: function(s, x) { return s+x; },
    post:   function(a, n) {
      mul(a, 1/n.reduce(function(p,m){return p*m},1) )
    }
  })

  it("computes the scalar mean",function() {
    var A = ndarray(new Float64Array([1,2,3,4,5,6,7,8]), [8])
    assert.closeTo( mean(A),  (1+2+3+4+5+6+7+8)/8, 1e-8 )
  })

  it("Works with javascript arrays",function() {
    var A = ndarray([1,2,3,4,5,6,7,8], [8])
    assert.closeTo( mean(A),  (1+2+3+4+5+6+7+8)/8, 1e-8 )
  })


})

describe( "1d product", function() {

  var prod = awise({
    initialize:    function() { return 1 },
    reduce: function(s, x) { return s*x; },
  })

  it("computes the product reduction of a vector",function() {
    var A = ndarray(new Float64Array([1,2,3,4,5,6,7,8]), [8])
    assert.closeTo( prod(A),  1*2*3*4*5*6*7*8, 1e-8 )
  })

})

