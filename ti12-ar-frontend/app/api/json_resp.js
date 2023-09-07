export default function JsonResp(code, message, data) {
    this.code = code
    this.message = message
    this.data = data
}