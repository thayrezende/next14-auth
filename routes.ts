/** 
 * An array of routes that are accessible to the public
 * These routues dont require authentication
 * @type {string[]}
*/
export const publicRoutes = [
    "/",
    "/auth/new-verification"
];


/** 
 * An array of routes that are use for authentication
 * These routes will redirecy logged in uuser to /settings
 * @type {string[]}
*/
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];


/** 
 * The prefix for API authentifcation routes
 * Routes that start with this prefix used for api auuthentication purposes
 * @type {string}
*/
export const apiAuthPrefix = "/api/auth";


/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"