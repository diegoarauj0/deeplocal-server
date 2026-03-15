import { BaseException } from "../../shared/exceptions/base.exception";

type IIdentifierMismatchDetails = {
  expectedIdentifier: string;
  receivedIdentifier: string;
};

export class IdentifierMismatchException extends BaseException<IIdentifierMismatchDetails> {
  constructor(expectedIdentifier: string, receivedIdentifier: string) {
    super(
      "The provided identifier does not match the resource identifier",
      {
        expectedIdentifier,
        receivedIdentifier,
      },
      "IDENTIFIER_MISMATCH",
      "FORBIDDEN",
    );
  }
}
