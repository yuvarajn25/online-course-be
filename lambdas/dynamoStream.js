const functionsRegistry = require("../postMutations/functions-registry");

module.exports.handler = async (event, context, callback) => {
  try {
    console.log(`lambda-Event: ${JSON.stringify(event, 0, 2)}`);
    await Promise.all(
      event.Records.map((record) => {
        const entityType = record.dynamodb.Keys.entityType.S;
        const handlers = functionsRegistry[entityType];
        if (!handlers) return;
        return Promise.all(handlers.map((handler) => handler(record)));
      })
    );
    callback(null, event);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
