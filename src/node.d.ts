import { MqlPayload, MqlOptions } from '../lightweight';
export { MicrolinkError, MqlError, MqlPayload } from '../lightweight'

import { Response, Options as GotOpts } from 'got/dist/source/core'

type HTTPResponseWithBody = Response & { body: MqlPayload };

type HTTPResponseRaw = Response & { body: Buffer };

export type MqlResponse = MqlPayload & { response: HTTPResponseWithBody };

interface Mql {
  (url: string, opts?: MqlOptions & { stream: string }, gotOpts?: GotOpts): Promise<HTTPResponseRaw>;
  (url: string, opts?: MqlOptions, gotOpts?: GotOpts): Promise<MqlResponse>;
  extend: (gotOpts?: GotOpts) => Mql;
  stream: (url: string, gotOpts?: GotOpts) => NodeJS.ReadableStream;
  buffer: (url: string, opts?: MqlOptions, gotOpts?: GotOpts) => Promise<HTTPResponseRaw>;
  version: string;
}

declare const mql: Mql;

export default mql;
