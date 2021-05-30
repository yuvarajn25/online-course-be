import { ENTITY_TYPES, OPERATION } from "../../constants";
import Course from "../../models/course";
import DynamoDBHelper from "../../helper/dynamodb-helper";
import CourseVideo from "../../models/courseVideo";
import CourseSubscription from "../../models/courseSubscription";
import Comment from "../../models/comment";
import S3Helper from "../../helper/s3-helper";

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

export async function deleteCourse(service) {
  const {
    args: { id },
  } = service;

  const dynamoDBHelper = new DynamoDBHelper();

  const [courseVideos, comments, courseSubscription] = await Promise.all([
    dynamoDBHelper.getEntityByGsi1(ENTITY_TYPES.COURSE_VIDEO, id),
    dynamoDBHelper.getEntityByGsi1(ENTITY_TYPES.COMMENT, id),
    dynamoDBHelper.getEntityByGsi2(ENTITY_TYPES.COURSE_SUBSCRIPTION, id),
  ]);

  const itemsToDelete = [{ entityType: ENTITY_TYPES.COURSE, id }];
  [...courseVideos, ...comments, ...courseSubscription].map(
    ({ id, entityType }) => itemsToDelete.push({ id, entityType })
  );
  await dynamoDBHelper.batchDelete(itemsToDelete);
  const s3Helper = new S3Helper();
  await s3Helper.deleteObjects(courseVideos.map((video) => video.videoUrl));

  return { entityType: ENTITY_TYPES.COURSE, id };
}

export async function deleteCourseVideo(service) {
  const {
    args: { id },
  } = service;

  const dynamoDBHelper = new DynamoDBHelper();
  const courseVideo = await dynamoDBHelper.getEntityById(
    ENTITY_TYPES.COURSE_VIDEO,
    id
  );
  const itemsToDelete = [{ entityType: ENTITY_TYPES.COURSE_VIDEO, id }];
  await dynamoDBHelper.batchDelete(itemsToDelete);

  const s3Helper = new S3Helper();
  await s3Helper.deleteObjects([courseVideo.videoUrl]);

  return { entityType: ENTITY_TYPES.COURSE_VIDEO, id };
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
