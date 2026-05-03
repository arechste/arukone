declare const __APP_VERSION__: string;
declare const __BUILD_SHA__: string;

export const APP_VERSION: string = __APP_VERSION__;
export const BUILD_SHA: string = __BUILD_SHA__;
export const REPO_URL = 'https://github.com/arechste/arukone';
export const RELEASE_URL = `${REPO_URL}/releases/tag/v${APP_VERSION}`;
