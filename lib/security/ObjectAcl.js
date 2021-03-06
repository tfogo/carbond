var EJSON = require('@carbon-io/carbon-core').ejson
var _o = require('@carbon-io/carbon-core').bond._o(module)
var o  = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

/******************************************************************************
 * @class ObjectAcl
 * 
 * Example:
 * {
 *    _type: 'datanode/EndpointAcl',
 *
 *   groupDefinitions: { // XXX not sure this is the right name
 *     user: '_id', // can be property path "a.b.c"
 *     role: function(user) { return user.role }  // or can be function  
 *   },
 *   entries: {
 *     "*": {
 *       insert: true, 
 *       findObject: function(user) { return user.title == "CFO" }
 *       "*": false 
 *     },
 *
 *     'role:"Admin"': { // group acl based on the 'role' group defined in groupDefinitions
 *        findObject: true, // equiv to function(user) { return true }
 *        find: true // if omitted would assume the defult defined in permissionDefinitions
 *        save: true // would raise error ??? // XXX not sure if the is necessary
 *     },
 *     'user:1234}': { // user with _id 1234
 *       ... 
 *     },
 *     'user:"1234"}': { // user with _id "1234"
 *       ... 
 *     },
 *     'user:{"$oid":"1234"}': { // user with ObjectId("1234")
 *       ... 
 *     }
 *   }
 * }
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */
  _type: './Acl',

  /**********************************************************************
   * OWNER_SPEC
   */
  OWNER_SPEC: '__owner__',

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.object = null
    this.ownerField = '__owner__'
    this.permissionDefinitions = { // mapping of permissions to defaults
      read: false,
      write: false,
      delete: false,
      admin: false
    } 
  },

  /**********************************************************************
   * _init
   */     
  _init: function() {
    _o('./Acl').prototype._init.call(this)
    
    // add a group definition called __owner__ which is a function that
    // checks to see if user._id is the same as the object owner
    var self = this
    self.groupDefinitions = self.groupDefinitions || {}
    self.groupDefinitions[self.OWNER_SPEC] = function(user) {
      return self.isOwner(user, self.object)
    }
  },

  /**********************************************************************
   * isOwner
   */       
  isOwner: function(user, object) {
    // XXX stringify for $oid mainly. may want to optimize for perf later
    return EJSON.stringify(object[this.ownerField]) === EJSON.stringify(user._id) 
//    return object[this.ownerField] === user._id
  },

  /**********************************************************************
   * sanitize
   */       
  sanitize: function(user, filterSingleValue, filterArrays, acl) {
    return sanitize(this.object, user, filterSingleValue, filterArrays, acl)
  }
})

/**********************************************************************
 * sanitize 
 *
 * Processes values such that if there exist objects with acls that deny
 * read access, they will be forbidden or sanitized appropriately 
 *
 * If the value is an array of Objects, and there exists an Object
 * in the array that has an __acl__ that denies read access, a 403 will
 * be returned, unless filterArrayValues is true, in which case
 * such objects will be removed from the result array
 *
 * If the value is an Object, and has an __acl__ that denies read
 * access a 403 will be returned unless filterSingleValue is true (used by insert for example). XXX?
 * 
 * If the value is an Object or array of Objects, all Objects returned 
 * will have properties denied by an __acl__ removed such that the Objects
 * returned are sanitized of any properties the user does not have permission
 * to read
 */
function sanitize(value, user, filterSingleValue, filterArrays, acl) {
  var result = doSanitize(value, user, filterArrays, acl)
  if (typeof(value) === 'object' && result === undefined) {
    if (!filterSingleValue) {
      throw new Error("User unauthorized to see value") // XXX do we want to do this via exception?
    }
  }
  
  return result
}

/**********************************************************************
 * doSanitize
 */
function doSanitize(value, user, filterArrays, acl) {
  if (!value) { 
    return value
  }

  var result = value
  if (value.constructor === Array) {
    result = doSanitizeArray(value, user, filterArrays, acl)
  } else if (typeof(value) === 'object') {
    result = doSanitizeObject(value, user, filterArrays, acl)
  }
    
  return result
}

/**********************************************************************
 * doSanitizeArray
 */
function doSanitizeArray(arr, user, filterArrays, acl) {
  var result = []
  var processedElem

  arr.forEach(function(elem) {
    if (typeof(elem) === 'object') {
      processedElem = doSanitize(elem, user, filterArrays, acl) // recurse
      if (!processedElem) { // was filtered out
        if (!filterArrays) { // if not filtering then reject entirely
          throw new Error("User not authorized to see value")
        }
      } else {
        result.push(processedElem)
      }
    } else {
      result.push(doSanitize(elem, user, filterArrays, acl)) // otherwise recurse for prims and array
    }
  })
  
  return result
}

/**********************************************************************
 * doSanitizeObject
 */
function doSanitizeObject(obj, user, filterArrays, acl) {
  var result = obj

  var finalAcl = undefined

  var objAclDatum = obj.__acl__
  if (objAclDatum) {
    objAcl = o(aclDatum, null, module.exports) // clone
    objAcl.object = obj
    finalAcl = objAcl
  } 

  if (acl) {
    var aclClone = o({ _type: acl })
    aclClone.object = obj 

    if (finalAcl) {
      finalAcl = aclClone.and(finalAcl)
    } else {
      finalAcl = aclClone
    }
  }
  
  if (finalAcl) {
    // Only check permission if acl exists
    // If acl does not exist result will be the original obj
    if (!finalAcl.hasPermission(user, 'read', undefined)) {
      result = undefined
      // XXX later this is more nuanced to sanitize
    }
  }

  return result
}

/**********************************************************************
 * export
 */
module.exports.sanitize = sanitize
