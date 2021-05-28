/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./constants.js":
/*!**********************!*\
  !*** ./constants.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nexports.DYNAMODB_TABLE_NAME = \"\";\nexports.ENTITY_TYPES = {\n  USER: \"User\"\n};\nexports.OPERATION = {\n  INSERT: \"INSERT\",\n  UPDATE: \"UPDATE\"\n};\n\n//# sourceURL=webpack://online-course/./constants.js?");

/***/ }),

/***/ "./helper/dynamodb-helper.js":
/*!***********************************!*\
  !*** ./helper/dynamodb-helper.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\nvar _awsSdk = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n\nvar _awsSdk2 = _interopRequireDefault(_awsSdk);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass DynamoDBHelper {\n  constructor() {\n    this.dynamodb = new _awsSdk2.default.DynamoDB.DocumentClient();\n    this.tableName = \"onlineCourse\";\n  }\n\n  async getEntityById(entityType, id) {\n    const params = {\n      TableName: this.tableName,\n      Key: {\n        entityType,\n        id\n      }\n    };\n    const item = await this.dynamodb.get(params).promise();\n    return item && Object.keys(item).length > 0 && item;\n  }\n\n  async batchWrite(items) {\n    const params = {\n      RequestItems: {\n        [this.tableName]: items.map(item => ({\n          PutRequest: {\n            Item: item\n          }\n        }))\n      }\n    };\n    console.log(`batchWrite::`, JSON.stringify(params, 0, 2));\n    return this.dynamodb.batchWrite(params).promise();\n  }\n\n}\n\nexports.default = DynamoDBHelper;\n\n//# sourceURL=webpack://online-course/./helper/dynamodb-helper.js?");

/***/ }),

/***/ "./lambdas/mutations.js":
/*!******************************!*\
  !*** ./lambdas/mutations.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar _functionsRegistry = __webpack_require__(/*! ../mutations/functions-registry */ \"./mutations/functions-registry.js\");\n\nvar _functionsRegistry2 = _interopRequireDefault(_functionsRegistry);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nasync function invokeHandler(event, registry, isMainHandler) {\n  console.log(`Invoke handler`, registry);\n  const result = await registry.mutationHandler(event);\n  if (isMainHandler) event.returnValue = result;else event.prevResult = result;\n\n  const postMutationHandler = registry.postMutationHandler && _functionsRegistry2.default.find(f => f.name === registry.postMutationHandler);\n\n  if (postMutationHandler) {\n    return invokeHandler(event, postMutationHandler);\n  }\n\n  return;\n}\n\nmodule.exports.handler = async (event, context, callback) => {\n  try {\n    console.log(`EVENT:: `, JSON.stringify(event, 0, 2));\n    const {\n      mutationName,\n      args,\n      user\n    } = event;\n\n    const handler = _functionsRegistry2.default.find(f => f.name === mutationName);\n\n    if (handler) {\n      await invokeHandler(event, handler, true);\n    }\n\n    callback(null, event.returnValue);\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n};\n\n//# sourceURL=webpack://online-course/./lambdas/mutations.js?");

/***/ }),

/***/ "./models/base-model.js":
/*!******************************!*\
  !*** ./models/base-model.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\nvar _moment = __webpack_require__(/*! moment */ \"moment\");\n\nvar _moment2 = _interopRequireDefault(_moment);\n\nvar _uuid = __webpack_require__(/*! uuid */ \"uuid\");\n\nvar _constants = __webpack_require__(/*! ../constants */ \"./constants.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass BaseModel {\n  constructor(data, user, operation) {\n    this.user = user;\n    this.data = data;\n    this.operation = operation;\n\n    if (this.operation === _constants.OPERATION.INSERT) {\n      this.setEntityType();\n      this.setId();\n      this.setIndex();\n      this.setAuditFieldsForInsert();\n    } else {\n      this.setAuditFieldsForUpdate();\n    }\n  }\n\n  getData() {\n    return this.data;\n  }\n\n  setEntityType() {\n    this.data.entityType = this.data.entityType || this.constructor.name;\n  }\n\n  setId() {\n    this.data.id = this.data.id || (0, _uuid.v4)();\n  }\n\n  setIndex() {\n    this.data.gsi1 = this.data.gsi1 || this.data.parentId;\n    this.data.gsi2 = this.data.gsi2 || null;\n  }\n\n  setAuditFieldsForInsert() {\n    this.data.createdBy = this.user.claims.name;\n    this.data.createdDate = (0, _moment2.default)().unix();\n  }\n\n  setAuditFieldsForUpdate() {\n    this.data.lastUpdatedBy = this.user.claims.name;\n    this.data.lastUpdatedDate = (0, _moment2.default)().unix();\n  }\n\n}\n\nexports.default = BaseModel;\n\n//# sourceURL=webpack://online-course/./models/base-model.js?");

/***/ }),

/***/ "./models/course.js":
/*!**************************!*\
  !*** ./models/course.js ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\nvar _baseModel = __webpack_require__(/*! ./base-model */ \"./models/base-model.js\");\n\nvar _baseModel2 = _interopRequireDefault(_baseModel);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass Course extends _baseModel2.default {\n  setIndex() {\n    this.data.gsi1 = this.data.authorId;\n  }\n\n}\n\nexports.default = Course;\n\n//# sourceURL=webpack://online-course/./models/course.js?");

/***/ }),

/***/ "./mutations/functions-registry.js":
/*!*****************************************!*\
  !*** ./mutations/functions-registry.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst {\n  addCourse\n} = __webpack_require__(/*! ./functions/course */ \"./mutations/functions/course.js\");\n\nmodule.exports = [{\n  name: \"createCourse\",\n  mutationHandler: addCourse\n}];\n\n//# sourceURL=webpack://online-course/./mutations/functions-registry.js?");

/***/ }),

/***/ "./mutations/functions/course.js":
/*!***************************************!*\
  !*** ./mutations/functions/course.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.addCourse = addCourse;\n\nvar _constants = __webpack_require__(/*! ../../constants */ \"./constants.js\");\n\nvar _course = __webpack_require__(/*! ../../models/course */ \"./models/course.js\");\n\nvar _course2 = _interopRequireDefault(_course);\n\nvar _dynamodbHelper = __webpack_require__(/*! ../../helper/dynamodb-helper */ \"./helper/dynamodb-helper.js\");\n\nvar _dynamodbHelper2 = _interopRequireDefault(_dynamodbHelper);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nasync function addCourse(service) {\n  const {\n    user,\n    args\n  } = service;\n  console.log(`addCourse::`, JSON.stringify(service, 0, 2));\n  const course = new _course2.default({ ...args.course,\n    authorId: user.username\n  }, user, _constants.OPERATION.INSERT);\n  const dynamoDBHelper = new _dynamodbHelper2.default();\n  await dynamoDBHelper.batchWrite([course.getData()]);\n  return course.getData();\n}\n\n//# sourceURL=webpack://online-course/./mutations/functions/course.js?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("moment");;

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./lambdas/mutations.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;