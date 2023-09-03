type ColorScheme = | "dark" | "light";

type WaitUntilEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

type PixelUnit = string | number;

type ScreenshotOverlay = {
  background?: string,
  browser?: 'dark' | 'light'
}

type PdfMargin = {
  top?: string | number;
   bottom?: string | number;
   left?: string | number;
   right?: string | number;
}

type PdfOptions = {
  format?: string;
  height?: PixelUnit;
  landscape?: string;
  margin?: string | PdfMargin;
  pageRanges?: string;
  scale?: number;
  width?: PixelUnit;
}

type ScreenshotOptions = {
  codeScheme?: string;
  omitBackground?: boolean;
  type?: "jpeg" | "png";
  element?: string;
  fullPage?: boolean;
  overlay?: ScreenshotOverlay
}

export type MqlOptions = {
  endpoint?: string;
  apiKey?: string;
  retry?: number;
  cache?: Map<string, any>;
}

type MqlQuery = {
  [field: string]: MqlQueryOptions;
}

type MqlQueryOptions = {
  attr?: string | string[] | MqlQuery;
  evaluate?: string;
  selector?: string | string[];
  selectorAll?: string | string[];
  type?: "audio" | "author" | "auto" | "boolean" | "date" | "description" | "email" | "image" | "ip" | "lang" | "logo" | "number" | "object" | "publisher" | "regexp" | "string" | "title" | "url" | "video";
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

type IframeInfo = {
  html: string;
  scripts: Record<string, unknown>;
}

type MediaInfo = {
  url: string;
  type?: string;
  palette?: string[];
  background_color?: string;
  color?: string;
  alternative_color?: string;
  width?: number;
  height?: number;
  duration?: number;
  duration_pretty?: string;
}

type MqlResponseData = {
  // A human-readable representation of the author's name.
  author?: string | null;
  // An ISO 8601 representation of the date the article was published.
  date?: string | null;
  // The publisher's chosen description of the article.
  description?: string | null;
  // An ISO 639-1 representation of the url content language.
  lang?: string | null;
  // An image URL that best represents the publisher brand.
  logo?: MediaInfo | null;
  // A human-readable representation of the publisher's name.
  publisher?: string | null;
  // The publisher's chosen title of the article.
  title?: string | null;
  // The URL of the article.
  url?: string;
  image?: MediaInfo | null;
  screenshot?: MediaInfo | null;
  video?: MediaInfo | null;
  audio?: MediaInfo | null;
  iframe?: IframeInfo | null;
  function?: MqlFunctionResult;
}

type MqlFunctionResult = {
  isFulfilled: boolean;
  isRejected: boolean;
  value: any;
};

type MqlStatus = "success" | "fail" | "error";

export type MqlPayload = {
  status: MqlStatus;
  data: MqlResponseData;
  statusCode: number;
  headers: { [key: string]: string };
  more?: string,
  code?: string,
  url?: string
}

export type MqlResponse = MqlPayload & {
  response: {
    url: string;
    statusCode: number;
    headers: Headers;
    body: MqlPayload
  };
}

declare function mql(
  url: string,
  opts?: MqlOptions & MicrolinkApiOptions,
  gotOpts?: object
): Promise<MqlResponse>;

export default mql;
