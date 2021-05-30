import AWS from "aws-sdk";

export default class S3Helper {
  constructor() {
    this.s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  }

  deleteObjects(keys) {
    if (!keys.length) return;
    const params = {
      Bucket: "online-course-content",
      Delete: {
        Objects: keys.map((key) => ({ Key: `public/${key}` })),
        Quiet: false,
      },
    };
    return this.s3.deleteObjects(params).promise();
  }
}
