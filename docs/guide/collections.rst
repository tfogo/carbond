===========
Collections
===========

.. toctree::

Carbond :js:class:`~carbond.Collection`\s provide a high-level abstraction for
defining :js:class:`~carbond.Endpoint`\s that behave like a collection of
resources. When you define a :js:class:`~carbond.Collection` you may define the
following methods:

- ``insert(obj, reqCtx)``
- ``find(query, reqCtx)``
- ``update(query, update, reqCtx)``
- ``remove(query, reqCtx)``
- ``saveObject(obj, reqCtx)``
- ``findObject(id, reqCtx)``
- ``updateObject(id, update, reqCtx)``
- ``removeObject(id, reqCtx)``

Which results in the following tree of :js:class:`~carbond.Endpoint`\s and
:js:class:`~carbond.Operation`\s:

- ``/<collection>``

  - ``POST`` which maps to :js:func:`~carbond.Collection.insert`
  - ``GET`` which maps to :js:func:`~carbond.Collection.find`
  - ``PATCH`` which maps to :js:func:`~carbond.Collection.update`
  - ``DELETE`` which maps to :js:func:`~carbond.Collection.remove`
    
- ``/<collection>/:_id``

  -  ``PUT`` which maps to :js:func:`~carbond.Collection.saveObject`
  -  ``GET`` which maps to :js:func:`~carbond.Collection.findObject`
  -  ``PATCH`` which maps to :js:func:`~carbond.Collection.updateObject`
  -  ``DELETE`` which maps to :js:func:`~carbond.Collection.removeObject`

When defining a :js:class:`~carbond.Collection`, it is not required that all
methods be implemented. Instead, only methods that are defined will be enabled.
For example, here is a collection that only defines the
:js:func:`~carbond.Collection.insert` method:

.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :lines: 1-11,15-19,35-36,40-42,50-

Creating Collections
---------------------------------

.. todo:: remove mongodb specific options from this document (e.g., ``multi``)

:js:class:`~carbond.Collection` endpoints can be created either by creating an
instance of :js:class:`~carbond.Collection` (most common) or by sub-classing (as
with the :js:class:`~carbond.mongodb.MongoDBCollection` class). 

The following sections describe at a high-level how each operation should be
implemented (note, if an error condition arises, the appropriate
:js:class:`~httperrors.HttpError` should be thrown).

insert
*********************

The :js:func:`~carbond.Collection.insert` method should take the ``object``
passed to it as an argument and save that ``object`` to the backing datastore.
If :js:attr:`~carbond.Collection.idGenerator` is defined, the ``object`` will
have its ``_id`` field prepopulated, otherwise,
:js:func:`~carbond.Collection.insert` should generate, or delegate the
generation of, the ``_id`` field and update the ``object``. It should return the
``object`` (updated to include the ``_id`` if appropriate) that was inserted.

find
*********************

The :js:func:`~carbond.Colletion.find` method should take the query ``object``
passed to it, interrogate the backing datastore, and return the ``list`` of
resources that satisfy the query. Query modifiers (e.g., ``limit`` and ``skip``)
should be accessed via the ``reqCtx`` parameter.

update
*********************

The :js:func:`~carbond.Colletion.update` method should take the query ``object``
and update ``object`` passed to it, update all resources in the backing
datastore as appropriate, and return an object of the form ``{"n": <integer>}``
indicating how many resources were updated .  Query/update modifiers (e.g.,
``multi``) should be accessed via the ``reqCtx`` parameter.

remove
*********************

.. todo:: should this be ``delete``. ``remove`` has been deprecated in the
          mongo driver and ``delete`` fits better with HTTP verbs.

The :js:func:`~carbond.Collection.remove` method should take the query
``object`` and remove all matching resources from the backing datastore. It
should then return a document of the form ``{"n": <integer>}`` indicating how
many resources were removed. Query modifiers (e.g., ``single``) should be
accessed via the ``reqCtx`` parameter.

saveObject
*********************

The :js:func:`~carbond.Collection.saveObject` method should take the ``object``
passed to it (already populated with the appropriate ``_id``) and save it to the
backing datastore. If the resource replaced another resource that existed with
that ``_id``, ``false`` should be returned. Otherwise, ``true`` should be
returned to indicate a new resource was created for the ``_id``.

findObject
*********************

The :js:func:`~carbond.Collection.findObject` method should take the ``id``
parameter passed to it and query the backing datastore for the resource with
that ``id``. If the resource exists, the ``object`` representing the resource
should be returned. Otherwise, ``null`` or ``undefined`` can be returned to
indicate that no resource was found matching that ``id``.

updateObject
*********************

The :js:func:`~carbond.Collection.updateObject` method should take the ``id``
and update ``object`` passed to it, update the resource identified by ``id`` if
present, and return the ``object`` representing the resource if it existed. If
not, ``null`` or ``undefined`` can be returned to indicate that the resource was
not found.

removeObject
*********************

