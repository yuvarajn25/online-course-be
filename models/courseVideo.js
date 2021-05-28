import BaseModel from "./base-model";

export default class CourseVideo extends BaseModel {
  setIndex() {
    this.data.gsi1 = this.data.courseId;
  }
}
