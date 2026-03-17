import { BaseException } from "src/modules/shared/exceptions/base.exception";

interface IReorderTargetNotFoundDetails {
  linkId: string;
  type: string;
}

export class ReorderTargetNotFoundException extends BaseException<IReorderTargetNotFoundDetails> {
  constructor(id: string, type: "before" | "after") {
    super(
      `Reorder target link with id '${id}' not found`,
      { linkId: id, type },
      "REORDER_TARGET_NOT_FOUND_EXCEPTION",
      "NOT_FOUND",
    );
  }
}
