export enum StatusCode {
    // Informational Responses
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // Client Errors
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    CONFLICT = 409,

    // Server Errors
    INTERNAL_SERVER_ERROR = 500
}