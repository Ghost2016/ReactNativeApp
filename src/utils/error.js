
function APIError(name, message) {
  this.name = `API_Error(${name})`;
  this.message = message || 'Default Message';   
  this.stack = (new Error()).stack;
}
APIError.prototype = Object.create(Error.prototype);
APIError.prototype.constructor = APIError;

export default APIError