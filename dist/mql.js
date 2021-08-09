(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url')) :
	typeof define === 'function' && define.amd ? define(['url'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mql = factory(global.require$$0$1));
}(this, (function (require$$0$1) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	const URL$1 = commonjsGlobal.window ? window.URL : require$$0__default['default'].URL;
	const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

	var lightweight = url => {
	  try {
	    return REGEX_HTTP_PROTOCOL.test(new URL$1(url).href)
	  } catch (err) {
	    return false
	  }
	};

	var dist = {};

	function iter(output, nullish, sep, val, key) {
		var k, pfx = key ? (key + sep) : key;

		if (val == null) {
			if (nullish) output[key] = val;
		} else if (typeof val != 'object') {
			output[key] = val;
		} else if (Array.isArray(val)) {
			for (k=0; k < val.length; k++) {
				iter(output, nullish, sep, val[k], pfx + k);
			}
		} else {
			for (k in val) {
				iter(output, nullish, sep, val[k], pfx + k);
			}
		}
	}

	function flattie(input, glue, toNull) {
		var output = {};
		if (typeof input == 'object') {
			iter(output, !!toNull, glue || '.', input, '');
		}
		return output;
	}

	dist.flattie = flattie;

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
		__proto__: null,
		encode: encode,
		decode: decode
	});

	var require$$2 = /*@__PURE__*/getAugmentedNamespace(qss_m);

	var lib = {exports: {}};

	var _rollupPluginShim1 = str => str;

	var _rollupPluginShim1$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _rollupPluginShim1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_rollupPluginShim1$1);

	const copyProperty = (to, from, property, ignoreNonConfigurable) => {
		// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
		// `Function#prototype` is non-writable and non-configurable so can never be modified.
		if (property === 'length' || property === 'prototype') {
			return;
		}

		const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
		const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

		if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
			return;
		}

		Object.defineProperty(to, property, fromDescriptor);
	};

	// `Object.defineProperty()` throws if the property exists, is not configurable and either:
	//  - one its descriptors is changed
	//  - it is non-writable and its value is changed
	const canCopyProperty = function (toDescriptor, fromDescriptor) {
		return toDescriptor === undefined || toDescriptor.configurable || (
			toDescriptor.writable === fromDescriptor.writable &&
			toDescriptor.enumerable === fromDescriptor.enumerable &&
			toDescriptor.configurable === fromDescriptor.configurable &&
			(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
		);
	};

	const changePrototype = (to, from) => {
		const fromPrototype = Object.getPrototypeOf(from);
		if (fromPrototype === Object.getPrototypeOf(to)) {
			return;
		}

		Object.setPrototypeOf(to, fromPrototype);
	};

	const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

	const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
	const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

	// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
	// We use `bind()` instead of a closure for the same reason.
	// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
	const changeToString = (to, from, name) => {
		const withName = name === '' ? '' : `with ${name.trim()}() `;
		const newToString = wrappedToString.bind(null, withName, from.toString());
		// Ensure `to.toString.toString` is non-enumerable and has the same `same`
		Object.defineProperty(newToString, 'name', toStringName);
		Object.defineProperty(to, 'toString', {...toStringDescriptor, value: newToString});
	};

	const mimicFn$2 = (to, from, {ignoreNonConfigurable = false} = {}) => {
		const {name} = to;

		for (const property of Reflect.ownKeys(from)) {
			copyProperty(to, from, property, ignoreNonConfigurable);
		}

		changePrototype(to, from);
		changeToString(to, from, name);

		return to;
	};

	var mimicFn_1 = mimicFn$2;

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

	var addErrorProps$1 = interfaceObject;

	const cleanStack = require$$0;
	const mimicFn$1 = mimicFn_1;

	const addErrorProps = addErrorProps$1;
	const {isString} = helpers;

	function createExtendError$1 (ErrorClass, classProps) {
	  function ExtendError (props) {
	    const error = new ErrorClass();
	    const errorProps = isString(props) ? {message: props} : props;
	    addErrorProps(error, classProps, errorProps);

	    error.stack = cleanStack(error.stack);
	    return error
	  }

	  ExtendError.prototype = ErrorClass.prototype;
	  mimicFn$1(ExtendError, ErrorClass);

	  return ExtendError
	}

	var createExtendError_1 = createExtendError$1;

	const {inherits} = helpers;
	const mimicFn = mimicFn_1;

	const REGEX_CLASS_NAME = /[^0-9a-zA-Z_$]/;

	function createError$1 (className) {
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
	  mimicFn(ErrorClass, Error);
	  return ErrorClass
	}

	var createError_1 = createError$1;

	const createExtendError = createExtendError_1;
	const createError = createError_1;

	const createErrorClass = ErrorClass => (className, props) => {
	  const errorClass = createError(className || ErrorClass.name);
	  return createExtendError(errorClass, props)
	};

	lib.exports = createErrorClass(Error);
	lib.exports.type = createErrorClass(TypeError);
	lib.exports.range = createErrorClass(RangeError);
	lib.exports.eval = createErrorClass(EvalError);
	lib.exports.syntax = createErrorClass(SyntaxError);
	lib.exports.reference = createErrorClass(ReferenceError);
	lib.exports.uri = createErrorClass(URIError);

	const ENDPOINT = {
	  FREE: 'https://api.microlink.io',
	  PRO: 'https://pro.microlink.io'
	};

	const isObject = input => input !== null && typeof input === 'object';

	const parseBody = (input, error, url) => {
	  try {
	    return JSON.parse(input)
	  } catch (_) {
	    const message = input || error.message;

	    return {
	      status: 'error',
	      data: { url: message },
	      more: 'https://microlink.io/efatal',
	      code: 'EFATAL',
	      message,
	      url
	    }
	  }
	};

	const factory$1 = ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) => {
	  const assertUrl = (url = '') => {
	    if (!isUrlHttp(url)) {
	      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`;
	      throw new MicrolinkError({
	        status: 'fail',
	        data: { url: message },
	        more: 'https://microlink.io/docs/api/api-parameters/url',
	        code: 'EINVALURLCLIENT',
	        message,
	        url
	      })
	    }
	  };

	  const mapRules = rules => {
	    if (!isObject(rules)) return
	    const flatRules = flatten(rules);
	    return Object.keys(flatRules).reduce(
	      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
	      {}
	    )
	  };

	  const fetchFromApi = async (apiUrl, opts = {}) => {
	    try {
	      const response = await got(apiUrl, opts);
	      return opts.responseType === 'buffer'
	        ? { body: response.body, response }
	        : { ...response.body, response }
	    } catch (err) {
	      const { response = {} } = err;
	      const { statusCode, body: rawBody, headers, url: uri = apiUrl } = response;

	      const body =
	        isObject(rawBody) && !Buffer.isBuffer(rawBody) ? rawBody : parseBody(rawBody, err, uri);

	      throw MicrolinkError({
	        ...body,
	        message: body.message,
	        url: uri,
	        statusCode,
	        headers
	      })
	    }
	  };

	  const getApiUrl = (
	    url,
	    { data, apiKey, endpoint, retry, cache, ...opts } = {},
	    { responseType = 'json', headers: gotHeaders, ...gotOpts } = {}
	  ) => {
	    const isPro = !!apiKey;
	    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE'];

	    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(opts)
    })}`;

	    const headers = isPro ? { ...gotHeaders, 'x-api-key': apiKey } : { ...gotHeaders };
	    return [apiUrl, { ...gotOpts, responseType, cache, retry, headers }]
	  };

	  const createMql = defaultOpts => async (url, opts, gotOpts) => {
	    assertUrl(url);
	    const [apiUrl, fetchOpts] = getApiUrl(url, opts, {
	      ...defaultOpts,
	      ...gotOpts
	    });
	    return fetchFromApi(apiUrl, fetchOpts)
	  };

	  const mql = createMql();
	  mql.MicrolinkError = MicrolinkError;
	  mql.getApiUrl = getApiUrl;
	  mql.fetchFromApi = fetchFromApi;
	  mql.mapRules = mapRules;
	  mql.version = VERSION;
	  mql.stream = got.stream;
	  mql.buffer = createMql({ responseType: 'buffer' });

	  return mql
	};

	var factory_1 = factory$1;

	var ky$1 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
		module.exports = factory() ;
	}(commonjsGlobal, (function () {
		/*! MIT License © Sindre Sorhus */

		const isObject = value => value !== null && typeof value === 'object';
		const supportsAbortController = typeof globalThis.AbortController === 'function';
		const supportsStreams = typeof globalThis.ReadableStream === 'function';
		const supportsFormData = typeof globalThis.FormData === 'function';

		const mergeHeaders = (source1, source2) => {
			const result = new globalThis.Headers(source1 || {});
			const isHeadersInstance = source2 instanceof globalThis.Headers;
			const source = new globalThis.Headers(source2 || {});

			for (const [key, value] of source) {
				if ((isHeadersInstance && value === 'undefined') || value === undefined) {
					result.delete(key);
				} else {
					result.set(key, value);
				}
			}

			return result;
		};

		const deepMerge = (...sources) => {
			let returnValue = {};
			let headers = {};

			for (const source of sources) {
				if (Array.isArray(source)) {
					if (!(Array.isArray(returnValue))) {
						returnValue = [];
					}

					returnValue = [...returnValue, ...source];
				} else if (isObject(source)) {
					for (let [key, value] of Object.entries(source)) {
						if (isObject(value) && (key in returnValue)) {
							value = deepMerge(returnValue[key], value);
						}

						returnValue = {...returnValue, [key]: value};
					}

					if (isObject(source.headers)) {
						headers = mergeHeaders(headers, source.headers);
					}
				}

				returnValue.headers = headers;
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

		const retryMethods = [
			'get',
			'put',
			'head',
			'delete',
			'options',
			'trace'
		];

		const retryStatusCodes = [
			408,
			413,
			429,
			500,
			502,
			503,
			504
		];

		const retryAfterStatusCodes = [
			413,
			429,
			503
		];

		const stop = Symbol('stop');

		class HTTPError extends Error {
			constructor(response, request, options) {
				// Set the message to the status text, such as Unauthorized,
				// with some fallbacks. This message should never be undefined.
				super(
					response.statusText ||
					String(
						(response.status === 0 || response.status) ?
							response.status : 'Unknown response error'
					)
				);
				this.name = 'HTTPError';
				this.response = response;
				this.request = request;
				this.options = options;
			}
		}

		class TimeoutError extends Error {
			constructor(request) {
				super('Request timed out');
				this.name = 'TimeoutError';
				this.request = request;
			}
		}

		const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

		// `Promise.race()` workaround (#91)
		const timeout = (request, abortController, options) =>
			new Promise((resolve, reject) => {
				const timeoutID = setTimeout(() => {
					if (abortController) {
						abortController.abort();
					}

					reject(new TimeoutError(request));
				}, options.timeout);

				/* eslint-disable promise/prefer-await-to-then */
				options.fetch(request)
					.then(resolve)
					.catch(reject)
					.then(() => {
						clearTimeout(timeoutID);
					});
				/* eslint-enable promise/prefer-await-to-then */
			});

		const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

		const defaultRetryOptions = {
			limit: 2,
			methods: retryMethods,
			statusCodes: retryStatusCodes,
			afterStatusCodes: retryAfterStatusCodes
		};

		const normalizeRetryOptions = (retry = {}) => {
			if (typeof retry === 'number') {
				return {
					...defaultRetryOptions,
					limit: retry
				};
			}

			if (retry.methods && !Array.isArray(retry.methods)) {
				throw new Error('retry.methods must be an array');
			}

			if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
				throw new Error('retry.statusCodes must be an array');
			}

			return {
				...defaultRetryOptions,
				...retry,
				afterStatusCodes: retryAfterStatusCodes
			};
		};

		// The maximum value of a 32bit int (see issue #117)
		const maxSafeTimeout = 2147483647;

		class Ky {
			constructor(input, options = {}) {
				this._retryCount = 0;
				this._input = input;
				this._options = {
					// TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
					credentials: this._input.credentials || 'same-origin',
					...options,
					headers: mergeHeaders(this._input.headers, options.headers),
					hooks: deepMerge({
						beforeRequest: [],
						beforeRetry: [],
						afterResponse: []
					}, options.hooks),
					method: normalizeRequestMethod(options.method || this._input.method),
					prefixUrl: String(options.prefixUrl || ''),
					retry: normalizeRetryOptions(options.retry),
					throwHttpErrors: options.throwHttpErrors !== false,
					timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout,
					fetch: options.fetch || globalThis.fetch.bind(globalThis)
				};

				if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
					throw new TypeError('`input` must be a string, URL, or Request');
				}

				if (this._options.prefixUrl && typeof this._input === 'string') {
					if (this._input.startsWith('/')) {
						throw new Error('`input` must not begin with a slash when using `prefixUrl`');
					}

					if (!this._options.prefixUrl.endsWith('/')) {
						this._options.prefixUrl += '/';
					}

					this._input = this._options.prefixUrl + this._input;
				}

				if (supportsAbortController) {
					this.abortController = new globalThis.AbortController();
					if (this._options.signal) {
						this._options.signal.addEventListener('abort', () => {
							this.abortController.abort();
						});
					}

					this._options.signal = this.abortController.signal;
				}

				this.request = new globalThis.Request(this._input, this._options);

				if (this._options.searchParams) {
					const textSearchParams = typeof this._options.searchParams === 'string' ?
						this._options.searchParams.replace(/^\?/, '') :
						new URLSearchParams(this._options.searchParams).toString();
					const searchParams = '?' + textSearchParams;
					const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

					// To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
					if (((supportsFormData && this._options.body instanceof globalThis.FormData) || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers['content-type'])) {
						this.request.headers.delete('content-type');
					}

					this.request = new globalThis.Request(new globalThis.Request(url, this.request), this._options);
				}

				if (this._options.json !== undefined) {
					this._options.body = JSON.stringify(this._options.json);
					this.request.headers.set('content-type', 'application/json');
					this.request = new globalThis.Request(this.request, {body: this._options.body});
				}

				const fn = async () => {
					if (this._options.timeout > maxSafeTimeout) {
						throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
					}

					await delay(1);
					let response = await this._fetch();

					for (const hook of this._options.hooks.afterResponse) {
						// eslint-disable-next-line no-await-in-loop
						const modifiedResponse = await hook(
							this.request,
							this._options,
							this._decorateResponse(response.clone())
						);

						if (modifiedResponse instanceof globalThis.Response) {
							response = modifiedResponse;
						}
					}

					this._decorateResponse(response);

					if (!response.ok && this._options.throwHttpErrors) {
						throw new HTTPError(response, this.request, this._options);
					}

					// If `onDownloadProgress` is passed, it uses the stream API internally
					/* istanbul ignore next */
					if (this._options.onDownloadProgress) {
						if (typeof this._options.onDownloadProgress !== 'function') {
							throw new TypeError('The `onDownloadProgress` option must be a function');
						}

						if (!supportsStreams) {
							throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
						}

						return this._stream(response.clone(), this._options.onDownloadProgress);
					}

					return response;
				};

				const isRetriableMethod = this._options.retry.methods.includes(this.request.method.toLowerCase());
				const result = isRetriableMethod ? this._retry(fn) : fn();

				for (const [type, mimeType] of Object.entries(responseTypes)) {
					result[type] = async () => {
						this.request.headers.set('accept', this.request.headers.get('accept') || mimeType);

						const response = (await result).clone();

						if (type === 'json') {
							if (response.status === 204) {
								return '';
							}

							if (options.parseJson) {
								return options.parseJson(await response.text());
							}
						}

						return response[type]();
					};
				}

				return result;
			}

			_calculateRetryDelay(error) {
				this._retryCount++;

				if (this._retryCount < this._options.retry.limit && !(error instanceof TimeoutError)) {
					if (error instanceof HTTPError) {
						if (!this._options.retry.statusCodes.includes(error.response.status)) {
							return 0;
						}

						const retryAfter = error.response.headers.get('Retry-After');
						if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
							let after = Number(retryAfter);
							if (Number.isNaN(after)) {
								after = Date.parse(retryAfter) - Date.now();
							} else {
								after *= 1000;
							}

							if (typeof this._options.retry.maxRetryAfter !== 'undefined' && after > this._options.retry.maxRetryAfter) {
								return 0;
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

			_decorateResponse(response) {
				if (this._options.parseJson) {
					response.json = async () => {
						return this._options.parseJson(await response.text());
					};
				}

				return response;
			}

			async _retry(fn) {
				try {
					return await fn();
				} catch (error) {
					const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
					if (ms !== 0 && this._retryCount > 0) {
						await delay(ms);

						for (const hook of this._options.hooks.beforeRetry) {
							// eslint-disable-next-line no-await-in-loop
							const hookResult = await hook({
								request: this.request,
								options: this._options,
								error,
								retryCount: this._retryCount
							});

							// If `stop` is returned from the hook, the retry process is stopped
							if (hookResult === stop) {
								return;
							}
						}

						return this._retry(fn);
					}

					if (this._options.throwHttpErrors) {
						throw error;
					}
				}
			}

			async _fetch() {
				for (const hook of this._options.hooks.beforeRequest) {
					// eslint-disable-next-line no-await-in-loop
					const result = await hook(this.request, this._options);

					if (result instanceof Request) {
						this.request = result;
						break;
					}

					if (result instanceof Response) {
						return result;
					}
				}

				if (this._options.timeout === false) {
					return this._options.fetch(this.request.clone());
				}

				return timeout(this.request.clone(), this.abortController, this._options);
			}

			/* istanbul ignore next */
			_stream(response, onDownloadProgress) {
				const totalBytes = Number(response.headers.get('content-length')) || 0;
				let transferredBytes = 0;

				return new globalThis.Response(
					new globalThis.ReadableStream({
						async start(controller) {
							const reader = response.body.getReader();

							if (onDownloadProgress) {
								onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
							}

							async function read() {
								const {done, value} = await reader.read();
								if (done) {
									controller.close();
									return;
								}

								if (onDownloadProgress) {
									transferredBytes += value.byteLength;
									const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
									onDownloadProgress({percent, transferredBytes, totalBytes}, value);
								}

								controller.enqueue(value);
								await read();
							}

							await read();
						}
					})
				);
			}
		}

		const validateAndMerge = (...sources) => {
			for (const source of sources) {
				if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
					throw new TypeError('The `options` argument must be an object');
				}
			}

			return deepMerge({}, ...sources);
		};

		const createInstance = defaults => {
			const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

			for (const method of requestMethods) {
				ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
			}

			ky.HTTPError = HTTPError;
			ky.TimeoutError = TimeoutError;
			ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
			ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));
			ky.stop = stop;

			return ky;
		};

		const ky = createInstance();

		return ky;

	})));
	}(ky$1));

	const isUrlHttp = lightweight;
	const { flattie: flatten } = dist;
	const { encode: stringify } = require$$2;
	const whoops = lib.exports;

	const factory = factory_1;
	const ky = ky$1.exports;

	const MicrolinkError = whoops('MicrolinkError');

	const got = async (url, opts) => {
	  try {
	    if (opts.timeout === undefined) opts.timeout = false;
	    const response = await ky(url, opts);
	    const body = await response.json();
	    const { headers, status: statusCode, statusText: statusMessage } = response;
	    return { url: response.url, body, headers, statusCode, statusMessage }
	  } catch (err) {
	    if (err.response) {
	      const { response } = err;
	      err.response = {
	        ...response,
	        headers: [...response.headers.entries()].reduce(
	          (acc, [key, value]) => ({ ...acc, [key]: value }),
	          {}
	        ),
	        statusCode: response.status,
	        body: await response.text()
	      };
	    }
	    throw err
	  }
	};

	var browser = factory({
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten,
	  VERSION: '0.9.9'
	});

	return browser;

})));
//# sourceMappingURL=mql.js.map
