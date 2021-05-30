/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./constants.js":
/*!**********************!*\
  !*** ./constants.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\n\nexports.DYNAMODB_TABLE_NAME = \"\";\nexports.ENTITY_TYPES = {\n  USER: \"User\",\n  COURSE: \"Course\",\n  COURSE_SUBSCRIPTION: \"CourseSubscription\"\n};\nexports.OPERATION = {\n  INSERT: \"INSERT\",\n  UPDATE: \"UPDATE\"\n};\nexports.DYNAMO_EVENTS = {\n  INSERT: \"INSERT\"\n};\nexports.EMAIL_TYPES = {\n  SUBSCRIPTION: \"SUBSCRIPTION\"\n};\n\n//# sourceURL=webpack://online-course/./constants.js?");

/***/ }),

/***/ "./helper/dynamodb-helper.js":
/*!***********************************!*\
  !*** ./helper/dynamodb-helper.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\n\nvar _awsSdk = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n\nvar _awsSdk2 = _interopRequireDefault(_awsSdk);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nclass DynamoDBHelper {\n  constructor() {\n    this.dynamodb = new _awsSdk2.default.DynamoDB.DocumentClient();\n    this.tableName = \"onlineCourse\";\n  }\n\n  async getEntityById(entityType, id) {\n    if (!id) return null;\n    const params = {\n      TableName: this.tableName,\n      Key: {\n        entityType,\n        id\n      }\n    };\n    const item = await this.dynamodb.get(params).promise();\n    return item && Object.keys(item).length > 0 && item.Item;\n  }\n\n  async batchWrite(items) {\n    const params = {\n      RequestItems: {\n        [this.tableName]: items.map(item => ({\n          PutRequest: {\n            Item: item\n          }\n        }))\n      }\n    };\n    console.log(`batchWrite::`, JSON.stringify(params, 0, 2));\n    return this.dynamodb.batchWrite(params).promise();\n  }\n\n}\n\nexports.default = DynamoDBHelper;\n\n//# sourceURL=webpack://online-course/./helper/dynamodb-helper.js?");

/***/ }),

/***/ "./helper/email-helper.js":
/*!********************************!*\
  !*** ./helper/email-helper.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.sendEmail = sendEmail;\n\nvar _lodash = __webpack_require__(/*! lodash */ \"lodash\");\n\nvar _lodash2 = _interopRequireDefault(_lodash);\n\nvar _constants = __webpack_require__(/*! ../constants */ \"./constants.js\");\n\nvar _nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\");\n\nvar nodemailer = _interopRequireWildcard(_nodemailer);\n\nfunction _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== \"function\") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }\n\nfunction _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== \"object\" && typeof obj !== \"function\") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== \"default\" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst templateFiles = {\n  [_constants.EMAIL_TYPES.SUBSCRIPTION]: __webpack_require__(/*! ../templates/subscription.html.template */ \"./templates/subscription.html.template\")\n}; // compile templates\n\nconst templates = {};\nObject.keys(templateFiles).forEach(filename => {\n  const rawTemplate = templateFiles[filename];\n  templates[filename] = _lodash2.default.template(rawTemplate);\n});\n\nasync function sendEmail(template, content, emailProps) {\n  console.log(`SendEmil:: `, JSON.stringify({\n    template,\n    content,\n    emailProps\n  }, 0, 2));\n  const html = templates[template](content);\n  const transporter = nodemailer.createTransport({\n    host: process.env.SMTP_HOST,\n    port: 587,\n    secure: false,\n    auth: {\n      user: process.env.SMTP_USER,\n      pass: process.env.SMTP_PASS\n    }\n  });\n  let info = await transporter.sendMail({ ...emailProps,\n    html\n  });\n  console.log(\"Message sent: %s\", info.messageId);\n}\n\n//# sourceURL=webpack://online-course/./helper/email-helper.js?");

/***/ }),

/***/ "./lambdas/dynamoStream.js":
/*!*********************************!*\
  !*** ./lambdas/dynamoStream.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst functionsRegistry = __webpack_require__(/*! ../postMutations/functions-registry */ \"./postMutations/functions-registry.js\");\n\nmodule.exports.handler = async (event, context, callback) => {\n  try {\n    console.log(`lambda-Event: ${JSON.stringify(event, 0, 2)}`);\n    await Promise.all(event.Records.map(record => {\n      const entityType = record.dynamodb.Keys.entityType.S;\n      const handlers = functionsRegistry[entityType];\n      if (!handlers) return;\n      return Promise.all(handlers.map(handler => handler(record)));\n    }));\n    callback(null, event);\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n};\n\n//# sourceURL=webpack://online-course/./lambdas/dynamoStream.js?");

