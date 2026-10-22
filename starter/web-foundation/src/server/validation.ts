import {AppError} from "./errors";
export function requiredText(value:unknown,name:string,maxLength=500){
 if(typeof value!=="string")throw new AppError("INVALID_INPUT",`${name} không hợp lệ.`);
 const normalized=value.trim();
 if(!normalized||normalized.length>maxLength||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(normalized))throw new AppError("INVALID_INPUT",`${name} không hợp lệ.`);
 return normalized;
}
