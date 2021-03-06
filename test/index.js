var __ = require('@carbon-io/carbon-core').fibers.__(module)
var o = require('@carbon-io/carbon-core').atom.o(module)
var _o = require('@carbon-io/carbon-core').bond._o(module)
var testtube = require('@carbon-io/carbon-core').testtube

/**************************************************************************
 * All tests
 */
__(function() {
  module.exports = o.main({

    /**********************************************************************
     * _type
     */
    _type: testtube.Test,

    /**********************************************************************
     * name
     */
    name: "Carbond tests",

    /**********************************************************************
     * tests
     */
    tests: [
      _o('./service'),
      _o('./AclTests'),
      _o('./EndpointAclTests'),
      _o('./AuthenticatorTests'),
      _o('./collections'),
      _o('./BasicEndpointTests'),
      _o('./docgen'),
      _o('./HasherTests'),
      _o('./IdGeneratorTests'),
      _o('./mongodb'),
      _o('./limiter'),
      _o('./ParameterParsingTests'),
      _o('./StartStopTests'),
      _o('./SslTests'),
      _o('../docs/code-frags/test')
    ],
  })
})