/***/ }),

/***/ "./postMutations/functions-registry.js":
/*!*********************************************!*\
  !*** ./postMutations/functions-registry.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst {\n  ENTITY_TYPES\n} = __webpack_require__(/*! ../constants */ \"./constants.js\");\n\nconst {\n  sendSubscriptionEmail\n} = __webpack_require__(/*! ./functions/subscribe */ \"./postMutations/functions/subscribe.js\");\n\nmodule.exports = {\n  [ENTITY_TYPES.COURSE_SUBSCRIPTION]: [sendSubscriptionEmail]\n};\n\n//# sourceURL=webpack://online-course/./postMutations/functions-registry.js?");

/***/ }),

/***/ "./postMutations/functions/subscribe.js":
/*!**********************************************!*\
  !*** ./postMutations/functions/subscribe.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true\n}));\nexports.sendSubscriptionEmail = sendSubscriptionEmail;\n\nvar _constants = __webpack_require__(/*! ../../constants */ \"./constants.js\");\n\nvar _dynamodbHelper = __webpack_require__(/*! ../../helper/dynamodb-helper */ \"./helper/dynamodb-helper.js\");\n\nvar _dynamodbHelper2 = _interopRequireDefault(_dynamodbHelper);\n\nvar _emailHelper = __webpack_require__(/*! ../../helper/email-helper */ \"./helper/email-helper.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nasync function sendSubscriptionEmail(record) {\n  // Sending email only for insert events\n  if (record.eventName !== _constants.DYNAMO_EVENTS.INSERT) return;\n  const courseId = record.dynamodb.NewImage.courseId.S;\n  const userId = record.dynamodb.NewImage.userId.S;\n  console.log({\n    courseId,\n    userId\n  });\n  const dynamoDBHelper = new _dynamodbHelper2.default();\n  const [course, user] = await Promise.all([dynamoDBHelper.getEntityById(_constants.ENTITY_TYPES.COURSE, courseId), dynamoDBHelper.getEntityById(_constants.ENTITY_TYPES.USER, userId)]);\n  console.log(course, user);\n  if (!course || !user) return;\n  const courseUser = await dynamoDBHelper.getEntityById(_constants.ENTITY_TYPES.USER, course.authorId);\n  console.log(courseUser);\n  if (!courseUser) return;\n  return (0, _emailHelper.sendEmail)(_constants.EMAIL_TYPES.SUBSCRIPTION, {\n    user: user.name,\n    course: course.name\n  }, {\n    from: `\"Online Course\" <yuvarajn25@gmail.com>`,\n    // Current used mail client not\n    to: courseUser.email,\n    subject: \"New User Subscription\"\n  });\n}\n\n//# sourceURL=webpack://online-course/./postMutations/functions/subscribe.js?");

/***/ }),

/***/ "./templates/subscription.html.template":
/*!**********************************************!*\
  !*** ./templates/subscription.html.template ***!
  \**********************************************/
/***/ ((module) => {

eval("module.exports = Buffer.from(\"PCFET0NUWVBFIGh0bWwgUFVCTElDICItLy9XM0MvL0RURCBYSFRNTCAxLjAgVHJhbnNpdGlvbmFsLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMS9EVEQveGh0bWwxLXRyYW5zaXRpb25hbC5kdGQiPgo8aHRtbD4KICA8Ym9keT4KICAgIDxoMT5OZXcgVXNlciBnb3QgU3Vic2NyaWJlZDwvaDE+CgogICAgPHA+PCU9IHVzZXIgJT4gU3Vic2NyaWJlZCBmb3IgdGhlIGNvdXJzZSA8JT0gY291cnNlJT48L3A+CiAgICA8cD48L3A+CiAgICA8cD48L3A+CiAgPC9ib2R5Pgo8L2h0bWw+Cg==\", \"base64\")\n\n//# sourceURL=webpack://online-course/./templates/subscription.html.template?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("lodash");;

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("nodemailer");;

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
/******/ 	var __webpack_exports__ = __webpack_require__("./lambdas/dynamoStream.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;