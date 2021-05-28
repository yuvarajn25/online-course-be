import BaseModel from "./base-model";

export default class Course extends BaseModel {
  setIndex() {
    this.data.gsi1 = this.data.authorId;
  }
}
