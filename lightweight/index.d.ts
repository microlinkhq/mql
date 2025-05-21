export type ColorScheme = 'dark' | 'light'

type WaitUntilEvent =
  | 'load'
  | 'domcontentloaded'
  | 'networkidle0'
  | 'networkidle2'

type PixelUnit = string | number

type ScreenshotOverlay = {
  background?: string
  browser?: 'dark' | 'light'
}

type PdfMargin = {
  bottom?: string | number
  left?: string | number
  right?: string | number
  top?: string | number
}

type PdfOptions = {
  format?: string
  height?: PixelUnit
  landscape?: string
  margin?: string | PdfMargin
  pageRanges?: string
  scale?: number
  width?: PixelUnit
}

type ScreenshotOptions = {
  codeScheme?: string
  element?: string
  fullPage?: boolean
  omitBackground?: boolean
  optimizeForSpeed?: boolean
  overlay?: ScreenshotOverlay
  type?: 'jpeg' | 'png'
}

type MqlClientOptions = {
  apiKey?: string
  cache?: Map<string, any>
  endpoint?: string
  retry?: number
}

type MqlQuery = {
  [field: string]: MqlQueryOptions
}

type MqlQueryOptions = {
  attr?: string | string[] | MqlQuery
  evaluate?: string
  selector?: string | string[]
  selectorAll?: string | string[]
  type?:
    | 'audio'
    | 'author'
    | 'auto'
    | 'boolean'
    | 'date'
    | 'description'
    | 'email'
    | 'image'
    | 'ip'
    | 'lang'
    | 'logo'
    | 'number'
    | 'object'
    | 'publisher'
    | 'regexp'
    | 'string'
    | 'title'
    | 'url'
    | 'video'
}

export type MicrolinkApiOptions = {
  adblock?: boolean
  animations?: boolean
  audio?: boolean
  click?: string | string[]
  colorScheme?: ColorScheme
  data?: MqlQuery
  device?: string
  embed?: string
  filename?: string
  filter?: string
  force?: boolean
  function?: string
  headers?: Record<string, string>
  iframe?: boolean | { maxWidth?: number; maxHeight?: number }
  insights?: boolean | { lighthouse?: boolean | object; technologies?: boolean }
  javascript?: boolean
  mediaType?: string
  meta?: boolean | { logo: { square: boolean } }
  modules?: string | string[]
  palette?: boolean
  pdf?: boolean | PdfOptions
  ping?: boolean | object
  prerender?: boolean | 'auto'
  proxy?: string | { countryCode?: string }
  retry?: number
  screenshot?: boolean | ScreenshotOptions
  scripts?: string | string[]
  scroll?: string
  staleTtl?: string | number
  stream?: string
  styles?: string | string[]
  timeout?: string | number
  ttl?: string | number
  video?: boolean
  viewport?: object
  waitForSelector?: string
  waitForTimeout?: string | number
  waitUntil?: WaitUntilEvent | WaitUntilEvent[]
}

type IframeInfo = {
  html: string
  scripts: Record<string, unknown>
}

type MediaInfo = {
  alternative_color?: string
  background_color?: string
  color?: string
  duration_pretty?: string
  duration?: number
  height?: number
  palette?: string[]
  size_pretty?: string
  size?: number
  type?: string
  url: string
  width?: number
}

export type MqlResponseData = {
  audio?: MediaInfo | null
  author?: string | null
  date?: string | null
  description?: string | null
  function?: MqlFunctionResult
  iframe?: IframeInfo | null
  image?: MediaInfo | null
  lang?: string | null
  logo?: MediaInfo | null
  publisher?: string | null
  screenshot?: MediaInfo | null
  title?: string | null
  url?: string
  video?: MediaInfo | null
}

type MqlFunctionResult = {
  isFulfilled: boolean
  isRejected: boolean
  value: any
}

type MqlStatus = 'success' | 'fail' | 'error'

export type MqlPayload = {
  status: MqlStatus
  data: MqlResponseData
  statusCode?: number
  redirects: { statusCode: number; url: string }[]
  headers: { [key: string]: string }
}

type HTTPResponse = {
  url: string
  statusCode: number
  headers: Headers
}

type HTTPResponseWithBody = HTTPResponse & { body: MqlPayload }

export type HTTPResponseRaw = HTTPResponse & { body: ArrayBuffer }

export type MqlResponse = MqlPayload & { response: HTTPResponseWithBody }

export type MqlOptions = MqlClientOptions & MicrolinkApiOptions

type MqlErrorGeneratedProps = {
  description: string
  name: string
}

export type MqlErrorProps = {
  code: string
  status: MqlStatus
  message: string
  data?: MqlResponseData
  headers?: { [key: string]: string }
  more?: string
  statusCode?: number
  url?: string
}

export type MqlError = MqlErrorProps & MqlErrorGeneratedProps

export declare class MicrolinkError extends Error {
  constructor(props: MqlErrorProps)
  readonly code: string
  readonly status: MqlStatus
  readonly message: string
  readonly description: string
  readonly name: string
  readonly data?: MqlResponseData
  readonly headers?: { [key: string]: string }
  readonly more?: string
  readonly statusCode?: number
  readonly url?: string
}

export const version: string

interface mql {
  (
    url: string,
    opts?: MqlOptions & { stream: string },
    gotOpts?: object
  ): Promise<HTTPResponseRaw>
  (url: string, opts?: MqlOptions, gotOpts?: object): Promise<MqlResponse>
  arrayBuffer: (
    url: string,
    opts?: MqlOptions,
    gotOpts?: object
  ) => Promise<HTTPResponseRaw>
  extend: (gotOpts?: object) => mql
  stream: (input: RequestInfo, init?: RequestInit) => ReadableStream
  MicrolinkError: new (props: object) => MqlErrorProps
  version: string
}

declare const mql: mql

export default mql
