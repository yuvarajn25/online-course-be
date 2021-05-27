import { ENTITY_TYPES } from "../constants";
import DynamoDBHelper from "../helper/dynamodb-helper";

module.exports.handler = async (event, context, callback) => {
  console.log(
    `PostAuthentication lambda-Event: ${JSON.stringify(event, 0, 2)}`
  );

  const dynamoDBHelper = new DynamoDBHelper();
  const id = event.userName;
  const isExists = await dynamoDBHelper.getEntityById(ENTITY_TYPES.USER, id);
  console.log(`isExists`, isExists);
  if (!isExists) {
    await dynamoDBHelper.batchWrite([
      {
        id,
        entityType: ENTITY_TYPES.USER,
        ...event.request.userAttributes,
      },
    ]);
  }

  callback(null, event);
};
