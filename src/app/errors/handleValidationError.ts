import type { PrismaClientValidationError } from "@prisma/client/runtime/client";
import type { TErrorSources, TGenericErrorResponse } from "./error.interface";

const handlePrismaValidationError = (
  err: PrismaClientValidationError,
): TGenericErrorResponse => {
  // Use regex to extract missing argument
  const argMatch = err.message.match(/Argument `(\w+)` is missing/);
  const missingArg = argMatch ? argMatch[1] : "Unknown";

  const errorSources: TErrorSources = [
    {
      path: missingArg,
      message: err.message,
    },
  ];

  return {
    statusCode: 400,
    message: `Validation error: Missing argument '${missingArg}'`,
    errorSources,
  };
};

export default handlePrismaValidationError;
