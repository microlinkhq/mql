import { MqlError, MqlPayload, MqlOptions } from '../lightweight';

export { MicrolinkError, MqlError, MqlPayload } from '../lightweight'

import { Response, Options as GotOpts } from 'got/dist/source/core'

type HTTPResponse = Response<Buffer>

type HTTPResponseWithBody = HTTPResponse & { body: MqlPayload };

type HTTPResponseRaw = HTTPResponse & { body: Buffer };

type MqlResponse = MqlPayload & { response: HTTPResponseWithBody };

interface Mql {
  (url: string, opts?: MqlOptions & { stream: string }, gotOpts?: GotOpts): Promise<HTTPResponse>;
  (url: string, opts?: MqlOptions, gotOpts?: GotOpts): Promise<MqlResponse>;
  extend: (gotOpts?: GotOpts) => Mql;
  stream: (url: string, gotOpts?: GotOpts) => NodeJS.ReadableStream;
  buffer: (url: string, opts?: MqlOptions, gotOpts?: GotOpts) => Promise<HTTPResponseRaw>;
  MicrolinkError: new (props: object) => MqlError;
  version: string;
}

declare const mql: Mql;

export default mql;
