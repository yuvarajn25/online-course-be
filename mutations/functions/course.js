import { OPERATION } from "../../constants";
import Course from "../../models/course";
import DynamoDBHelper from "../../helper/dynamodb-helper";

export async function addCourse(service) {
  const { user, args } = service;
  console.log(`addCourse::`, JSON.stringify(service, 0, 2));
  const course = new Course(
    { ...args.course, authorId: user.username },
    user,
    OPERATION.INSERT
  );

  const dynamoDBHelper = new DynamoDBHelper();
  await dynamoDBHelper.batchWrite([course.getData()]);
  return course.getData();
}
