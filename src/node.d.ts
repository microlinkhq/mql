import { MqlPayload, MqlOptions } from '../lightweight'

export { MqlError, MqlPayload } from '../lightweight'

export type MqlResponse = MqlPayload & {
  response: {
    url: string;
    isFromCache?: boolean;
    statusCode: number;
    headers: { [key: string]: string };
    body: MqlPayload
  };
}

declare function mql(
  url: string,
  opts?: MqlOptions,
  gotOpts?: object
): Promise<MqlResponse>;

declare namespace mql {
  function stream(
    url: string,
    opts?: MqlOptions,
    gotOpts?: object
  ): NodeJS.ReadableStream;
}

export default mql;
