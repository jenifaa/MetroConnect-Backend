import httpStatus from "http-status-codes";

export const handleCastError = (err) => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: `Invalid ${err.path}: ${err.value}`,
  };
};
