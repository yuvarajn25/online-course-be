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

eval("\n\nexports.DYNAMODB_TABLE_NAME = \"\";\nexports.ENTITY_TYPES = {\n  USER: \"User\"\n};\n\n//# sourceURL=webpack://online-course/./constants.js?");

/***/ }),

/***/ "./helper/dynamodb-helper.js":
/*!***********************************!*\
  !*** ./helper/dynamodb-helper.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\nvar _awsSdk = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n\nvar _awsSdk2 = _interopRequireDefault(_awsSdk);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass DynamoDBHelper {\n  constructor() {\n    this.dynamodb = new _awsSdk2.default.DynamoDB.DocumentClient();\n    this.tableName = \"onlineCourse\";\n  }\n\n  async getEntityById(entityType, id) {\n    const params = {\n      TableName: this.tableName,\n      Key: {\n        entityType,\n        id\n      }\n    };\n    const item = await this.dynamodb.get(params).promise();\n    return item && Object.keys(item).length > 0 && item;\n  }\n\n  async batchWrite(items) {\n    const params = {\n      RequestItems: {\n        [this.tableName]: items.map(item => ({\n          PutRequest: {\n            Item: item\n          }\n        }))\n      }\n    };\n    console.log(`batchWrite::`, JSON.stringify(params, 0, 2));\n    return this.dynamodb.batchWrite(params).promise();\n  }\n\n}\n\nexports.default = DynamoDBHelper;\n\n//# sourceURL=webpack://online-course/./helper/dynamodb-helper.js?");

/***/ }),

/***/ "./lambdas/postAuthentication.js":
/*!***************************************!*\
  !*** ./lambdas/postAuthentication.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar _constants = __webpack_require__(/*! ../constants */ \"./constants.js\");\n\nvar _dynamodbHelper = __webpack_require__(/*! ../helper/dynamodb-helper */ \"./helper/dynamodb-helper.js\");\n\nvar _dynamodbHelper2 = _interopRequireDefault(_dynamodbHelper);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nmodule.exports.handler = async (event, context, callback) => {\n  console.log(`PostAuthentication lambda-Event: ${JSON.stringify(event, 0, 2)}`);\n  const dynamoDBHelper = new _dynamodbHelper2.default();\n  const id = event.userName;\n  const isExists = await dynamoDBHelper.getEntityById(_constants.ENTITY_TYPES.USER, id);\n  console.log(`isExists`, isExists);\n\n  if (!isExists) {\n    await dynamoDBHelper.batchWrite([{\n      id,\n      entityType: _constants.ENTITY_TYPES.USER,\n      ...event.request.userAttributes\n    }]);\n  }\n\n  callback(null, event);\n};\n\n//# sourceURL=webpack://online-course/./lambdas/postAuthentication.js?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");;

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
/******/ 	var __webpack_exports__ = __webpack_require__("./lambdas/postAuthentication.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;