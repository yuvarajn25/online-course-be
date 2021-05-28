import moment from "moment";
import { v4 as uuidV4 } from "uuid";
import { OPERATION } from "../constants";

export default class BaseModel {
  constructor(data, user, operation) {
    this.user = user;
    this.data = data;
    this.operation = operation;

    if (this.operation === OPERATION.INSERT) {
      this.setEntityType();
      this.setId();
      this.setIndex();
      this.setAuditFieldsForInsert();
    } else {
      this.setAuditFieldsForUpdate();
    }
  }

  getData() {
    return this.data;
  }

  setEntityType() {
    this.data.entityType = this.data.entityType || this.constructor.name;
  }

  setId() {
    this.data.id = this.data.id || uuidV4();
  }
  setIndex() {
    this.data.gsi1 = this.data.gsi1 || this.data.parentId;
    this.data.gsi2 = this.data.gsi2 || null;
  }

  setAuditFieldsForInsert() {
    this.data.createdBy = this.user.claims.name;
    this.data.createdDate = moment().unix();
  }

  setAuditFieldsForUpdate() {
    this.data.lastUpdatedBy = this.user.claims.name;
    this.data.lastUpdatedDate = moment().unix();
  }
}
