const SUCCESS_POST = "POST success";
const SUCCESS_GET = "GET success";
const ERR_CATCH = (err)=> `error catch : ${err.toString()}`;
const ERR_STATUS_FALSE = "response status false"; //status response === false
const ERR_STATUS_DEFAULT = "error in status value"; // status response !== false && status !== true

export default {
    SUCCESS_POST,
    SUCCESS_GET,
    ERR_CATCH,
    ERR_STATUS_FALSE,
    ERR_STATUS_DEFAULT
}