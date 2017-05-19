var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module).main
var tt = require('@carbon-io/carbon-core').testtube

var serviceTests = o({
  _type: tt.Test,
  name: 'ServiceTests',
  description: 'Services tests',
  tests: [
    _o('./ErrorHandlingTests'),
    _o('./ParameterParsingTests')
  ]
})

module.exports = serviceTests

