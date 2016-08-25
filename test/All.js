var o  = require('atom').o(module).main
var oo  = require('atom').oo(module)
var _o = require('bond')._o(module)
var __ = require('@carbon-io/fibers').__(module)
var testtube = require('test-tube')

/**************************************************************************
 * All
 */
module.exports = o({

  /**********************************************************************
   * _type
   */
  _type: testtube.TestSuite,

  /**********************************************************************
   * name
   */
  name: "Carbond tests",

  /**********************************************************************
   * tests
   */
  tests: [
    _o('./AclTests'),
    _o('./AuthenticatorTests'),
    _o('./BasicCollectionTests'),
    _o('./BasicEndpointTests'),
    _o('./HasherTests'),
    _o('./IdGeneratorTests'),
    _o('./MongoDBCollectionTests'),
    _o('./ParameterParsingTests'),
    _o('./StartStopTests'),
  ],
})
