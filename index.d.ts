/// <reference types="node" />

declare module "@microlink/mql" {
  export type WaitUntilEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

  export type AssetOptions = Partial<{
    click: string | string[];
    disableAnimations: boolean;
    filename: string;
    hide: string | string[];
    scrollTo: string;
    viewport: object;
    waitFor: number | string;
    waitForSelector: string;
    waitForTimeout: number;
    waitUntil: WaitUntilEvent | WaitUntilEvent[];
  }>;

  export type ScreenshotOptions = AssetOptions & Partial<{
    background: string;
    browser: "light" | "dark";
    element: string;
    fullPage: boolean;
    omitBackground: object;
    overlay: object;
    type: "jpeg" | "png";
  }>;

  export type PdfOptions = AssetOptions & Partial<{
    format: string;
    height: number;
    hide: string | string[];
    landscape: string;
    margin: string | object;
    pageRanges: string;
    scale: number;
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
    evaluate: string | (() => string)
    selector: string | string[];
    selectorAll: string | string[];
    type: MqlQueryResponseType;
  }>;

  export interface MqlQuery {
    [field: string]: MqlQueryOptions;
  }

  export type MicrolinkApiOptions = Partial<{
    adblock: boolean;
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
    insights: boolean | Partial<{ lighthouse: boolean | object, technologies: boolean }>;
    javascript: boolean;
    mediaType: string;
    meta: boolean;
    modules: string | string[];
    palette: boolean;
    pdf: boolean | PdfOptions;
    ping: boolean | object;
    prerender: boolean | "auto";
    proxy: string;
    remove: string | string[];
    retry: number;
    screenshot: boolean | ScreenshotOptions;
    scripts: string | string[];
    scroll: string;
    staleTtl: string | number;
    styles: string | string[];
    timeout: number;
    ttl: string | number;
    url: string;
    video: boolean;
  }>;

  export type MqlOptions = Partial<{
    endpoint: string;
    apiKey: string;
    retry: number;
    cache: Map<string, any>;
    timeout: number;
  } & AssetOptions>;

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
    author: string | null;
    // An ISO 8601 representation of the date the article was published.
    date: string | null;
    // The publisher's chosen description of the article.
    description: string | null;
    // An ISO 639-1 representation of the url content language.
    lang: string | null;
    // An image URL that best represents the publisher brand.
    logo: ImageInfo | null;
    // A human-readable representation of the publisher's name.
    publisher: string | null;
    // The publisher's chosen title of the article.
    title: string | null;
    // The URL of the article.
    url: string;
    image: ImageInfo | null;
    screenshot: ImageInfo | null;
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