The :js:func:`~carbond.Collection.removeObject` method should take the ``id``
parameter passed to it, remove the resource identified bu ``id``, and return the
``object`` representing the resource that was removed if it was present.
Otherwise, ``null`` or ``undefined`` can be returned to indicate that the
resource was not fount

Enabling / disabling operations 
-------------------------------

While omitting an operation's method is enough to disable it (i.e. simply not
defining an :js:func:`~carbond.Collection.insert` method will cause the
collection to not support inserts), you may also explicitly enable / disable
:js:class:`~carbond.Collection` operations via the
:js:func:`~carbond.Collection.enabled` property. This is useful for temporarily
diabling an operation or when instantiating or sub-classing
:js:class:`~carbond.Collections` that support default implementations for all
:js:class:`~carbond.Collection` operations, such as
:js:class:`~.carbond.MongoDBCollection`.
    
.. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
    :language: javascript
    :linenos:
    :emphasize-lines: 9-13
    :lines: 9-11,15-19,30-34,36-39,42-46,49-53

Access control 
-------------------------------

In addition to enabling / disabling operations, you may also gate operations via
access control policies (see: :ref:`access control <access-control-ref>`).

..
    XXX: work in progress, do not rely on these docs for semantics at the moment

    Carbond :js:class:`~carbond.collections.Collection`\ s provide a high-level
    abstraction for defining :js:class:`~carbond.Endpoint`\s that behave like a
    collection of resources. When you define a
    :js:class:`~carbond.collections.Collection` you may define the following
    methods:

    .. todo:: consider json patch implementation here that can be overriden with a
              header or embedded type

    .. todo:: finalize these

    - ``insert([obj, ...], reqCtx)``
    - ``save([obj, ...], reqCtx)``
    - ``find(query, reqCtx)``
    - ``update(query, update, reqCtx)``
    - ``remove(query, reqCtx)``
    - ``insertObject(obj, reqCtx)``
    - ``saveObject(id, obj, reqCtx)``
    - ``findObject(id, reqCtx)``
    - ``updateObject(id, update, reqCtx)``
    - ``removeObject(id, reqCtx)``

    ..  - ``insert(obj, reqCtx)``
        - ``find(query, reqCtx)``
        - ``update(query, update, reqCtx)``
        - ``remove(query, reqCtx)``
        - ``saveObject(obj, reqCtx)``
        - ``findObject(id, reqCtx)``
        - ``updateObject(id, update, reqCtx)``
        - ``removeObject(id, reqCtx)``

    Which results in the following tree of :js:class:`~carbond.Endpoint`\s and
    :js:class:`~carbond.Operation`\s:

    - ``/<collection>``

      - ``POST`` which maps to ``insert``, ``insertObject``
      - ``PUT`` which maps to ``save``
      - ``GET`` which maps to ``find``
      - ``PATCH`` which maps to ``update``
      - ``DELETE`` which maps to ``remove``
        
    - ``/<collection>/:_id``

      - ``PUT`` which maps to ``saveObject``
      - ``GET`` which maps to ``findObject``
      - ``PATCH`` which maps to ``updateObject``
      - ``DELETE`` which maps to ``removeObject``

    .. - ``/<collection>``
          - ``POST`` which maps to ``insert``
          - ``GET`` which maps to ``find``
          - ``PATCH`` which maps to ``update``
          - ``DELETE`` which maps to ``remove``
        - ``/<collection>/:_id``
          -  ``PUT`` which maps to ``saveObject``
          -  ``GET`` which maps to ``findObject``
          -  ``PATCH`` which maps to ``updateObject``
          -  ``DELETE`` which maps to ``removeObject``

    Note, the convention is that ``*Object`` variants operate on a single resource,
    while non-\ ``*Object`` variants operate on the entire collection. The one
    exception to the rule, given the collection vs. resource level paths (e.g.
    ``/<collection>/:_id``), is ``insertObject`` since the resource id is generated
    in this case and can not be known a priori. At the ``HTTP`` level ``insert`` and
    ``insertObject`` are disambiguated by whether the body carries the
    representation for a single resource or multiple.

    When defining a :js:class:`~carbond.collections.Collection`, one is not required
    to define all methods. Only defined methods will be enabled. For example, here
    is a collection that only defines the ``insert`` method:

    .. todo:: XXX: add :lines: when the example gets fleshed out (see comment)

    .. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
        :language: javascript
        :linenos:
        :lines: 9-11,15-19,35-36,40-42

    Creating Collections
    ---------------------------------

    :js:class:`~carbond.collections.Collection` endpoints can be created either by
    creating an instance of :js:class:`~carbond.collections.Collection` (most
    common) or by sub-classing (as with the
    :js:class:`carbond.mongodb.MongoDBCollection` class).

    .. todo:: revisit these sections

    .. todo:: document operation modifiers like ``limit`` and ``upsert``

    The following descriptions of operation implementations are from the perspective
    of the person implementing the handlers. The actual semantics of the HTTP level
    exchange are defined by the various operation configurations (e.g., ``insertObject``)
    and the :js:class:`~carbond.Collection` class itself. Only the "happy path" is
    described below. If an error condition is encountered, handlers should
    throw the appropriate :js:class:`~httperrors.HttpError` to indicate this.

    insert
    ******

    The ``insert`` implementation should:

    - expect a list of resources
    - generate, or delegate the generation of, identifiers for the resources
    - persist the resources
    - return a list of resources updated to include the new identifiers

    :js:class:`~carbond.Collection` will then: 

    - return the list of resources if clients are not ``Carbon`` aware, or 
      the identifiers themselves if dealing with ``Carbon`` aware clients

    save
    ****

    The ``save`` implementation should:

    - expect a list of resources with identifiers present
    - replace the existing collection with the list of resources
    - return nothing

    :js:class:`~carbond.Collection` will then: 

    - return nothing

    find
    ****

    The ``find`` implementation should:

    - expect a query (along with other query modifiers like ``limit``, etc.)
    - collect all resources that satisfy the query
    - return the list of matched resources

    :js:class:`~carbond.Collection` will then: 

    - return the list of resources matching the query

    update
    ******

    The ``update`` implementation should:

    - expect a query (along with other query modifiers like ``upsert``, etc.)
    - expect a document describing how to update the target resources
    - update all resources matching the query or insert a resource if conditions are
      met warranting an ``upsert``
    - if an ``upsert`` took place, return the new resource updated to include a new
      identifier 
    - otherwise, it should return the number of resources updated

    :js:class:`~carbond.Collection` will then: 

    - if an ``upsert`` took place, return the new resource updated to include a new
      identifier if clients are not ``Carbon`` aware, or simply the identifier
      itself if dealing with ``Carbon`` aware clients
    - otherwise, it will return the number of resources updated

    remove
    *********************

    The ``remove`` implementation should:

    - expect a query (along with other query modifiers like ``limit``, etc.)
    - remove all resources that match the query
    - return the number of resources that were removed

    :js:class:`~carbond.Collection` will then: 

    - return the number of resources that were removed

    insertObject
    *********************

    The ``insertObject`` implementation should:

    - expect a single resource
    - generate, or delegate the generation of, the identifier for the resource
    - persist the resource
    - return the resource updated to include the new identifier 

    :js:class:`~carbond.Collection` will then: 

    - return the resource if clients are not ``Carbon`` aware, or 
      the identifier itself if dealing with ``Carbon`` aware clients

    saveObject
    *********************

    The ``saveObject`` implementation should:

    - expect a resource with identifier present
    - replace the existing resource if one exists with the same identifier or insert
      the object if it is not present
    - return ``true`` if the object was inserted and ``false`` otherwise

    :js:class:`~carbond.Collection` will then: 

    - if the resource was inserted, return the resource if clients are not ``Carbon`` aware, or 
      the identifier itself if dealing with ``Carbon`` aware clients
    - otherwise, return nothing
      
    findObject
    *********************

    The ``findObject`` implementation should:

    - expect an identifier
    - retrieve the resource with the specified identifier
    - return the resource

    :js:class:`~carbond.Collection` will then: 

    - return the resource with the specified identifier


    updateObject
    *********************

    The ``updateObject`` implementation should:

    - expect an identifier (along with other query modifiers like ``upsert``, etc.)
    - expect a document describing how to update the target resources
    - update the resource having the identifier specified or save the resource if conditions are
      met warranting an ``upsert``
    - if an ``upsert`` took place, return the new resource 
    - otherwise, return ``true`` if the resource was updated or ``false`` if not

    :js:class:`~carbond.Collection` will then: 

    - if an ``upsert`` took place, return the new resource updated to include a new
      identifier if clients are not ``Carbon`` aware, or simply the identifier
      itself if dealing with ``Carbon`` aware clients
    - otherwise, return nothing

    removeObject
    *********************

    The ``removeObject`` implementation should:

    - expect an identifier
    - remove the resource associated with the identifier
    - return nothing

    :js:class:`~carbond.Collection` will then: 

    - return nothing

    Enabling / disabling operations 
    -------------------------------

    While omitting an operation's method is enough to disable it (i.e. simply not
    defining an ``insert`` method will cause the collection to not support inserts),
    you may also explicitly enable / disable
    :js:class:`~carbond.collections.Collection` operations via the
    :js:attr:`~carbond.collections.Collection.enabled` property. This is useful for
    temporarily disabling an operation or when instantiating or sub-classing
    :js:class:`~carbond.collections.Collections` that support default
    implementations for all :js:class:`~carbond.collections.Collection` operations,
    such as :js:class:`carbond.mongodb.MongoDBCollection`.

    .. todo:: XXX: add :lines: when the example gets fleshed out (see comment)

    .. literalinclude:: ../code-frags/hello-world/lib/HelloService.js
        :language: javascript
        :linenos:
        :lines: 9-11,15-19,30-34,36-39,42-46,49-53

    Access control 
    -------------------------------

    In addition to enabling / disabling operations, you may also gate
    operations via access control policies.

    .. todo:: reference aac?


    .. todo:: fill in these sections

    Related resources 
    -------------------------------
