import AWS from "aws-sdk";

export default class DynamoDBHelper {
  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient();
    this.tableName = "onlineCourse";
  }

  async getEntityById(entityType, id) {
    if (!id) return null;
    const params = {
      TableName: this.tableName,
      Key: { entityType, id },
    };
    const item = await this.dynamodb.get(params).promise();
    return item && Object.keys(item).length > 0 && item.Item;
  }

  async batchWrite(items) {
    const params = {
      RequestItems: {
        [this.tableName]: items.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };
    console.log(`batchWrite::`, JSON.stringify(params, 0, 2));
    return this.dynamodb.batchWrite(params).promise();
  }
}
