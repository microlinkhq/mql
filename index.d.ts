/// <reference types="node" />

declare module "@microlink/mql" {
  export type WaitUntilEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

  export type ScreenshotOptions = Partial<{
    background: string;
    browser: "light" | "dark";
    click: string | string[];
    deviceScaleFactor: number;
    disableAnimations: boolean;
    emulation: string;
    fullPage: boolean;
    hasTouch: boolean;
    height: number;
    hide: string | string[];
    isLandscape: boolean;
    isMobile: boolean;
    scrollTo: string;
    type: "jpeg" | "png";
    waitFor: number | string;
    waitUntil: WaitUntilEvent | WaitUntilEvent[];
    width: number;
  }>;

  export type MqlQueryResponseType =
    | "author"
    | "date"
    | "description"
    | "image"
    | "title"
    | "url"
    | "lang"
    | "publisher";

  export type MqlQueryOptions = Partial<{
    attr: string | string[];
    selector: string | string[];
    selectorAll: string | string[];
    type: MqlQueryResponseType;
  }>;

  export interface MqlQuery {
    [field: string]: MqlQueryOptions;
  }

  export type MicrolinkApiOptions = Partial<{
    animations: boolean;
    audio: boolean;
    click: string | string[];
    colorScheme: "dark" | "light";
    codeScheme: string;
    data: MqlQuery;
    device: string;
    embed: string;
    filter: string;
    force: boolean;
    headers: object;
    hide: string | string[];
    iframe: boolean | object;
    insights: boolean | object;
    javascript: boolean;
    mediatype: string;
    meta: boolean;
    modules: string | string[];
    palette: boolean;
    ping: boolean | object;
    prerender: boolean | "auto";
    proxy: string;
    remove: string | string[];
    retry: number;
    screenshot: boolean | ScreenshotOptions;
    scripts: string | string[];
    scroll: string;
    styles: string | string[];
    timeout: number;
    ttl: string | number;
    url: string;
    video: boolean;
    viewport: object;
    waitForSelector: string;
    waitForTimeout: number;
    waitUntil: string | string[];
  }>;

  export type MqlOptions = Partial<{
    apiKey: string;
    retry: number;
    cache: Map<string, any>;
    timeout: number;
  }>;

  export interface ImageInfo {
    width: number;
    height: number;
    type: string;
    url: string;
    size: number;
    size_pretty: string;
  }

  export interface PlayableMediaInfo extends ImageInfo {
    duration: number;
    duration_pretty: string;
  }

  export type MqlResponseData = Partial<{
    author: string;
    date: string;
    description: string;
    video: string;
    lang: string;
    publisher: string;
    title: string;
    url: string;
    image: ImageInfo;
    screenshot: ImageInfo;
    logo: ImageInfo;
    video: PlayableMediaInfo;
    audio: PlayableMediaInfo;
  }>;

  export type MqlStatus = "success" | "fail";

  export interface MqlResponse {
    status: MqlStatus;
    data: MqlResponseData;
    response: Response;
  }

  declare function mql(url: string, opts?: MqlOptions & MicrolinkApiOptions): Promise<MqlResponse>;

  declare namespace mql {
    export class MicrolinkError extends Error {}
  }

  export = mql;
}
