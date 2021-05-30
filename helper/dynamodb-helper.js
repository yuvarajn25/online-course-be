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

  async getEntityByGsi1(entityType, gsi1) {
    const params = {
      TableName: this.tableName,
      IndexName: "entity-gsi1-index",
      KeyConditionExpression: "entityType = :entityType and gsi1 = :gsi1",
      ExpressionAttributeValues: {
        ":entityType": entityType,
        ":gsi1": gsi1,
      },
    };
    const result = await this.dynamodb.query(params).promise();
    return result.Items;
  }

  async getEntityByGsi2(entityType, gsi2) {
    const params = {
      TableName: this.tableName,
      IndexName: "entity-gsi2-index",
      KeyConditionExpression: "entityType = :entityType and gsi2 = :gsi2",
      ExpressionAttributeValues: {
        ":entityType": entityType,
        ":gsi2": gsi2,
      },
    };
    const result = await this.dynamodb.query(params).promise();
    return result.Items;
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

  async batchDelete(items) {
    const params = {
      RequestItems: {
        [this.tableName]: items.map((item) => ({
          DeleteRequest: {
            Key: item,
          },
        })),
      },
    };
    console.log(`batchWrite::`, JSON.stringify(params, 0, 2));
    const response = await this.dynamodb.batchWrite(params).promise();
    return await this.verifyUnProcessedData(response);
  }

  async verifyUnProcessedData(response) {
    try {
      console.log(`verifyUnProcessedData:: `, JSON.stringify(response, 0, 2));
      const unProcessedData = response.UnprocessedItems[this.tableName] || [];
      if (!unProcessedData.length) return response;
      const requestPromises = [];
      const params = {
        RequestItems: {
          [this.tableName]: unProcessedData,
        },
      };
      requestPromises.push(this.dynamodb.batchWrite(params).promise());

      const resp = await Promise.all(requestPromises);
      return verifyUnProcessedData(resp, dynamoHelper);
    } catch (error) {
      throw error;
    }
  }
}
