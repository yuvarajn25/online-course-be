import { OPERATION } from "../../constants";
import Course from "../../models/course";
import DynamoDBHelper from "../../helper/dynamodb-helper";
import CourseVideo from "../../models/courseVideo";
import CourseSubscription from "../../models/courseSubscription";
import Comment from "../../models/comment";

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

export async function addCourseVideo(service) {
  const { user, args } = service;
  console.log(`addCourse::`, JSON.stringify(service, 0, 2));
  const courseVideo = new CourseVideo(args.courseVideo, user, OPERATION.INSERT);

  const dynamoDBHelper = new DynamoDBHelper();
  await dynamoDBHelper.batchWrite([courseVideo.getData()]);
  return courseVideo.getData();
}

export async function subscribeCourse(service) {
  const { user, args } = service;
  console.log(`addCourse::`, JSON.stringify(service, 0, 2));
  const courseSubscription = new CourseSubscription(
    { courseId: args.courseId, userId: user.username },
    user,
    OPERATION.INSERT
  );

  const dynamoDBHelper = new DynamoDBHelper();
  await dynamoDBHelper.batchWrite([courseSubscription.getData()]);
  return courseSubscription.getData();
}

export async function addComment(service) {
  const { user, args } = service;
  console.log(`addCourse::`, JSON.stringify(service, 0, 2));
  const comment = new Comment(
    { ...args, userId: user.username },
    user,
    OPERATION.INSERT
  );

  const dynamoDBHelper = new DynamoDBHelper();
  await dynamoDBHelper.batchWrite([comment.getData()]);
  return comment.getData();
}
