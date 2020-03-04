(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url')) :
	typeof define === 'function' && define.amd ? define(['url'], factory) :
	(global = global || self, global.mql = factory(global.url));
}(this, (function (url) { 'use strict';

	url = url && url.hasOwnProperty('default') ? url['default'] : url;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var umd = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		 module.exports = factory() ;
	}(commonjsGlobal, (function () {
		/*! MIT License © Sindre Sorhus */

		const globals = {};

		const getGlobal = property => {
			/* istanbul ignore next */
			if (typeof self !== 'undefined' && self && property in self) {
				return self;
			}

			/* istanbul ignore next */
			if (typeof window !== 'undefined' && window && property in window) {
				return window;
			}

			if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal && property in commonjsGlobal) {
				return commonjsGlobal;
			}

			/* istanbul ignore next */
			if (typeof globalThis !== 'undefined' && globalThis) {
				return globalThis;
			}
		};

		const globalProperties = [
			'Headers',
			'Request',
			'Response',
			'ReadableStream',
			'fetch',
			'AbortController',
			'FormData'
		];

		for (const property of globalProperties) {
			Object.defineProperty(globals, property, {
				get() {
					const globalObject = getGlobal(property);
					const value = globalObject && globalObject[property];
					return typeof value === 'function' ? value.bind(globalObject) : value;
				}
			});
		}

		const isObject = value => value !== null && typeof value === 'object';
		const supportsAbortController = typeof globals.AbortController === 'function';
		const supportsStreams = typeof globals.ReadableStream === 'function';

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
		const timeout = (promise, ms, abortController) =>
			new Promise((resolve, reject) => {
				const timeoutID = setTimeout(() => {
					if (abortController) {
						abortController.abort();
					}

					reject(new TimeoutError());
				}, ms);

				/* eslint-disable promise/prefer-await-to-then */
				promise
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
					hooks: deepMerge({
						beforeRequest: [],
						beforeRetry: [],
						afterResponse: []
					}, options.hooks),
					method: normalizeRequestMethod(options.method || this._input.method),
					prefixUrl: String(options.prefixUrl || ''),
					retry: normalizeRetryOptions(options.retry),
					throwHttpErrors: options.throwHttpErrors !== false,
					timeout: typeof options.timeout === 'undefined' ? 10000 : options.timeout
				};

				if (typeof this._input !== 'string' && !(this._input instanceof URL || this._input instanceof globals.Request)) {
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
					this.abortController = new globals.AbortController();
					if (this._options.signal) {
						this._options.signal.addEventListener('abort', () => {
							this.abortController.abort();
						});
					}

					this._options.signal = this.abortController.signal;
				}

				this.request = new globals.Request(this._input, this._options);

				if (this._options.searchParams) {
					const url = new URL(this.request.url);
					url.search = new URLSearchParams(this._options.searchParams);
					this.request = new globals.Request(new globals.Request(url, this.request), this._options);
				}

				if (this._options.json !== undefined) {
					this._options.body = JSON.stringify(this._options.json);
					this.request.headers.set('content-type', 'application/json');
					this.request = new globals.Request(this.request, {body: this._options.body});
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
							response.clone()
						);

						if (modifiedResponse instanceof globals.Response) {
							response = modifiedResponse;
						}
					}

					if (!response.ok && this._options.throwHttpErrors) {
						throw new HTTPError(response);
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
						return (type === 'json' && response.status === 204) ? '' : response[type]();
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
								response: error.response.clone(),
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
					return globals.fetch(this.request.clone());
				}

				return timeout(globals.fetch(this.request.clone()), this._options.timeout, this.abortController);
			}

			/* istanbul ignore next */
			_stream(response, onDownloadProgress) {
				const totalBytes = Number(response.headers.get('content-length')) || 0;
				let transferredBytes = 0;

				return new globals.Response(
					new globals.ReadableStream({
						start(controller) {
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
								read();
							}

							read();
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

		var index = createInstance();

		return index;

	})));
	});

	var kyUmd = umd;

	const URL$1 = commonjsGlobal.window ? window.URL : url.URL;
	const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

	var lightweight = url => {
	  try {
	    return REGEX_HTTP_PROTOCOL.test(new URL$1(url).href)
	  } catch (err) {
	    return false
	  }
	};

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

	var _rollupPluginShim1 = str => str;

	var _rollupPluginShim1$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _rollupPluginShim1
	});

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

	const mimicFn = (to, from, {ignoreNonConfigurable = false} = {}) => {
		const {name} = to;

		for (const property of Reflect.ownKeys(from)) {
			copyProperty(to, from, property, ignoreNonConfigurable);
		}

		changePrototype(to, from);
		changeToString(to, from, name);

		return to;
	};

	var mimicFn_1 = mimicFn;

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

	function keyIdentity (key) {
	  return key
	}

	function flatten (target, opts) {
	  opts = opts || {};

	  const delimiter = opts.delimiter || '.';
	  const maxDepth = opts.maxDepth;
	  const transformKey = opts.transformKey || keyIdentity;
	  const output = {};

	  function step (object, prev, currentDepth) {
	    currentDepth = currentDepth || 1;
	    Object.keys(object).forEach(function (key) {
	      const value = object[key];
	      const isarray = opts.safe && Array.isArray(value);
	      const type = Object.prototype.toString.call(value);
	      const isbuffer = isBuffer(value);
	      const isobject = (
	        type === '[object Object]' ||
	        type === '[object Array]'
	      );

	      const newKey = prev
	        ? prev + delimiter + transformKey(key)
	        : transformKey(key);

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

	  const delimiter = opts.delimiter || '.';
	  const overwrite = opts.overwrite || false;
	  const transformKey = opts.transformKey || keyIdentity;
	  const result = {};

	  const isbuffer = isBuffer(target);
	  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
	    return target
	  }

	  // safely ensure that the key is
	  // an integer.
	  function getkey (key) {
	    const parsedKey = Number(key);

	    return (
	      isNaN(parsedKey) ||
	      key.indexOf('.') !== -1 ||
	      opts.object
	    ) ? key
	      : parsedKey
	  }

	  function addKeys (keyPrefix, recipient, target) {
	    return Object.keys(target).reduce(function (result, key) {
	      result[keyPrefix + delimiter + key] = target[key];

	      return result
	    }, recipient)
	  }

	  function isEmpty (val) {
	    const type = Object.prototype.toString.call(val);
	    const isArray = type === '[object Array]';
	    const isObject = type === '[object Object]';

	    if (!val) {
	      return true
	    } else if (isArray) {
	      return !val.length
	    } else if (isObject) {
	      return !Object.keys(val).length
	    }
	  }

	  target = Object.keys(target).reduce((result, key) => {
	    const type = Object.prototype.toString.call(target[key]);
	    const isObject = (type === '[object Object]' || type === '[object Array]');
	    if (!isObject || isEmpty(target[key])) {
	      result[key] = target[key];
	      return result
	    } else {
	      return addKeys(
	        key,
	        result,
	        flatten(target[key], opts)
	      )
	    }
	  }, {});

	  Object.keys(target).forEach(function (key) {
	    const split = key.split(delimiter).map(transformKey);
	    let key1 = getkey(split.shift());
	    let key2 = getkey(split[0]);
	    let recipient = result;

	    while (key2 !== undefined) {
	      const type = Object.prototype.toString.call(recipient[key1]);
	      const isobject = (
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

	const pickBy = obj => {
	  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
	  return obj
	};

	const isTimeoutError = (err, statusCode) =>
	  // client side error
	  err.name === 'TimeoutError' ||
	  // server side error
	  (err.name === 'HTTPError' && statusCode.toString()[0] === '5') ||
	  // browser side unexpected error
	  err.type === 'invalid-json';

	const factory = ({ VERSION, MicrolinkError, isUrlHttp, stringify, got, flatten }) => {
	  const assertUrl = (url = '') => {
	    if (!isUrlHttp(url)) {
	      const message = `The \`url\` as \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`;
	      throw new MicrolinkError({
	        url,
	        data: { url: message },
	        status: 'fail',
	        code: 'EINVALURLCLIENT',
	        message,
	        more: 'https://microlink.io/docs/api/api-parameters/url'
	      })
	    }
	  };

	  const mapRules = rules => {
	    if (typeof rules !== 'object') return
	    const flatRules = flatten(rules);
	    return Object.keys(flatRules).reduce(
	      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
	      {}
	    )
	  };

	  const fetchFromApi = async (apiUrl, opts = {}) => {
	    try {
	      const response = await got(apiUrl, opts);
	      const { body } = response;
	      return { ...body, response }
	    } catch (err) {
	      const { name, message: rawMessage, response = {} } = err;
	      const { statusCode = 500, body: rawBody, headers, url: uri = apiUrl } = response;
	      const retryTime = Number((opts.retry * opts.timeout).toFixed(0));
	      const isClientError = name === 'TimeoutError';

	      if (isTimeoutError(err, statusCode)) {
	        const message = `The request reached timeout after ${retryTime}ms.`;
	        throw new MicrolinkError({
	          url: uri,
	          data: { url: message },
	          status: 'fail',
	          code: isClientError ? 'ETIMEOUTCLIENT' : 'ETIMEOUT',
	          message,
	          more: `https://microlink.io/${isClientError ? 'etimeoutclient' : 'etimeout'}`,
	          statusCode,
	          headers
	        })
	      }

	      const body = rawBody
	        ? typeof rawBody === 'string' || Buffer.isBuffer(rawBody)
	          ? JSON.parse(rawBody)
	          : rawBody
	        : { message: rawMessage, status: 'fail' };

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
	    { data, apiKey, endpoint, retry = 3, timeout = 30000, responseType = 'json', ...opts } = {}
	  ) => {
	    const isPro = !!apiKey;
	    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE'];

	    const apiUrl = `${apiEndpoint}?${stringify({
      url,
      ...mapRules(data),
      ...flatten(pickBy(opts))
    })}`;

	    const headers = isPro ? { 'x-api-key': apiKey } : {};
	    return [apiUrl, { retry, timeout, responseType, headers }]
	  };

	  const mql = async (url, opts = {}) => {
	    assertUrl(url);
	    const [apiUrl, fetchOpts] = getApiUrl(url, opts);
	    return fetchFromApi(apiUrl, { ...opts, ...fetchOpts })
	  };

	  mql.MicrolinkError = MicrolinkError;
	  mql.getApiUrl = getApiUrl;
	  mql.fetchFromApi = fetchFromApi;
	  mql.mapRules = mapRules;
	  mql.version = VERSION;
	  mql.stream = (url, opts) => got.stream(url, { retry: 3, timeout: 30000, ...opts });

	  return mql
	};

	var factory_1 = factory;

	const ky = kyUmd.default || kyUmd;

	const { encode: stringify } = qss_m;





	const MicrolinkError = lib('MicrolinkError');

	const got = async (url, { responseType, ...opts }) => {
	  try {
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
	        body: await response.json()
	      };
	    }
	    throw err
	  }
	};

	var browser = factory_1({
	  MicrolinkError,
	  isUrlHttp: lightweight,
	  stringify,
	  got,
	  flatten: flat,
	  VERSION: '0.6.3'
	});

	return browser;

})));
//# sourceMappingURL=mql.js.map
