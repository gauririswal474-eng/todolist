// Error with an HTTP status code, so the error handler knows what to send back.
export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}
