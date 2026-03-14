import { BaseException } from "src/modules/shared/exceptions/base.exception";

export class ReorderConflictReferenceException extends BaseException<undefined> {
  constructor() {
    super("Only one of 'before_id' or 'after_id' can be provided.", undefined, "REORDER_CONFLICT_REFERENCE", "BAD_REQUEST");
  }
}
