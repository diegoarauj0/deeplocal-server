import { ValidationError } from "class-validator";
import { BaseException } from "./base.exception";

interface IValidationErrorReason {
  code: string;
  message: string;
}

interface IValidationErrorDetails {
  name: string;
  value: string | number | boolean | Date;
  reasons: IValidationErrorReason[];
}

export class ValidationErrorException extends BaseException<IValidationErrorDetails[]> {
  constructor(errors: ValidationError[]) {
    const details: IValidationErrorDetails[] = [];

    for (const error of errors) {
      const reasons: IValidationErrorReason[] = [];

      for (const constraint in error.constraints) {
        reasons.push({ code: constraint, message: error.constraints[constraint] });
      }

      details.push({ name: error.property, value: error.value as string, reasons });
    }

    super("Invalid field.", details, "VALIDATION_ERROR_EXCEPTION", "BAD_REQUEST");
  }
}
