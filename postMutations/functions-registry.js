const { ENTITY_TYPES } = require("../constants");
const { sendSubscriptionEmail } = require("./functions/subscribe");

module.exports = {
  [ENTITY_TYPES.COURSE_SUBSCRIPTION]: [sendSubscriptionEmail],
};
