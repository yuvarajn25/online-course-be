import BaseModel from "./base-model";

export default class CourseSubscription extends BaseModel {
  setIndex() {
    this.data.gsi1 = this.data.userId;
    this.data.gsi2 = this.data.courseId;
  }
}
