import { DYNAMO_EVENTS, EMAIL_TYPES, ENTITY_TYPES } from "../../constants";
import DynamoDBHelper from "../../helper/dynamodb-helper";
import { sendEmail } from "../../helper/email-helper";

export async function sendSubscriptionEmail(record) {
  // Sending email only for insert events
  if (record.eventName !== DYNAMO_EVENTS.INSERT) return;

  const courseId = record.dynamodb.NewImage.courseId.S;
  const userId = record.dynamodb.NewImage.userId.S;

  console.log({ courseId, userId });

  const dynamoDBHelper = new DynamoDBHelper();

  const [course, user] = await Promise.all([
    dynamoDBHelper.getEntityById(ENTITY_TYPES.COURSE, courseId),
    dynamoDBHelper.getEntityById(ENTITY_TYPES.USER, userId),
  ]);
  console.log(course, user);
  if (!course || !user) return;

  const courseUser = await dynamoDBHelper.getEntityById(
    ENTITY_TYPES.USER,
    course.authorId
  );

  console.log(courseUser);

  if (!courseUser) return;

  return sendEmail(
    EMAIL_TYPES.SUBSCRIPTION,
    { user: user.name, course: course.name },
    {
      from: `"Online Course" <yuvarajn25@gmail.com>`, // Current used mail client not
      to: courseUser.email,
      subject: "New User Subscription",
    }
  );
}
