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
    | "audio"
    | "author"
    | "auto"
    | "boolean"
    | "date"
    | "description"
    | "email"
    | "image"
    | "ip"
    | "lang"
    | "lang"
    | "logo"
    | "number"
    | "object"
    | "publisher"
    | "publisher"
    | "regexp"
    | "string"
    | "title"
    | "url"
    | "video";

  export type MqlQueryOptions = Partial<{
    attr: string | string[];
    selector: string | string[];
    evaluate: string | function;
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
    codeScheme: string;
    colorScheme: "dark" | "light";
    data: MqlQuery;
    device: string;
    embed: string;
    filter: string;
    force: boolean;
    function: string;
    headers: Record<string, unknown>;
    iframe: boolean | Record<"maxwidth" | "maxheight", number>;
    insights: boolean | object;
    javascript: boolean;
    mediatype: string;
    meta: boolean;
    modules: string | string[];
    palette: boolean;
    ping: boolean | Partial<{ audio: boolean }>;
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
    endpoint: string;
    apiKey: string;
    retry: number;
    cache: Map<string, any>;
    timeout: number;
  }>;

  export interface BaseMediaInfo {
    url: string;
    // file type extension.
    type: string;
    // file size in bytes.
    size: number;
    // file size in a human readable format.
    size_pretty: string;
  }

  export interface PlayableMediaInfo {
    // source duration in seconds.
    duration: number;
    // source duration in a human readable format.
    duration_pretty: string;
  }

  export interface VisualMediaInfo {
    // file width in pixels.
    width: number;
    // file height in pixels.
    height: number;
  }

  export interface AudioInfo extends BaseMediaInfo, PlayableMediaInfo {
    // TODO make this a complete type
    type: "mp3" | string;
  }

  export interface ImageInfo extends BaseMediaInfo, VisualMediaInfo {
    // TODO make this a complete type
    type: "png" | "jpg" | string;
    palette: string[];
    background_color: string;
    color: string;
    alternative_color: string;
  }

  export interface VideoInfo extends BaseMediaInfo, PlayableMediaInfo, VisualMediaInfo {
    // TODO make this a complete type
    type: "mp4" | string;
  }

  export interface IframeInfo {
    html: string;
    scripts: Record<string, unknown>;
  }

  export type MqlFunctionResult = {
    isFulfilled: boolean;
    isRejected: boolean;
    value: any;
  };

  export type MqlResponseData = Partial<{
    // A human-readable representation of the author's name.
    author: string;
    // An ISO 8601 representation of the date the article was published.
    date: string;
    // The publisher's chosen description of the article.
    description: string;
    // An ISO 639-1 representation of the url content language.
    lang: string;
    // An image URL that best represents the publisher brand.
    logo: ImageInfo;
    // A human-readable representation of the publisher's name.
    publisher: string;
    // The publisher's chosen title of the article.
    title: string;
    // The URL of the article.

    url: string;
    image: ImageInfo | null;
    video: VideoInfo | null;
    audio: AudioInfo | null;
    iframe: IframeInfo | null;
    function: MqlFunctionResult;
  }>;

  export type MqlStatus = "success" | "fail";

  export interface MqlResponse {
    status: MqlStatus;
    data: MqlResponseData;
    // TODO: The response object depends on the context
    // - Under Node.js context
    //   import { ServerResponse} from 'http';
    // - Under browser, It will be global `Response`
    response: {
      headers: { [key: string]: string };
      body?: {
        statusCode?: number;
      };
    };
  }

  declare function mql(
    url: string,
    opts?: MqlOptions & MicrolinkApiOptions,
    // TODO: gotOpts could be different depends the environment where the library is being used
    // - Under Node.js context, types are from `got`
    //   https://github.com/microlinkhq/mql/blob/fbb55f4758495fa42d35822867763f95ac5ae960/src/node.js#L5
    //   https://github.com/DefinitelyTyped/DefinitelyTyped/blob/90a4ec8f0a9c76f33fdeeef0118f26c5d3df5cfa/types/got/index.d.ts#L212
    //
    // - Under brower context, types are from  `ky`
    //   https://github.com/microlinkhq/mql/blob/fbb55f4758495fa42d35822867763f95ac5ae960/src/browser.js#L9
    //   https://github.com/sindresorhus/ky/blob/main/source/types/options.ts#L30
    gotOpts?: object
  ): Promise<MqlResponse>;

  declare namespace mql {
    export class MicrolinkError extends Error {}
  }

  export = mql;
}
