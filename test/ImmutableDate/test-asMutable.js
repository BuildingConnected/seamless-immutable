var JSC          = require("jscheck");
var assert       = require("chai").assert;
var _            = require("lodash");
var getTestUtils = require("../TestUtils.js");

module.exports = function(config) {
  var Immutable = config.implementation;
  var TestUtils = getTestUtils(Immutable);

  describe("#_asMutable", function() {
    it("returns mutable Date from an immutable Date", function() {
      var immutable = Immutable(new Date());
      var mutable = immutable._asMutable();

      assertNotArray(mutable);
      assertCanBeMutated(mutable);
      assert.isFalse(Immutable.isImmutable(mutable));
      assert.deepEqual(immutable, mutable);
      assert.equal(Object.keys(mutable).length, 0);
    });

    it("returns mutable Date from an immutable Date when using the deep flag", function() {
      var immutable = Immutable(new Date());
      var mutable = immutable._asMutable({deep: true});

      assertNotArray(mutable);
      assertCanBeMutated(mutable);
      assert.isFalse(Immutable.isImmutable(mutable));
      assert.deepEqual(immutable, mutable);
      assert.equal(Object.keys(mutable).length, 0);
    });

    it("preserves prototypes after call to _asMutable", function() {
      var data = new Date();

      var immutable = Immutable(data, {prototype: Date.prototype});
      var result = immutable._asMutable();

      assert.deepEqual(result, data);
      TestUtils.assertHasPrototype(result, Date.prototype);
    });

  });

  function assertCanBeMutated(obj) {
    try {
      var newElement = { foo: "bar" };
      var originalKeyCount = Object.keys(obj).length;
      var key = "__test__field__";

      assert.equal(false, obj.hasOwnProperty(key));

      obj[key] = newElement;

      assert.equal(true, obj.hasOwnProperty(key));

      assert.equal(obj[key], newElement);
      assert.equal(Object.keys(obj).length, originalKeyCount + 1);

      delete obj[key];
    } catch(error) {
      assert.fail("Exception when trying to verify that this object was mutable: " + JSON.stringify(obj));
    }
  }

  function assertNotArray(obj) {
    assert(!(obj instanceof Array), "Did not expect an Array, but got one. Got: " + JSON.stringify(obj))
  }
};
