import BaseModel from "./base-model";

export default class Rating extends BaseModel {
  setIndex() {
    this.data.gsi1 = this.data.courseId;
  }
}
