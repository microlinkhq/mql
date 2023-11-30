import { MqlPayload, MqlOptions } from '../lightweight';

export { MqlError, MqlPayload } from '../lightweight'

type HTTPResponse = {
  url: string;
  isFromCache?: boolean;
  statusCode: number;
  headers: { [key: string]: string };
};

type HTTPResponseWithBody = HTTPResponse & { body: MqlPayload };

type HTTPResponseRaw = HTTPResponse & { body: Buffer };

type MqlResponse = MqlPayload & { response: HTTPResponseWithBody };

interface Mql {
  (url: string, opts?: MqlOptions, gotOpts?: object): Promise<MqlResponse>;
  extend: (gotOpts?: object) => Mql;
  stream: (url: string, gotOpts?: object) => NodeJS.ReadableStream;
  buffer: (url: string, opts?: MqlOptions, gotOpts?: object) => Promise<HTTPResponseRaw>;
}

declare const mql: Mql;

export default mql;
