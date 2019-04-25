(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url')) :
	typeof define === 'function' && define.amd ? define(['url'], factory) :
	(global = global || self, global.mql = factory(global.url));
}(this, function (url) { 'use strict';

	url = url && url.hasOwnProperty('default') ? url['default'] : url;

	var _rollupPluginShim1 = str => str;

	var _rollupPluginShim1$1 = /*#__PURE__*/Object.freeze({
		default: _rollupPluginShim1
	});

	const mimicFn = (to, from) => {
		for (const prop of Reflect.ownKeys(from)) {
			Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
		}

		return to;
	};

	var mimicFn_1 = mimicFn;
	var default_1 = mimicFn;
	mimicFn_1.default = default_1;

	var helpers = {
	  isFunction: obj => typeof obj === 'function',
	  isString: obj => typeof obj === 'string',
	  composeErrorMessage: (code, description) => `${code}, ${description}`,
	  inherits: (ctor, superCtor) => {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  }
	};

	const {isFunction, composeErrorMessage} = helpers;

	function interfaceObject (error, ...props) {
	  Object.assign(error, ...props);

	  error.description = isFunction(error.message) ? error.message(error) : error.message;

	  error.message = error.code
	   ? composeErrorMessage(error.code, error.description)
	   : error.description;
	}

	var addErrorProps = interfaceObject;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var cleanStack = getCjsExportFromNamespace(_rollupPluginShim1$1);

	const {isString} = helpers;

	function createExtendError (ErrorClass, classProps) {
	  function ExtendError (props) {
	    const error = new ErrorClass();
	    const errorProps = isString(props) ? {message: props} : props;
	    addErrorProps(error, classProps, errorProps);

	    error.stack = cleanStack(error.stack);
	    return error
	  }

	  ExtendError.prototype = ErrorClass.prototype;
	  mimicFn_1(ExtendError, ErrorClass);

	  return ExtendError
	}

	var createExtendError_1 = createExtendError;

	const {inherits} = helpers;


	const REGEX_CLASS_NAME = /[^0-9a-zA-Z_$]/;

	function createError (className) {
	  if (typeof className !== 'string') {
	    throw new TypeError('Expected className to be a string')
	  }

	  if (REGEX_CLASS_NAME.test(className)) {
	    throw new Error('className contains invalid characters')
	  }

	  function ErrorClass () {
	    Object.defineProperty(this, 'name', {
	      configurable: true,
	      value: className,
	      writable: true
	    });

	    Error.captureStackTrace(this, this.constructor);
	  }

	  inherits(ErrorClass, Error);
	  mimicFn_1(ErrorClass, Error);
	  return ErrorClass
	}

	var createError_1 = createError;

	const createErrorClass = ErrorClass => (className, props) => {
	  const errorClass = createError_1(className || ErrorClass.name);
	  return createExtendError_1(errorClass, props)
	};

	var lib = createErrorClass(Error);
	var type = createErrorClass(TypeError);
	var range = createErrorClass(RangeError);
	var eval_1 = createErrorClass(EvalError);
	var syntax = createErrorClass(SyntaxError);
	var reference = createErrorClass(ReferenceError);
	var uri = createErrorClass(URIError);
	lib.type = type;
	lib.range = range;
	lib.eval = eval_1;
	lib.syntax = syntax;
	lib.reference = reference;
	lib.uri = uri;

	function encode(obj, pfx) {
		var k, i, tmp, str='';

		for (k in obj) {
			if ((tmp = obj[k]) !== void 0) {
				if (Array.isArray(tmp)) {
					for (i=0; i < tmp.length; i++) {
						str && (str += '&');
						str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp[i]);
					}
				} else {
					str && (str += '&');
					str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp);
				}
			}
		}

		return (pfx || '') + str;
	}

	function toValue(mix) {
		if (!mix) return '';
		var str = decodeURIComponent(mix);
		if (str === 'false') return false;
		if (str === 'true') return true;
		return (+str * 0 === 0) ? (+str) : str;
	}

	function decode(str) {
		var tmp, k, out={}, arr=str.split('&');

		while (tmp = arr.shift()) {
			tmp = tmp.split('=');
			k = tmp.shift();
			if (out[k] !== void 0) {
				out[k] = [].concat(out[k], toValue(tmp.shift()));
			} else {
				out[k] = toValue(tmp.shift());
			}
		}

		return out;
	}

	var qss_m = /*#__PURE__*/Object.freeze({
		encode: encode,
		decode: decode
	});

	const URL$1 = commonjsGlobal.window ? window.URL : url.URL;

	const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

	var isUrlHttp = url => {
	  try {
	    return new URL$1(url) && REGEX_HTTP_PROTOCOL.test(url)
	  } catch (err) {
	    return false
	  }
	};

	var umd = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory(exports);
	}(commonjsGlobal, function (exports) {
		/*! MIT License © Sindre Sorhus */

		const getGlobal = property => {
			/* istanbul ignore next */
			if (typeof self !== 'undefined' && self && property in self) {
				return self[property];
			}

			/* istanbul ignore next */
			if (typeof window !== 'undefined' && window && property in window) {
				return window[property];
			}

			if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal && property in commonjsGlobal) {
				return commonjsGlobal[property];
			}

			/* istanbul ignore next */
			if (typeof globalThis !== 'undefined' && globalThis) {
				return globalThis[property];
			}
		};

		const document = getGlobal('document');
		const Headers = getGlobal('Headers');
		const Response = getGlobal('Response');
		const fetch = getGlobal('fetch');
		const AbortController = getGlobal('AbortController');

		const isObject = value => value !== null && typeof value === 'object';
		const supportsAbortController = typeof getGlobal('AbortController') === 'function';

		const deepMerge = (...sources) => {
			let returnValue = {};

			for (const source of sources) {
				if (Array.isArray(source)) {
					if (!(Array.isArray(returnValue))) {
						returnValue = [];
					}

					returnValue = [...returnValue, ...source];
				} else if (isObject(source)) {
					for (let [key, value] of Object.entries(source)) {
						if (isObject(value) && Reflect.has(returnValue, key)) {
							value = deepMerge(returnValue[key], value);
						}

						returnValue = {...returnValue, [key]: value};
					}
				}
			}

			return returnValue;
		};

		const requestMethods = [
			'get',
			'post',
			'put',
			'patch',
			'head',
			'delete'
		];

		const responseTypes = {
			json: 'application/json',
			text: 'text/*',
			formData: 'multipart/form-data',
			arrayBuffer: '*/*',
			blob: '*/*'
		};

		const retryMethods = new Set([
			'get',
			'put',
			'head',
			'delete',
			'options',
			'trace'
		]);

		const retryStatusCodes = new Set([
			408,
			413,
			429,
			500,
			502,
			503,
			504
		]);

		const retryAfterStatusCodes = new Set([
			413,
			429,
			503
		]);

		class HTTPError extends Error {
			constructor(response) {
				super(response.statusText);
				this.name = 'HTTPError';
				this.response = response;
			}
		}

		class TimeoutError extends Error {
			constructor() {
				super('Request timed out');
				this.name = 'TimeoutError';
			}
		}

		const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

		// `Promise.race()` workaround (#91)
		const timeout = (promise, ms, abortController) => new Promise((resolve, reject) => {
			/* eslint-disable promise/prefer-await-to-then */
			promise.then(resolve).catch(reject);
			delay(ms).then(() => {
				if (supportsAbortController) {
					abortController.abort();
				}

				reject(new TimeoutError());
			});
			/* eslint-enable promise/prefer-await-to-then */
		});

		const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

		class Ky {
			constructor(input, {
				timeout = 10000,
				hooks,
				throwHttpErrors = true,
				searchParams,
				json,
				...otherOptions
			}) {
				this._retryCount = 0;

				this._options = {
					method: 'get',
					credentials: 'same-origin', // TODO: This can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
					retry: 2,
					...otherOptions
				};

				if (supportsAbortController) {
					this.abortController = new AbortController();
					if (this._options.signal) {
						this._options.signal.addEventListener('abort', () => {
							this.abortController.abort();
						});
					}

					this._options.signal = this.abortController.signal;
				}

				this._options.method = normalizeRequestMethod(this._options.method);
				this._options.prefixUrl = String(this._options.prefixUrl || '');
				this._input = String(input || '');

				if (this._options.prefixUrl && this._input.startsWith('/')) {
					throw new Error('`input` must not begin with a slash when using `prefixUrl`');
				}

				if (this._options.prefixUrl && !this._options.prefixUrl.endsWith('/')) {
					this._options.prefixUrl += '/';
				}

				this._input = this._options.prefixUrl + this._input;

				if (searchParams) {
					const url = new URL(this._input, document && document.baseURI);
					if (typeof searchParams === 'string' || (URLSearchParams && searchParams instanceof URLSearchParams)) {
						url.search = searchParams;
					} else if (Object.values(searchParams).every(param => typeof param === 'number' || typeof param === 'string')) {
						url.search = new URLSearchParams(searchParams).toString();
					} else {
						throw new Error('The `searchParams` option must be either a string, `URLSearchParams` instance or an object with string and number values');
					}

					this._input = url.toString();
				}

				this._timeout = timeout;
				this._hooks = deepMerge({
					beforeRequest: [],
					afterResponse: []
				}, hooks);
				this._throwHttpErrors = throwHttpErrors;

				const headers = new Headers(this._options.headers || {});

				if (json) {
					if (this._options.body) {
						throw new Error('The `json` option cannot be used with the `body` option');
					}

					headers.set('content-type', 'application/json');
					this._options.body = JSON.stringify(json);
				}

				this._options.headers = headers;

				const fn = async () => {
					await delay(1);
					let response = await this._fetch();

					for (const hook of this._hooks.afterResponse) {
						// eslint-disable-next-line no-await-in-loop
						const modifiedResponse = await hook(response.clone());

						if (modifiedResponse instanceof Response) {
							response = modifiedResponse;
						}
					}

					if (!response.ok && this._throwHttpErrors) {
						throw new HTTPError(response);
					}

					return response;
				};

				const isRetriableMethod = retryMethods.has(this._options.method.toLowerCase());
				const result = isRetriableMethod ? this._retry(fn) : fn();

				for (const [type, mimeType] of Object.entries(responseTypes)) {
					result[type] = async () => {
						headers.set('accept', mimeType);
						return (await result).clone()[type]();
					};
				}

				return result;
			}

			_calculateRetryDelay(error) {
				this._retryCount++;

				if (this._retryCount < this._options.retry && !(error instanceof TimeoutError)) {
					if (error instanceof HTTPError) {
						if (!retryStatusCodes.has(error.response.status)) {
							return 0;
						}

						const retryAfter = error.response.headers.get('Retry-After');
						if (retryAfter && retryAfterStatusCodes.has(error.response.status)) {
							let after = Number(retryAfter);
							if (Number.isNaN(after)) {
								after = Date.parse(retryAfter) - Date.now();
							} else {
								after *= 1000;
							}

							return after;
						}

						if (error.response.status === 413) {
							return 0;
						}
					}

					const BACKOFF_FACTOR = 0.3;
					return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
				}

				return 0;
			}

			async _retry(fn) {
				try {
					return await fn();
				} catch (error) {
					const ms = this._calculateRetryDelay(error);
					if (ms !== 0 && this._retryCount > 0) {
						await delay(ms);
						return this._retry(fn);
					}

					if (this._throwHttpErrors) {
						throw error;
					}
				}
			}

			async _fetch() {
				for (const hook of this._hooks.beforeRequest) {
					// eslint-disable-next-line no-await-in-loop
					await hook(this._options);
				}

				return timeout(fetch(this._input, this._options), this._timeout, this.abortController);
			}
		}

		const createInstance = (defaults = {}) => {
			if (!isObject(defaults) || Array.isArray(defaults)) {
				throw new TypeError('The `defaultOptions` argument must be an object');
			}

			const ky = (input, options) => new Ky(input, deepMerge({}, defaults, options));

			for (const method of requestMethods) {
				ky[method] = (input, options) => new Ky(input, deepMerge({}, defaults, options, {method}));
			}

			ky.extend = defaults => createInstance(defaults);

			return ky;
		};

		var index = createInstance();

		exports.HTTPError = HTTPError;
		exports.TimeoutError = TimeoutError;
		exports.default = index;

		Object.defineProperty(exports, '__esModule', { value: true });

	}));
	});

	unwrapExports(umd);

	var kyUmd = umd.default;

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	var isBuffer = function isBuffer (obj) {
	  return obj != null && obj.constructor != null &&
	    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	};

	var flat = flatten;
	flatten.flatten = flatten;
	flatten.unflatten = unflatten;

	function flatten (target, opts) {
	  opts = opts || {};

	  var delimiter = opts.delimiter || '.';
	  var maxDepth = opts.maxDepth;
	  var output = {};

	  function step (object, prev, currentDepth) {
	    currentDepth = currentDepth || 1;
	    Object.keys(object).forEach(function (key) {
	      var value = object[key];
	      var isarray = opts.safe && Array.isArray(value);
	      var type = Object.prototype.toString.call(value);
	      var isbuffer = isBuffer(value);
	      var isobject = (
	        type === '[object Object]' ||
	        type === '[object Array]'
	      );

	      var newKey = prev
	        ? prev + delimiter + key
	        : key;

	      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
	        (!opts.maxDepth || currentDepth < maxDepth)) {
	        return step(value, newKey, currentDepth + 1)
	      }

	      output[newKey] = value;
	    });
	  }

	  step(target);

	  return output
	}

	function unflatten (target, opts) {
	  opts = opts || {};

	  var delimiter = opts.delimiter || '.';
	  var overwrite = opts.overwrite || false;
	  var result = {};

	  var isbuffer = isBuffer(target);
	  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
	    return target
	  }

	  // safely ensure that the key is
	  // an integer.
	  function getkey (key) {
	    var parsedKey = Number(key);

	    return (
	      isNaN(parsedKey) ||
	      key.indexOf('.') !== -1 ||
	      opts.object
	    ) ? key
	      : parsedKey
	  }

	  var sortedKeys = Object.keys(target).sort(function (keyA, keyB) {
	    return keyA.length - keyB.length
	  });

	  sortedKeys.forEach(function (key) {
	    var split = key.split(delimiter);
	    var key1 = getkey(split.shift());
	    var key2 = getkey(split[0]);
	    var recipient = result;

	    while (key2 !== undefined) {
	      var type = Object.prototype.toString.call(recipient[key1]);
	      var isobject = (
	        type === '[object Object]' ||
	        type === '[object Array]'
	      );

	      // do not write over falsey, non-undefined values if overwrite is false
	      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
	        return
	      }

	      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
	        recipient[key1] = (
	          typeof key2 === 'number' &&
	          !opts.object ? [] : {}
	        );
	      }

	      recipient = recipient[key1];
	      if (split.length > 0) {
	        key1 = getkey(split.shift());
	        key2 = getkey(split[0]);
	      }
	    }

	    // unflatten again for 'messy objects'
	    recipient[key1] = unflatten(target[key], opts);
	  });

	  return result
	}

	const ENDPOINT = {
	  FREE: 'https://api.microlink.io',
	  PRO: 'https://pro.microlink.io'
	};

	const ERRORS_CODE = {
	  INVALID_URL: 'ENOVALIDURL',
	  FAILED: 'EFAILED'
	};

	function factory ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) {
	  const assertUrl = (url = '') => {
	    if (!isUrlHttp(url)) {
	      throw new MicrolinkError({
	        code: ERRORS_CODE.INVALID_URL,
	        message: `The URL \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
	      })
	    }
	  };

	  const mapRules = (rules = {}) => {
	    const flatRules = flatten(rules);
	    return Object.keys(flatRules).reduce(
	      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
	      {}
	    )
	  };

	  const fetchFromApi = async (url, opts) => {
	    try {
	      const response = await got(url, opts);
	      const { body } = response;
	      return { ...body, response }
	    } catch (err) {
	      const statusCode = err.statusCode || 500;
	      const message = err.body ? err.body.message : err.message;
	      const status = err.body ? err.body.status : 'fail';

	      throw MicrolinkError({
	        ...err,
	        status,
	        message,
	        statusCode,
	        code: ERRORS_CODE.FAILED
	      })
	    }
	  };

	  const apiUrl = (url, { rules, apiKey, ...opts } = {}) => {
	    const isPro = !!apiKey;
	    const endpoint = ENDPOINT[isPro ? 'PRO' : 'FREE'];
	    const apiUrl = `${endpoint}?${stringify({
      url: url,
      ...mapRules(rules),
      ...opts
    })}`;

	    const headers = isPro ? { 'x-api-key': apiKey } : {};
	    return [apiUrl, { headers }]
	  };

	  const mql = async (
	    targetUrl,
	    { cache = null, retry = 3, timeout = 25000, ...opts } = {}
	  ) => {
	    assertUrl(targetUrl);
	    const [url, { headers }] = apiUrl(targetUrl, opts);
	    return fetchFromApi(url, { cache, retry, timeout, headers, json: true })
	  };

	  mql.MicrolinkError = MicrolinkError;
	  mql.apiUrl = apiUrl;
	  mql.mapRules = mapRules;
	  mql.version = VERSION;

	  return mql
	}

	var factory_1 = factory;

	const MicrolinkError = lib('MicrolinkError');
	const { encode: stringify } = qss_m;






	// TODO: `cache` is destructuring because is not supported on browser side yet.
	// TODO: `json` because always is the output serialized.
	const got = async (url, { json, headers, cache, ...opts }) => {
	  try {
	    const response = await kyUmd(url, opts);
	    const body = await response.json();
	    const { headers, status: statusCode, statusText: statusMessage } = response;
	    return { url: response.url, body, headers, statusCode, statusMessage }
	  } catch (err) {
	    err.body = err.response ? await err.response.json() : '';
	    err.statusCode = err.response.status;
	    err.headers = err.response.headers;
	    throw err
	  }
	};

	const browser = factory_1({
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten: flat,
	  VERSION: '0.3.5'
	});

	var browser_1 = browser;

	return browser_1;

}));
//# sourceMappingURL=mql.js.map
