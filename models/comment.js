import BaseModel from "./base-model";

export default class Comment extends BaseModel {
  setIndex() {
    this.data.gsi1 = this.data.parentId;
  }
}
