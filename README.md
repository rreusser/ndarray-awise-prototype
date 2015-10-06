# ndarray-awise-prototype

[![Build Status](https://travis-ci.org/rreusser/ndarray-awise-prototype.svg)](https://travis-ci.org/rreusser/ndarray-awise-prototype) [![Dependency Status](https://david-dm.org/rreusser/ndarray-awise-prototype.svg)](https://david-dm.org/rreusser/ndarray-awise-prototype)

Perform axis-wise operations on an ndarary

**Warning:** In hindsight, while this library does provide some syntactic sugar for defining operations, the methodology and syntax could definitely be improved. See: https://github.com/rreusser/ndarray-awise-prototype/issues/1 and https://github.com/scijs/cwise/issues/9. It works and I'll leave the code here, but determining the best approach remains a work in progress. I'd consider it production-ready for what it does and if you're not performance-limited, but a more sophisticated approach would likely perform better.

## Introduction

This library implements map-reduce operations along a dimension or dimensions of an ndarray. Its input is a single ndarray, and its output is a different ndarray containing the reduction over the specified dimensions.

If you're familiar with cwise, think of it like this: it uses cwise to strap a map-reduce operation onto some combination of dimensions. Its shortcoming is that it should generate optimized code itself instead of relying on cwise to accomplish this as an afterthought. I'm also not 100% sure where this fits on the spectrum between component-wise and tensor operations so thoughts/ideas/extensions/criticism are welcome before this gets properly finalized.

## Examples

### Mean

```javascript
var awise = require('ndarray-awise-prototype'),
    ops = require('ndarray-ops')

var mean = awise({
  reduce: function(s, x) { return s+x; },
  post:   function(a, shape) {
    // Divide by the product of the shape of the reduced dimensions:
    ops.mulseq(a, 1/shape.reduce(function(n,l){return n*l},1) )
  }
})

mean(A)                // mean along the last dimension of an ndarray
mean(A, {axis: 0})     // mean along dimension 0 of an ndarray
mean(A, {axes: [1,2]}) // mean along dimensions 1 and 2 of an ndarray
```

### Product

```javascript
var prod = awise({
  initialize: function() { return 1; },
  reduce: function(p, x) { return p*x; },
})

```


## API

### `require('awise')( options )`
Create an axis-wise operation. Options are:
- `options`:
  - `initialize` (optional): a function that gets passed to [ndarray-fill](https://github.com/scijs/ndarray-fill) to initialize the reduce operation. As such, receives the current indices as its arguments. If no initialize function is passed, result is initialized to zero.
  - `reduce`: A function that implements the reduce operator. Takes as its arguments the accumulated value and a given element; responsible for returning the subsequent value. For example, the reduce operator for computing a sum would be `function(sum, x) { return sum + x }`.
  - `post` (optional): a function to post-process the reduced values. It receives the ndarray representing the reduced result as its first argument and the shape of the reduced dimensions as its second argument. So for example, for a 2x3x4 array with an axis-wise operation on  `axes: [0,2]`, the first argument will be an ndaray with shape `[3]`, and the second argument will be the array `[2,4]`.

**Returns**: An axis-wise operator as specified below

### `awiseOperator( A [, options] )`
Performs an axis-wise operation on array `A`.
- `A`: the ndarray to be reduced.
- `options`:
  - `axis`: a single axis number over which to reduce, starting at zero.
  - `axes`: a list of axes over which to reduce. Only one of `axis` and `axes` may be specified. If neither is specified, will reduce over the last dimension.
  - `output` (optional): An ndarray that receives the output. Useful for avoiding unnecessary memory allocation and garbage collection. If not specified, uses an ndarray of the same `dtype` is allocated.
**Returns**: If ndarray is reduced over all dimensions (i.e. the result has dimension zero), the bare result is returned (i.e. a scalar). For all other cases, the reduced ndarray containing the result is returned.


## Credits

(c) 2015 Ricky Reusser. MIT License
