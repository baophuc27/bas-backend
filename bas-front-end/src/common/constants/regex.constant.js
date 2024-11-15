export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const tabletRegExp =
  /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;

export const usernameRegExp = /^[^\s]{3,}$/;
export const passwordRegExp = /^.{3,}$/;

export const coordinateRegExp =
  /^\s*-?([1-8]?[0-9](\.[0-9]*[0-9]|[0-9]*[1-9])?|90(\.0*[0-9]|[0-9]*[1-9])?),\s*-?((1?[0-7]?|[0-9]?)[0-9](\.[0-9]*[0-9]|[0-9]*[1-9])?|180(\.0*[0-9]|[0-9]*[1-9])?)\s*$/;

export const urlRegExp =
  /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(?:\/[\w\-\/?=&]*)?|http?:\/\/(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}(?:\/[\w\-\/?=&]*)?$/;
