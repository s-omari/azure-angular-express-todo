module.exports = class AccessDeniedError extends Error{
    constructor(message) {
        super(message);
    }
}