export type ColorScheme = | "dark" | "light";

export type WaitUntilEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

export type PixelUnit = string | number;

export type ScreenshotOverlay = {
  background?: string,
  browser?: 'dark' | 'light'
}

export type MqlOptions = {
  endpoint?: string;
  apiKey?: string;
  retry?: number;
  cache?: Map<string, any>;
}

export type PdfMargin = {
  top?: string | number;
   bottom?: string | number;
   left?: string | number;
   right?: string | number;
}

export interface MqlQuery {
  [field: string]: MqlQueryOptions;
}

export type MqlQueryOptions = {
  attr?: string | string[] | MqlQuery;
  evaluate?: string;
  selector?: string | string[];
  selectorAll?: string | string[];
  type?: "audio" | "author" | "auto" | "boolean" | "date" | "description" | "email" | "image" | "ip" | "lang" | "logo" | "number" | "object" | "publisher" | "regexp" | "string" | "title" | "url" | "video";
}

export type PdfOptions = {
  format?: string;
  height?: PixelUnit;
  landscape?: string;
  margin?: string | PdfMargin;
  pageRanges?: string;
  scale?: number;
  width?: PixelUnit;
}

export type ScreenshotOptions = {
  codeScheme?: string;
  omitBackground?: boolean;
  type?: "jpeg" | "png";
  element?: string;
  fullPage?: boolean;
  overlay?: ScreenshotOverlay
}

export type MicrolinkApiOptions = {
  adblock?: boolean;
  animations?: boolean;
  audio?: boolean;
  click?: string | string[];
  colorScheme?: ColorScheme;
  data?: MqlQuery;
  device?: string;
  embed?: string;
  filename?: string;
  filter?: string;
  force?: boolean;
  function?: string;
  headers?: Record<string, string>;
  iframe?: boolean | { maxWidth?: number, maxHeight?: number };
  insights?: boolean | { lighthouse?: boolean | object, technologies?: boolean };
  javascript?: boolean;
  mediaType?: string;
  meta?: boolean | { logo: { square: boolean } };
  modules?: string | string[];
  palette?: boolean;
  pdf?: boolean | PdfOptions;
  ping?: boolean | object;
  prerender?: boolean | "auto";
  proxy?: string | { countryCode?: string };
  retry?: number;
  screenshot?: boolean | ScreenshotOptions;
  scripts?: string | string[];
  scroll?: string;
  styles?: string | string[];
  staleTtl?: string | number;
  timeout?: number;
  ttl?: string | number;
  video?: boolean;
  viewport?: object;
  waitForSelector?: string;
  waitForTimeout?: number;
  waitUntil?: WaitUntilEvent | WaitUntilEvent[];
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
): Promise<object>;

export default mql;
