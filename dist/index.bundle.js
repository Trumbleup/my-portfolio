/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_fonts_raleway_regular_webfont_woff2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/fonts/raleway-regular-webfont.woff2 */ "./src/assets/fonts/raleway-regular-webfont.woff2");
/* harmony import */ var _assets_fonts_raleway_regular_webfont_woff__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/fonts/raleway-regular-webfont.woff */ "./src/assets/fonts/raleway-regular-webfont.woff");
/* harmony import */ var _assets_images_jsleeve_photo_PNG__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assets/images/jsleeve-photo.PNG */ "./src/assets/images/jsleeve-photo.PNG");
/* harmony import */ var _assets_images_jsleeve_photo_PNG__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_images_jsleeve_photo_PNG__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _assets_images_fruition_image_PNG__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./assets/images/fruition-image.PNG */ "./src/assets/images/fruition-image.PNG");
/* harmony import */ var _assets_images_fruition_image_PNG__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_images_fruition_image_PNG__WEBPACK_IMPORTED_MODULE_6__);
// Imports







var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_assets_fonts_raleway_regular_webfont_woff2__WEBPACK_IMPORTED_MODULE_3__);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_assets_fonts_raleway_regular_webfont_woff__WEBPACK_IMPORTED_MODULE_4__);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()((_assets_images_jsleeve_photo_PNG__WEBPACK_IMPORTED_MODULE_5___default()));
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()((_assets_images_fruition_image_PNG__WEBPACK_IMPORTED_MODULE_6___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n/* */\n\n@font-face {\n  font-family: \"ralewayregular\";\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\"),\n    url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n\nbody {\n  text-align: center;\n  font-family: \"ralewayregular\";\n  color: white;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n.overflow-wrap {\n  overflow-x: hidden;\n}\n\n#home {\n  background-color: #2a2c2b;\n  color: white;\n  height: 100vh;\n}\n\n.canvas {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n#canvas {\n  width: 100%;\n  height: 100%;\n}\n\n.flex {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.flex.row {\n  flex-direction: row;\n}\n\n.flex.wrap {\n  flex-wrap: wrap;\n}\n\n.text {\n  margin: 0 0 20px 0;\n  z-index: 2;\n}\n\n.highlight {\n  color: #96ed89;\n}\n\n.button {\n  position: relative;\n  padding: 12px 50px 12px 20px;\n  border: 2px solid white;\n  box-sizing: inherit;\n  margin-bottom: 53px;\n  transition: all 0.3s;\n  cursor: pointer;\n}\n\n.button:hover {\n  color: white;\n  background-color: #168039;\n  border: 2px solid #168039;\n}\n\n.button:hover i {\n  transform: rotate(90deg);\n}\n\n.button i {\n  position: absolute;\n  right: 20px;\n  transition: transform 0.3s;\n  pointer-events: none;\n}\n\n.modal-wrap {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  z-index: 100;\n  pointer-events: none;\n}\n\n.modal-wrap.visible {\n  pointer-events: initial;\n}\n\n.mask {\n  background: rgba(0, 0, 0, 0.5);\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n\n.modal {\n  display: flex;\n  flex-direction: column;\n  width: 700px;\n  background: white;\n  opacity: 0;\n  position: relative;\n}\n\n.modal-wrap.visible .mask {\n  opacity: 1;\n  z-index: 101;\n}\n\n.modal-wrap.visible .modal {\n  opacity: 1;\n  z-index: 102;\n}\n\n.slider-wrap {\n  width: 700px;\n  height: 450px;\n  margin: 0 auto;\n  position: relative;\n}\n\n.slider-view {\n  overflow: hidden;\n  position: relative;\n}\n\n.slider {\n  position: relative;\n  left: -700px;\n  width: 10000px;\n}\n\n.slide {\n  width: 700px;\n  height: 450px;\n  float: left;\n  margin: 0px;\n  padding: 0px;\n  position: relative;\n}\n\n.slider-buttons {\n  position: relative;\n  margin: 0 auto;\n  bottom: 70px;\n}\n\n.slider-buttons .slider-button {\n  position: relative;\n  width: 70px;\n  height: 70px;\n  background-color: black;\n  opacity: 0.1;\n}\n\n#prev.slider-button {\n  float: left;\n}\n\n#next.slider-button {\n  float: right;\n}\n\n.transition {\n  transition: 0.7s;\n}\n\n.project-info {\n  box-sizing: border-box;\n  border-top: 3px solid black;\n  color: black;\n  padding: 35px 60px 90px 25px;\n  text-align: left;\n}\n\n.project-info .title {\n  font-size: 24px;\n  font-weight: bold;\n}\n\n.project-info .info {\n  font-size: 18px;\n  padding: 5px 0px 10px 0px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  color: #c0c0c0;\n}\n\n.project-info .details {\n  font-size: 16px;\n  margin-top: 20px;\n}\n\n.modal-button {\n  width: 120px;\n  height: 40px;\n  color: white;\n  background: #168039;\n  position: absolute;\n  bottom: 20px;\n}\n\n.modal i {\n  position: absolute;\n  bottom: 30px;\n  right: 20px;\n}\n\nnav {\n  width: 100%;\n  height: 50px;\n  background-color: #364140;\n  border-bottom: 3px solid #67cc8e;\n  text-align: left;\n  position: absolute;\n  z-index: 99;\n}\n\n@keyframes popDown {\n  from {\n    transform: translateY(-100%);\n  }\n\n  to {\n    transform: translateY(0%);\n  }\n}\n\n.fixed-nav div nav {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 100;\n  animation: popDown 0.5s;\n}\n\nnav .link-wrap {\n  max-width: 1200px;\n  width: 100%;\n  height: 0;\n  background-color: #333;\n  overflow-x: hidden;\n  position: absolute;\n  top: 53px;\n  z-index: 99;\n  transition: height 0.4s ease-out;\n}\n\nnav .link-wrap.visible {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: flex-start;\n  height: 220px;\n}\n\nnav .link-wrap div {\n  cursor: pointer;\n  font-size: 16px;\n  padding: 12px 20px;\n  transition: color 0.5s;\n  text-transform: uppercase;\n}\n\nnav .bar-icon {\n  position: absolute;\n  margin: 0 auto;\n  right: 5vw;\n  z-index: 99;\n}\n\nnav .link-wrap .active {\n  color: #67cc8e;\n}\n\nnav .mobile-link-wrap.visible {\n  display: block;\n}\n\n.section-padding {\n  padding: 100px 0 130px 0;\n}\n\nsection {\n  color: #2a2c2b;\n  line-height: 24px;\n}\n\nsection .container {\n  box-sizing: border-box;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n@keyframes slideInLeft {\n  0% {\n    opacity: 0;\n    transform: translateX(-300px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInRight {\n  0% {\n    opacity: 0;\n    transform: translateX(300px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInUp {\n  0% {\n    opacity: 0;\n    transform: translateY(150px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes flipInX {\n  0% {\n    animation-timing-function: ease-in;\n    opacity: 0;\n    transform: perspective(400px) rotateY(90deg);\n  }\n  40% {\n    animation-timing-function: ease-in;\n    transform: perspective(400px) rotateY(-20deg);\n  }\n  60% {\n    opacity: 1;\n    transform: perspective(400px) rotateY(10deg);\n  }\n  80% {\n    opacity: 1;\n    transform: perspective(400px) rotateY(5deg);\n  }\n  100% {\n    opacity: 1;\n    transform: perspective(400px);\n  }\n}\n\n@keyframes fadeIn {\n  100% {\n    opacity: 1;\n  }\n}\n\n.slide-in-left {\n  animation: slideInLeft 0.75s ease both;\n}\n\n.slide-in-right {\n  animation: slideInRight 0.75s ease both;\n}\n\n.flip-in-x {\n  animation: flipInX 0.75s ease both;\n}\n\n.fade-in {\n  animation: fadeIn 0.75s ease both;\n}\n\n.slide-in-up {\n  animation: slideInUp 1.75s ease both;\n}\n\n.waypoint {\n  opacity: 0;\n}\n\n.container .header {\n  font-size: 32px;\n  font-weight: bold;\n}\n\n.header {\n  color: #2a2c2b;\n}\n\n.header-bar {\n  background-color: #2a2c2b;\n  width: 70px;\n  height: 4px;\n  margin: 25px 0 70px 0;\n}\n\n.bullet-wrap {\n  height: 230px;\n  padding: 0 10px;\n  justify-content: flex-start;\n}\n\n.bullet-label {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 15px 0 5px 0;\n}\n\n.diamond {\n  width: 0;\n  height: 0;\n  border: 50px solid transparent;\n  border-bottom-color: #67cc8e;\n  position: relative;\n  top: -50px;\n}\n.diamond:after {\n  content: \"\";\n  position: absolute;\n  left: -50px;\n  top: 50px;\n  width: 0;\n  height: 0;\n  border: 50px solid transparent;\n  border-top-color: #67cc8e;\n}\n\n.label-wrap {\n  justify-content: center;\n}\n\n.skills-wrapper {\n  margin-top: 50px;\n}\n\n.personal-picture {\n  width: 200px;\n  height: 200px;\n}\n\n.bio-label {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 20px 0 15px 0;\n}\n\n.bio-text {\n  font-size: 16px;\n  line-height: 26px;\n  padding: 0 10px 20px 10px;\n  text-align: center;\n  color: #616161;\n}\n\n.tech-wrapper {\n  flex-wrap: wrap;\n}\n\n.tech-wrapper img {\n  width: 100px;\n  height: 100px;\n  padding: 10px 20px;\n}\n\n.tech-wrapper :nth-child(9) {\n  width: 150px;\n  padding: 0;\n}\n\n#portfolio {\n  background: #f5f5f5;\n}\n\n.project {\n  position: relative;\n}\n\n.card {\n  width: 430px;\n  height: 320px;\n  opacity: 1;\n  transition: opacity 0.5s;\n  background-repeat: no-repeat;\n  background-size: cover;\n  border: 2px solid black;\n}\n\n#portfolio #projects :nth-child(1) .card {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") center center/cover;\n}\n\n#portfolio #projects :nth-child(2) .card {\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") center center/cover;\n}\n\n#portfolio #projects .project:hover .card {\n  opacity: 0;\n  transition: opacity 0.5s;\n}\n\n#portfolio #projects .project .text {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  transition: all 0.3s ease-in-out;\n  opacity: 0;\n  z-index: 2;\n}\n\n#portfolio #projects .project:hover .text {\n  opacity: 1;\n  top: 24%;\n}\n\n#portfolio #projects .project .button {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  border: 2px solid black;\n  font-size: 16px;\n  width: 170px;\n  padding: 7px 0;\n  margin: 0 auto;\n  transition: all 0.3s ease-in-out;\n  opacity: 0;\n  z-index: 2;\n}\n\n#portfolio #projects .project:hover .button {\n  opacity: 1;\n  bottom: 24%;\n}\n\n.medium-green {\n  color: #67cc8e;\n}\n\n#contact {\n  background: #252934;\n  color: white;\n}\n\n#contact .header {\n  color: white;\n}\n\n#contact .header-bar {\n  background: white;\n  margin: 25px 0 40px 0;\n  width: 110px;\n}\n\n#contact form {\n  min-width: 500px;\n  margin: 40px auto 0 auto;\n}\n\n#contact input[type=\"text\"],\n#contact input[type=\"email\"],\n#contact textarea {\n  background: #1e242c;\n  border: 0;\n  box-sizing: border-box;\n  color: white;\n  display: block;\n  font-size: 16px;\n  margin-bottom: 3px;\n  padding: 10px 15px;\n  width: 100%;\n}\n\n#contact textarea {\n  margin-bottom: 5px;\n  min-height: 150px;\n}\n\n#contact .button {\n  background: transparent;\n  color: white;\n  float: right;\n  font-size: 16px;\n  padding: 10px 30px;\n  outline: 0;\n  margin: 5px 0 0 0;\n}\n\n#contact .confirm {\n  float: right;\n  font-size: 14px;\n  padding: 10px 30px;\n  margin: 5px 0 0 0;\n}\n\n#contact .confirm.success {\n  color: green;\n}\n\n#contact .confirm.error {\n  color: red;\n}\n\n#contact i {\n  opacity: 0;\n  padding: 10px 30px;\n  margin: 10px 0 0 0;\n}\n\n#contact i.pending {\n  opacity: 1;\n}\n\n@keyframes grow {\n  0% {\n    opacity: 1;\n    transform: scale(0);\n  }\n  50% {\n    transform: scale(1.2);\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n.grow {\n  animation: grow 1s ease both;\n}\n\nfooter {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #1b242f;\n  padding: 70px 0 50px 0;\n  position: relative;\n}\n\nfooter #scrollTop {\n  width: 50px;\n  height: 50px;\n  position: absolute;\n  top: -25px;\n  background-color: #67cc8e;\n  cursor: pointer;\n}\n\nfooter #scrollTop i {\n  pointer-events: none;\n}\n\nfooter .icon-wrap {\n  margin: 0 auto;\n}\n\nfooter .icon {\n  width: 50px;\n  height: 60px;\n  background-color: #34373f;\n  margin: 0 15px;\n  overflow: hidden;\n  transform: scale(1);\n  transition: background-color 0.3s, transform 0.5s;\n}\n\nfooter .icon:hover i {\n  animation: slideDown 0.3s;\n}\n\nfooter .icon:hover {\n  transform: scale(0.9);\n  background-color: #67cc8e;\n}\n\n@keyframes slideDown {\n  0% {\n    transform: translateY(-35px);\n  }\n  100% {\n    transform: translateY(0);\n  }\n}\n\n@media screen and (min-width: 600px) {\n  .text {\n    font-size: 32pt;\n    line-height: 36pt;\n  }\n\n  .button {\n    font-size: 21px;\n  }\n\n  nav .link-wrap {\n    background: none;\n    height: initial;\n    overflow: visible;\n    position: initial;\n    text-align: left;\n  }\n\n  nav .link-wrap div {\n    display: inline;\n    font-size: initial;\n    margin: 0 20px;\n    color: white;\n  }\n\n  nav .bar-icon {\n    display: none;\n  }\n\n  section .container {\n    padding: 0 10px;\n  }\n\n  .container .header {\n    font-size: 40px;\n    font-weight: bold;\n  }\n  .bio-wrapper {\n    padding: 0 50px 0 50px;\n    max-width: 50%;\n  }\n  .tech-wrapper {\n    max-width: 50%;\n  }\n}\n\n@media screen and (min-width: 960px) {\n  .row-screen-large {\n    flex-direction: row;\n    padding: 0 15px;\n  }\n}\n\n@media screen and (max-width: 600px) {\n  .text {\n    font-size: 16pt;\n    line-height: 24pt;\n  }\n  .bullet-wrap {\n    height: 200px;\n  }\n  .bullet-label {\n    font-size: 18px;\n  }\n  .bullet-text {\n    font-size: 12px;\n  }\n  #about .header-bar {\n    margin: 25px 0 30px 0;\n  }\n  .diamond {\n    width: 0;\n    height: 0;\n    border: 25px solid transparent;\n    border-bottom-color: #67cc8e;\n    position: relative;\n    top: -25px;\n  }\n  .diamond:after {\n    content: \"\";\n    position: absolute;\n    left: -25px;\n    top: 25px;\n    width: 0;\n    height: 0;\n    border: 25px solid transparent;\n    border-top-color: #67cc8e;\n  }\n  .bio-text {\n    font-size: 12px;\n  }\n  .tech-wrapper img {\n    width: 75px;\n    height: 75px;\n  }\n  .card {\n    width: 100vw;\n    height: 200px;\n    box-sizing: border-box;\n  }\n  .modal-wrap {\n    z-index: 101;\n  }\n  .modal {\n    width: 100vw;\n    height: 100vh;\n  }\n  .slider-wrap {\n    width: 100%;\n    height: 250px;\n  }\n  .slider-view {\n    height: 250px;\n  }\n  .slider {\n    position: relative;\n    left: -700px;\n    width: 10000px;\n  }\n  .slide {\n  }\n\n  .project-info {\n    padding: 15px 40px 20px 15px;\n  }\n\n  .project-info .title {\n    font-size: 24px;\n  }\n\n  .project-info .info {\n    font-size: 16px;\n    padding: 8px 0px 10px 0px;\n  }\n\n  .project-info .details {\n    font-size: 14px;\n    margin-top: 15px;\n  }\n\n  .modal-button {\n    width: 120px;\n    height: 40px;\n    color: white;\n    background: #168039;\n    position: absolute;\n    bottom: 20px;\n  }\n}\n", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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ACE;IACE,mBAAmB;IACnB,eAAe;EACjB;AACF;;AAEA;EACE;IACE,eAAe;IACf,iBAAiB;EACnB;EACA;IACE,aAAa;EACf;EACA;IACE,eAAe;EACjB;EACA;IACE,eAAe;EACjB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,QAAQ;IACR,SAAS;IACT,8BAA8B;IAC9B,4BAA4B;IAC5B,kBAAkB;IAClB,UAAU;EACZ;EACA;IACE,WAAW;IACX,kBAAkB;IAClB,WAAW;IACX,SAAS;IACT,QAAQ;IACR,SAAS;IACT,8BAA8B;IAC9B,yBAAyB;EAC3B;EACA;IACE,eAAe;EACjB;EACA;IACE,WAAW;IACX,YAAY;EACd;EACA;IACE,YAAY;IACZ,aAAa;IACb,sBAAsB;EACxB;EACA;IACE,YAAY;EACd;EACA;IACE,YAAY;IACZ,aAAa;EACf;EACA;IACE,WAAW;IACX,aAAa;EACf;EACA;IACE,aAAa;EACf;EACA;IACE,kBAAkB;IAClB,YAAY;IACZ,cAAc;EAChB;EACA;EACA;;EAEA;IACE,4BAA4B;EAC9B;;EAEA;IACE,eAAe;EACjB;;EAEA;IACE,eAAe;IACf,yBAAyB;EAC3B;;EAEA;IACE,eAAe;IACf,gBAAgB;EAClB;;EAEA;IACE,YAAY;IACZ,YAAY;IACZ,YAAY;IACZ,mBAAmB;IACnB,kBAAkB;IAClB,YAAY;EACd;AACF","sourcesContent":["/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol,\nul {\n  list-style: none;\n}\nblockquote,\nq {\n  quotes: none;\n}\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: \"\";\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n/* */\n\n@font-face {\n  font-family: \"ralewayregular\";\n  src: url(\"./assets/fonts/raleway-regular-webfont.woff2\") format(\"woff2\"),\n    url(\"./assets/fonts/raleway-regular-webfont.woff\") format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n\nbody {\n  text-align: center;\n  font-family: \"ralewayregular\";\n  color: white;\n}\n\na {\n  color: inherit;\n  text-decoration: none;\n}\n\n.overflow-wrap {\n  overflow-x: hidden;\n}\n\n#home {\n  background-color: #2a2c2b;\n  color: white;\n  height: 100vh;\n}\n\n.canvas {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n#canvas {\n  width: 100%;\n  height: 100%;\n}\n\n.flex {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n\n.flex.row {\n  flex-direction: row;\n}\n\n.flex.wrap {\n  flex-wrap: wrap;\n}\n\n.text {\n  margin: 0 0 20px 0;\n  z-index: 2;\n}\n\n.highlight {\n  color: #96ed89;\n}\n\n.button {\n  position: relative;\n  padding: 12px 50px 12px 20px;\n  border: 2px solid white;\n  box-sizing: inherit;\n  margin-bottom: 53px;\n  transition: all 0.3s;\n  cursor: pointer;\n}\n\n.button:hover {\n  color: white;\n  background-color: #168039;\n  border: 2px solid #168039;\n}\n\n.button:hover i {\n  transform: rotate(90deg);\n}\n\n.button i {\n  position: absolute;\n  right: 20px;\n  transition: transform 0.3s;\n  pointer-events: none;\n}\n\n.modal-wrap {\n  width: 100vw;\n  height: 100vh;\n  position: fixed;\n  z-index: 100;\n  pointer-events: none;\n}\n\n.modal-wrap.visible {\n  pointer-events: initial;\n}\n\n.mask {\n  background: rgba(0, 0, 0, 0.5);\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n\n.modal {\n  display: flex;\n  flex-direction: column;\n  width: 700px;\n  background: white;\n  opacity: 0;\n  position: relative;\n}\n\n.modal-wrap.visible .mask {\n  opacity: 1;\n  z-index: 101;\n}\n\n.modal-wrap.visible .modal {\n  opacity: 1;\n  z-index: 102;\n}\n\n.slider-wrap {\n  width: 700px;\n  height: 450px;\n  margin: 0 auto;\n  position: relative;\n}\n\n.slider-view {\n  overflow: hidden;\n  position: relative;\n}\n\n.slider {\n  position: relative;\n  left: -700px;\n  width: 10000px;\n}\n\n.slide {\n  width: 700px;\n  height: 450px;\n  float: left;\n  margin: 0px;\n  padding: 0px;\n  position: relative;\n}\n\n.slider-buttons {\n  position: relative;\n  margin: 0 auto;\n  bottom: 70px;\n}\n\n.slider-buttons .slider-button {\n  position: relative;\n  width: 70px;\n  height: 70px;\n  background-color: black;\n  opacity: 0.1;\n}\n\n#prev.slider-button {\n  float: left;\n}\n\n#next.slider-button {\n  float: right;\n}\n\n.transition {\n  transition: 0.7s;\n}\n\n.project-info {\n  box-sizing: border-box;\n  border-top: 3px solid black;\n  color: black;\n  padding: 35px 60px 90px 25px;\n  text-align: left;\n}\n\n.project-info .title {\n  font-size: 24px;\n  font-weight: bold;\n}\n\n.project-info .info {\n  font-size: 18px;\n  padding: 5px 0px 10px 0px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  color: #c0c0c0;\n}\n\n.project-info .details {\n  font-size: 16px;\n  margin-top: 20px;\n}\n\n.modal-button {\n  width: 120px;\n  height: 40px;\n  color: white;\n  background: #168039;\n  position: absolute;\n  bottom: 20px;\n}\n\n.modal i {\n  position: absolute;\n  bottom: 30px;\n  right: 20px;\n}\n\nnav {\n  width: 100%;\n  height: 50px;\n  background-color: #364140;\n  border-bottom: 3px solid #67cc8e;\n  text-align: left;\n  position: absolute;\n  z-index: 99;\n}\n\n@keyframes popDown {\n  from {\n    transform: translateY(-100%);\n  }\n\n  to {\n    transform: translateY(0%);\n  }\n}\n\n.fixed-nav div nav {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 100;\n  animation: popDown 0.5s;\n}\n\nnav .link-wrap {\n  max-width: 1200px;\n  width: 100%;\n  height: 0;\n  background-color: #333;\n  overflow-x: hidden;\n  position: absolute;\n  top: 53px;\n  z-index: 99;\n  transition: height 0.4s ease-out;\n}\n\nnav .link-wrap.visible {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: flex-start;\n  height: 220px;\n}\n\nnav .link-wrap div {\n  cursor: pointer;\n  font-size: 16px;\n  padding: 12px 20px;\n  transition: color 0.5s;\n  text-transform: uppercase;\n}\n\nnav .bar-icon {\n  position: absolute;\n  margin: 0 auto;\n  right: 5vw;\n  z-index: 99;\n}\n\nnav .link-wrap .active {\n  color: #67cc8e;\n}\n\nnav .mobile-link-wrap.visible {\n  display: block;\n}\n\n.section-padding {\n  padding: 100px 0 130px 0;\n}\n\nsection {\n  color: #2a2c2b;\n  line-height: 24px;\n}\n\nsection .container {\n  box-sizing: border-box;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n@keyframes slideInLeft {\n  0% {\n    opacity: 0;\n    transform: translateX(-300px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInRight {\n  0% {\n    opacity: 0;\n    transform: translateX(300px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInUp {\n  0% {\n    opacity: 0;\n    transform: translateY(150px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes flipInX {\n  0% {\n    animation-timing-function: ease-in;\n    opacity: 0;\n    transform: perspective(400px) rotateY(90deg);\n  }\n  40% {\n    animation-timing-function: ease-in;\n    transform: perspective(400px) rotateY(-20deg);\n  }\n  60% {\n    opacity: 1;\n    transform: perspective(400px) rotateY(10deg);\n  }\n  80% {\n    opacity: 1;\n    transform: perspective(400px) rotateY(5deg);\n  }\n  100% {\n    opacity: 1;\n    transform: perspective(400px);\n  }\n}\n\n@keyframes fadeIn {\n  100% {\n    opacity: 1;\n  }\n}\n\n.slide-in-left {\n  animation: slideInLeft 0.75s ease both;\n}\n\n.slide-in-right {\n  animation: slideInRight 0.75s ease both;\n}\n\n.flip-in-x {\n  animation: flipInX 0.75s ease both;\n}\n\n.fade-in {\n  animation: fadeIn 0.75s ease both;\n}\n\n.slide-in-up {\n  animation: slideInUp 1.75s ease both;\n}\n\n.waypoint {\n  opacity: 0;\n}\n\n.container .header {\n  font-size: 32px;\n  font-weight: bold;\n}\n\n.header {\n  color: #2a2c2b;\n}\n\n.header-bar {\n  background-color: #2a2c2b;\n  width: 70px;\n  height: 4px;\n  margin: 25px 0 70px 0;\n}\n\n.bullet-wrap {\n  height: 230px;\n  padding: 0 10px;\n  justify-content: flex-start;\n}\n\n.bullet-label {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 15px 0 5px 0;\n}\n\n.diamond {\n  width: 0;\n  height: 0;\n  border: 50px solid transparent;\n  border-bottom-color: #67cc8e;\n  position: relative;\n  top: -50px;\n}\n.diamond:after {\n  content: \"\";\n  position: absolute;\n  left: -50px;\n  top: 50px;\n  width: 0;\n  height: 0;\n  border: 50px solid transparent;\n  border-top-color: #67cc8e;\n}\n\n.label-wrap {\n  justify-content: center;\n}\n\n.skills-wrapper {\n  margin-top: 50px;\n}\n\n.personal-picture {\n  width: 200px;\n  height: 200px;\n}\n\n.bio-label {\n  font-size: 24px;\n  font-weight: bold;\n  margin: 20px 0 15px 0;\n}\n\n.bio-text {\n  font-size: 16px;\n  line-height: 26px;\n  padding: 0 10px 20px 10px;\n  text-align: center;\n  color: #616161;\n}\n\n.tech-wrapper {\n  flex-wrap: wrap;\n}\n\n.tech-wrapper img {\n  width: 100px;\n  height: 100px;\n  padding: 10px 20px;\n}\n\n.tech-wrapper :nth-child(9) {\n  width: 150px;\n  padding: 0;\n}\n\n#portfolio {\n  background: #f5f5f5;\n}\n\n.project {\n  position: relative;\n}\n\n.card {\n  width: 430px;\n  height: 320px;\n  opacity: 1;\n  transition: opacity 0.5s;\n  background-repeat: no-repeat;\n  background-size: cover;\n  border: 2px solid black;\n}\n\n#portfolio #projects :nth-child(1) .card {\n  background: url(\"./assets/images/jsleeve-photo.PNG\") center center/cover;\n}\n\n#portfolio #projects :nth-child(2) .card {\n  background: url(\"./assets/images/fruition-image.PNG\") center center/cover;\n}\n\n#portfolio #projects .project:hover .card {\n  opacity: 0;\n  transition: opacity 0.5s;\n}\n\n#portfolio #projects .project .text {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  transition: all 0.3s ease-in-out;\n  opacity: 0;\n  z-index: 2;\n}\n\n#portfolio #projects .project:hover .text {\n  opacity: 1;\n  top: 24%;\n}\n\n#portfolio #projects .project .button {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  border: 2px solid black;\n  font-size: 16px;\n  width: 170px;\n  padding: 7px 0;\n  margin: 0 auto;\n  transition: all 0.3s ease-in-out;\n  opacity: 0;\n  z-index: 2;\n}\n\n#portfolio #projects .project:hover .button {\n  opacity: 1;\n  bottom: 24%;\n}\n\n.medium-green {\n  color: #67cc8e;\n}\n\n#contact {\n  background: #252934;\n  color: white;\n}\n\n#contact .header {\n  color: white;\n}\n\n#contact .header-bar {\n  background: white;\n  margin: 25px 0 40px 0;\n  width: 110px;\n}\n\n#contact form {\n  min-width: 500px;\n  margin: 40px auto 0 auto;\n}\n\n#contact input[type=\"text\"],\n#contact input[type=\"email\"],\n#contact textarea {\n  background: #1e242c;\n  border: 0;\n  box-sizing: border-box;\n  color: white;\n  display: block;\n  font-size: 16px;\n  margin-bottom: 3px;\n  padding: 10px 15px;\n  width: 100%;\n}\n\n#contact textarea {\n  margin-bottom: 5px;\n  min-height: 150px;\n}\n\n#contact .button {\n  background: transparent;\n  color: white;\n  float: right;\n  font-size: 16px;\n  padding: 10px 30px;\n  outline: 0;\n  margin: 5px 0 0 0;\n}\n\n#contact .confirm {\n  float: right;\n  font-size: 14px;\n  padding: 10px 30px;\n  margin: 5px 0 0 0;\n}\n\n#contact .confirm.success {\n  color: green;\n}\n\n#contact .confirm.error {\n  color: red;\n}\n\n#contact i {\n  opacity: 0;\n  padding: 10px 30px;\n  margin: 10px 0 0 0;\n}\n\n#contact i.pending {\n  opacity: 1;\n}\n\n@keyframes grow {\n  0% {\n    opacity: 1;\n    transform: scale(0);\n  }\n  50% {\n    transform: scale(1.2);\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n\n.grow {\n  animation: grow 1s ease both;\n}\n\nfooter {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: #1b242f;\n  padding: 70px 0 50px 0;\n  position: relative;\n}\n\nfooter #scrollTop {\n  width: 50px;\n  height: 50px;\n  position: absolute;\n  top: -25px;\n  background-color: #67cc8e;\n  cursor: pointer;\n}\n\nfooter #scrollTop i {\n  pointer-events: none;\n}\n\nfooter .icon-wrap {\n  margin: 0 auto;\n}\n\nfooter .icon {\n  width: 50px;\n  height: 60px;\n  background-color: #34373f;\n  margin: 0 15px;\n  overflow: hidden;\n  transform: scale(1);\n  transition: background-color 0.3s, transform 0.5s;\n}\n\nfooter .icon:hover i {\n  animation: slideDown 0.3s;\n}\n\nfooter .icon:hover {\n  transform: scale(0.9);\n  background-color: #67cc8e;\n}\n\n@keyframes slideDown {\n  0% {\n    transform: translateY(-35px);\n  }\n  100% {\n    transform: translateY(0);\n  }\n}\n\n@media screen and (min-width: 600px) {\n  .text {\n    font-size: 32pt;\n    line-height: 36pt;\n  }\n\n  .button {\n    font-size: 21px;\n  }\n\n  nav .link-wrap {\n    background: none;\n    height: initial;\n    overflow: visible;\n    position: initial;\n    text-align: left;\n  }\n\n  nav .link-wrap div {\n    display: inline;\n    font-size: initial;\n    margin: 0 20px;\n    color: white;\n  }\n\n  nav .bar-icon {\n    display: none;\n  }\n\n  section .container {\n    padding: 0 10px;\n  }\n\n  .container .header {\n    font-size: 40px;\n    font-weight: bold;\n  }\n  .bio-wrapper {\n    padding: 0 50px 0 50px;\n    max-width: 50%;\n  }\n  .tech-wrapper {\n    max-width: 50%;\n  }\n}\n\n@media screen and (min-width: 960px) {\n  .row-screen-large {\n    flex-direction: row;\n    padding: 0 15px;\n  }\n}\n\n@media screen and (max-width: 600px) {\n  .text {\n    font-size: 16pt;\n    line-height: 24pt;\n  }\n  .bullet-wrap {\n    height: 200px;\n  }\n  .bullet-label {\n    font-size: 18px;\n  }\n  .bullet-text {\n    font-size: 12px;\n  }\n  #about .header-bar {\n    margin: 25px 0 30px 0;\n  }\n  .diamond {\n    width: 0;\n    height: 0;\n    border: 25px solid transparent;\n    border-bottom-color: #67cc8e;\n    position: relative;\n    top: -25px;\n  }\n  .diamond:after {\n    content: \"\";\n    position: absolute;\n    left: -25px;\n    top: 25px;\n    width: 0;\n    height: 0;\n    border: 25px solid transparent;\n    border-top-color: #67cc8e;\n  }\n  .bio-text {\n    font-size: 12px;\n  }\n  .tech-wrapper img {\n    width: 75px;\n    height: 75px;\n  }\n  .card {\n    width: 100vw;\n    height: 200px;\n    box-sizing: border-box;\n  }\n  .modal-wrap {\n    z-index: 101;\n  }\n  .modal {\n    width: 100vw;\n    height: 100vh;\n  }\n  .slider-wrap {\n    width: 100%;\n    height: 250px;\n  }\n  .slider-view {\n    height: 250px;\n  }\n  .slider {\n    position: relative;\n    left: -700px;\n    width: 10000px;\n  }\n  .slide {\n  }\n\n  .project-info {\n    padding: 15px 40px 20px 15px;\n  }\n\n  .project-info .title {\n    font-size: 24px;\n  }\n\n  .project-info .info {\n    font-size: 16px;\n    padding: 8px 0px 10px 0px;\n  }\n\n  .project-info .details {\n    font-size: 14px;\n    margin-top: 15px;\n  }\n\n  .modal-button {\n    width: 120px;\n    height: 40px;\n    color: white;\n    background: #168039;\n    position: absolute;\n    bottom: 20px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/cssWithMappingToString.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./src/assets/images/fruition-image.PNG":
/*!**********************************************!*\
  !*** ./src/assets/images/fruition-image.PNG ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "assets/images/fruition-image.PNG";

/***/ }),

/***/ "./src/assets/images/jsleeve-photo.PNG":
/*!*********************************************!*\
  !*** ./src/assets/images/jsleeve-photo.PNG ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "assets/images/jsleeve-photo.PNG";

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/assets/fonts/raleway-regular-webfont.woff":
/*!*******************************************************!*\
  !*** ./src/assets/fonts/raleway-regular-webfont.woff ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:font/woff;base64,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";

/***/ }),

/***/ "./src/assets/fonts/raleway-regular-webfont.woff2":
/*!********************************************************!*\
  !*** ./src/assets/fonts/raleway-regular-webfont.woff2 ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = "data:font/woff2;base64,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";

/***/ }),

/***/ "./src/modules/contact.js":
/*!********************************!*\
  !*** ./src/modules/contact.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);


const formSuccess = (element) => {
    element.textContent = "Thank you!";
    element.classList = "confirm success";
}

const formError = (element) => {
    element.textContent = "There was an error, please try again!";
    element.classList = "confirm error";
}

const formPending = (element) => {
    element.classList.add("pending");
};

const removeFormPending = (element) => {
    element.classList.remove("pending");
};

const handlePending = () => {
    const pendingIcon = document.querySelector("#contact i");
    if (pendingIcon.classList.contains("pending")) {
        removeFormPending(pendingIcon);
    } else {
        formPending(pendingIcon);
    }
};


const contact = async () => {
    const myForm = document.getElementById("contact-form");
    myForm.addEventListener("submit", (e) => {
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const message = document.querySelector("#message").value;
        const confirm = document.querySelector(".confirm");
        const pendingIcon = document.querySelector("#contact i");
        e.preventDefault();
        handlePending();
        axios__WEBPACK_IMPORTED_MODULE_0___default()({
            url: "https://formspree.io/f/xzbyzplk",
            method: "post",
            headers: {
                "Accept": 'application/json'
            },
            data: {
                name: name,
                email: email,
                message: message
            }
        })
        .then((response) => {
                handlePending();
                formSuccess(confirm); 
        })
        .catch(error => {
                handlePending();
                formError(confirm);
        });
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (contact);

/***/ }),

/***/ "./src/modules/fixNav.js":
/*!*******************************!*\
  !*** ./src/modules/fixNav.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const fixNav = () => {
    const nav = document.querySelector('nav');
    const about = document.getElementById('about');
    const topOfAbout = about.offsetTop;

    if (window.scrollY >= topOfAbout + nav.offsetHeight) {
        document.body.classList.add('fixed-nav');
    } else if (window.scrollY <= topOfAbout){
        document.body.classList.remove('fixed-nav');
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fixNav);

/***/ }),

/***/ "./src/modules/modalText.js":
/*!**********************************!*\
  !*** ./src/modules/modalText.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const modalText = {
    fruition: {
        title: "Fruition Tech Labs",
        info: "Business and Technology Commercialization Company",
        details: "Developed using HTML5, CSS3, Javascript, React.js, Bootstrap",
        link: "http://www.fruitiontechlabs.com/#/",
    },
    jsleeve: {
        title: "Synergy Svn",
        info: "Athletic Tech Company",
        details: "Developed using React.js, Next.js, GraphQL, Node.js, PostgreSQL. Design by Brooke Adams",
        link: "https://www.jsleeve.com/",
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modalText);

/***/ }),

/***/ "./src/modules/onScrollInit.js":
/*!*************************************!*\
  !*** ./src/modules/onScrollInit.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const onScrollInit = (elements) => {
    elements.forEach(element => {
        const dataAnimation = element.getAttribute(`data-animation`);
        const dataDelay = element.getAttribute('data-delay');
        window.addEventListener('scroll', () => {
            if (window.scrollY >= element.offsetTop - 550) {
                element.classList.add(dataAnimation);
                element.style = `animation-delay: ${dataDelay}`;
            }
        });
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (onScrollInit);

/***/ }),

/***/ "./src/modules/setHighlightTextEvent.js":
/*!**********************************************!*\
  !*** ./src/modules/setHighlightTextEvent.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const highlightText = (anchor) => {
    const activeLink = document.querySelector("nav .link-wrap .active");
    activeLink.classList.remove("active");

    const newActiveLink = document.querySelector(`nav .link-wrap [data-link="${anchor}"]`);
    newActiveLink.classList.add("active");
}

const setHighlightTextEvent = () => {
    const home = document.getElementById('home');
    const about = document.getElementById('about');
    const portfolio = document.getElementById('portfolio');
    const contact = document.getElementById('contact');

    if (window.scrollY >= home.offsetTop && window.scrollY <= about.offsetTop) {
        highlightText("home");
    }
    if (window.scrollY >= about.offsetTop && window.scrollY <= portfolio.offsetTop) {
        highlightText("about");
    } 
    if (window.scrollY >= portfolio.offsetTop && window.scrollY <= contact.offsetTop) {
        highlightText("portfolio");
    }
    if (window.scrollY >= contact.offsetTop - 200) {
        highlightText("contact");
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setHighlightTextEvent);

/***/ }),

/***/ "./src/modules/setModal.js":
/*!*********************************!*\
  !*** ./src/modules/setModal.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shiftSlide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shiftSlide.js */ "./src/modules/shiftSlide.js");


const setModal = () => {
    const modalWrap = document.querySelector(".modal-wrap");
    modalWrap.classList.add("visible");
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setModal);

/***/ }),

/***/ "./src/modules/setModalEvents.js":
/*!***************************************!*\
  !*** ./src/modules/setModalEvents.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _shiftSlide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shiftSlide.js */ "./src/modules/shiftSlide.js");


const setModalEvents = () => {
    const modalMask = document.querySelector(".mask");
    const modalWrap = document.querySelector(".modal-wrap");
    const closeIcon = document.querySelector(".modal i");
    const nextButton = document.querySelector("#next");
    const prevButton = document.querySelector("#prev");

    const closeModal = () => {
        modalWrap.classList.remove("visible");
    };
    modalMask.addEventListener("click", closeModal);
    closeIcon.addEventListener("click", closeModal);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setModalEvents);

/***/ }),

/***/ "./src/modules/setNavLinksEvents.js":
/*!******************************************!*\
  !*** ./src/modules/setNavLinksEvents.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const scrollToSection = (event) => {
    const destination = document.querySelector(`#${event.target.getAttribute("data-link")}`);
    destination.scrollIntoView({
        behavior: 'smooth',
    });
};

const setNavLinksEvents = () => {
    const navLinks = document.querySelectorAll(".page-link");
    navLinks.forEach(navLink => {
        navLink.addEventListener('click', scrollToSection);
        navLink.addEventListener('click', () => {
            const mobileNavElement = document.querySelector(".link-wrap");
            if (mobileNavElement.classList.contains("visible")) {
                mobileNavElement.classList.remove("visible");
            }
        })
    });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setNavLinksEvents);

/***/ }),

/***/ "./src/modules/setProjectButtons.js":
/*!******************************************!*\
  !*** ./src/modules/setProjectButtons.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modalText_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modalText.js */ "./src/modules/modalText.js");
/* harmony import */ var _setModal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setModal.js */ "./src/modules/setModal.js");



const setProjectInfo = (id) => {
    const projectTitle = document.querySelector(".modal .title");
    projectTitle.innerHTML = _modalText_js__WEBPACK_IMPORTED_MODULE_0__.default[id].title;

    const projectInfo = document.querySelector(".modal .info");
    projectInfo.innerHTML = _modalText_js__WEBPACK_IMPORTED_MODULE_0__.default[id].info;

    const projectDetails = document.querySelector(".modal .details");
    projectDetails.innerHTML = _modalText_js__WEBPACK_IMPORTED_MODULE_0__.default[id].details;

    const projectLink = document.querySelector(".modal .link");
    projectLink.href = _modalText_js__WEBPACK_IMPORTED_MODULE_0__.default[id].link;

    const modalSlides = document.querySelectorAll(".modal .slide");
    modalSlides.forEach((slide, index) => {
        slide.style.background = `url("./assets/images/slides/${id}-slide-${index}.PNG") center center/cover`;
        slide.style.backgroundSize = "cover";
    });
};

const setProjectButtons = () => {
    const projectButtons = document.querySelectorAll(".project-button");
    projectButtons.forEach(button => {
        button.addEventListener("click", _setModal_js__WEBPACK_IMPORTED_MODULE_1__.default);
        button.addEventListener("click", () => {
            setProjectInfo(button.id);
        });
    });
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setProjectButtons);

/***/ }),

/***/ "./src/modules/shiftSlide.js":
/*!***********************************!*\
  !*** ./src/modules/shiftSlide.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const shiftSlide = (direction) => {
    const slider = document.querySelector(".slider");
    slider.classList.add("transition");
    slider.style.transform = `translateX(${direction * 700}px)`;
    console.log("before timeout");
    setTimeout(() => {
        // debugger;
        if (direction == 1) {
            document.querySelector(".slide:first-child").before(document.querySelector(".slide:last-child"));
            console.log("hi");
        } else if (direction == -1) {
            document.querySelector(".slide:last-child").after(document.querySelector(".slide:first-child"));
            console.log("-hi");
        }
        slider.classList.remove("transition");
        slider.style.transform = `translateX(0px)`;
    }, 700);  
}



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shiftSlide);

/***/ }),

/***/ "./src/modules/toggleMobileNav.js":
/*!****************************************!*\
  !*** ./src/modules/toggleMobileNav.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const toggleMobileNav = () => {
    const mobileNavElement = document.querySelector(".link-wrap");
    if (mobileNavElement.classList.contains("visible")) {
        mobileNavElement.classList.remove("visible");
    } else {
        mobileNavElement.classList.add("visible");
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toggleMobileNav);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_setNavLinksEvents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/setNavLinksEvents */ "./src/modules/setNavLinksEvents.js");
/* harmony import */ var _modules_setHighlightTextEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/setHighlightTextEvent */ "./src/modules/setHighlightTextEvent.js");
/* harmony import */ var _modules_onScrollInit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/onScrollInit */ "./src/modules/onScrollInit.js");
/* harmony import */ var _modules_toggleMobileNav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/toggleMobileNav */ "./src/modules/toggleMobileNav.js");
/* harmony import */ var _modules_fixNav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/fixNav */ "./src/modules/fixNav.js");
/* harmony import */ var _modules_setProjectButtons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/setProjectButtons */ "./src/modules/setProjectButtons.js");
/* harmony import */ var _modules_setModalEvents__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/setModalEvents */ "./src/modules/setModalEvents.js");
/* harmony import */ var _modules_shiftSlide__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modules/shiftSlide */ "./src/modules/shiftSlide.js");
/* harmony import */ var _modules_contact__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modules/contact */ "./src/modules/contact.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./style.css */ "./src/style.css");














const nextButton = document.querySelector("#next");
nextButton.addEventListener("click", () => {
    (0,_modules_shiftSlide__WEBPACK_IMPORTED_MODULE_7__.default)(-1);
});
const prevButton = document.querySelector("#prev");
prevButton.addEventListener("click", () => {
    (0,_modules_shiftSlide__WEBPACK_IMPORTED_MODULE_7__.default)(1);
});


window.addEventListener('scroll', _modules_fixNav__WEBPACK_IMPORTED_MODULE_4__.default);
window.addEventListener('scroll', _modules_setHighlightTextEvent__WEBPACK_IMPORTED_MODULE_1__.default);
document.querySelector(".bar-icon").addEventListener("click", _modules_toggleMobileNav__WEBPACK_IMPORTED_MODULE_3__.default);
(0,_modules_onScrollInit__WEBPACK_IMPORTED_MODULE_2__.default)(document.querySelectorAll(".waypoint"));
(0,_modules_setNavLinksEvents__WEBPACK_IMPORTED_MODULE_0__.default)();
(0,_modules_setProjectButtons__WEBPACK_IMPORTED_MODULE_5__.default)();
(0,_modules_setModalEvents__WEBPACK_IMPORTED_MODULE_6__.default)();
(0,_modules_contact__WEBPACK_IMPORTED_MODULE_8__.default)();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9hZGFwdGVycy94aHIuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWwuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsVG9rZW4uanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0F4aW9zLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9JbnRlcmNlcHRvck1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2NyZWF0ZUVycm9yLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9kaXNwYXRjaFJlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvbWVyZ2VDb25maWcuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL3NldHRsZS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2RlZmF1bHRzLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9iaW5kLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29tYmluZVVSTHMuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQXhpb3NFcnJvci5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvaXNVUkxTYW1lT3JpZ2luLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9wYXJzZUhlYWRlcnMuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL3NwcmVhZC5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9hc3NldHMvaW1hZ2VzL2ZydWl0aW9uLWltYWdlLlBORyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9zcmMvYXNzZXRzL2ltYWdlcy9qc2xlZXZlLXBob3RvLlBORyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vc3JjL21vZHVsZXMvZml4TmF2LmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL21vZGFsVGV4dC5qcyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vLi9zcmMvbW9kdWxlcy9vblNjcm9sbEluaXQuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vc3JjL21vZHVsZXMvc2V0SGlnaGxpZ2h0VGV4dEV2ZW50LmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL3NldE1vZGFsLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL3NldE1vZGFsRXZlbnRzLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL3NldE5hdkxpbmtzRXZlbnRzLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL3NldFByb2plY3RCdXR0b25zLmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby8uL3NyYy9tb2R1bGVzL3NoaWZ0U2xpZGUuanMiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vc3JjL21vZHVsZXMvdG9nZ2xlTW9iaWxlTmF2LmpzIiwid2VicGFjazovL215LXBvcnRmb2xpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teS1wb3J0Zm9saW8vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vbXktcG9ydGZvbGlvLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDRGQUF1QyxDOzs7Ozs7Ozs7OztBQ0ExQjs7QUFFYixZQUFZLG1CQUFPLENBQUMscURBQVk7QUFDaEMsYUFBYSxtQkFBTyxD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LGFBQWEsV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksV0FBVyxZQUFZLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxNQUFNLE1BQU0sS0FBSyxVQUFVLFVBQVUsVUFBVSxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLGFBQWEsV0FBVyxPQUFPLEtBQUssS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsWUFBWSxNQUFNLE1BQU0sS0FBSyxLQUFLLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZLE1BQU0sS0FBSyxVQUFVLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxZQUFZLFdBQVcsWUFBWSxNQUFNLEtBQUssWUFBWSxhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsS0FBSyxLQUFLLFVBQVUsWUFBWSxXQUFXLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE9BQU8sS0FBSyxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxPQUFPLEtBQUssVUFBVSxVQUFVLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFlBQVksV0FBVyxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxVQUFVLFVBQVUsWUFBWSxXQUFXLFVBQVUsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxPQUFPLEtBQUssWUFBWSxXQUFXLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sT0FBTyxZQUFZLFdBQVcsWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLGFBQWEsV0FBVyxNQUFNLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxVQUFVLFlBQVksV0FBVyxZQUFZLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxNQUFNLEtBQUssS0FBSyxVQUFVLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksV0FBVyxLQUFLLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksV0FBVyxZQUFZLFdBQVcsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxLQUFLLEtBQUssVUFBVSxZQUFZ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OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esa0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmNEQ7QUFDUTtBQUNsQjtBQUNNO0FBQ2xCO0FBQ3FCO0FBQ0w7QUFDUjtBQUNOO0FBQ25COzs7OztBQUtyQjtBQUNBO0FBQ0EsSUFBSSw0REFBVTtBQUNkLENBQUM7QUFDRDtBQUNBO0FBQ0EsSUFBSSw0REFBVTtBQUNkLENBQUM7OztBQUdELGtDQUFrQyxvREFBTTtBQUN4QyxrQ0FBa0MsbUVBQXFCO0FBQ3ZELDhEQUE4RCw2REFBZTtBQUM3RSw4REFBWTtBQUNaLG1FQUFpQjtBQUNqQixtRUFBaUI7QUFDakIsZ0VBQWM7QUFDZCx5REFBTyxHIiwiZmlsZSI6ImluZGV4LmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHJlYWR5IHN0YXRlXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgaWYgKCFyZXF1ZXN0IHx8IHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSByZXF1ZXN0IGVycm9yZWQgb3V0IGFuZCB3ZSBkaWRuJ3QgZ2V0IGEgcmVzcG9uc2UsIHRoaXMgd2lsbCBiZVxuICAgICAgLy8gaGFuZGxlZCBieSBvbmVycm9yIGluc3RlYWRcbiAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAvLyB3aWxsIHJldHVybiBzdGF0dXMgYXMgMCBldmVuIHRob3VnaCBpdCdzIGEgc3VjY2Vzc2Z1bCByZXF1ZXN0XG4gICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPT09IDAgJiYgIShyZXF1ZXN0LnJlc3BvbnNlVVJMICYmIHJlcXVlc3QucmVzcG9uc2VVUkwuaW5kZXhPZignZmlsZTonKSA9PT0gMCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBQcmVwYXJlIHRoZSByZXNwb25zZVxuICAgICAgdmFyIHJlc3BvbnNlSGVhZGVycyA9ICdnZXRBbGxSZXNwb25zZUhlYWRlcnMnIGluIHJlcXVlc3QgPyBwYXJzZUhlYWRlcnMocmVxdWVzdC5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkgOiBudWxsO1xuICAgICAgdmFyIHJlc3BvbnNlRGF0YSA9ICFjb25maWcucmVzcG9uc2VUeXBlIHx8IGNvbmZpZy5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyA/IHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKHRpbWVvdXRFcnJvck1lc3NhZ2UsIGNvbmZpZywgJ0VDT05OQUJPUlRFRCcsXG4gICAgICAgIHJlcXVlc3QpKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfTtcblxuICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgIC8vIFRoaXMgaXMgb25seSBkb25lIGlmIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50LlxuICAgIC8vIFNwZWNpZmljYWxseSBub3QgaWYgd2UncmUgaW4gYSB3ZWIgd29ya2VyLCBvciByZWFjdC1uYXRpdmUuXG4gICAgaWYgKHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkpIHtcbiAgICAgIC8vIEFkZCB4c3JmIGhlYWRlclxuICAgICAgdmFyIHhzcmZWYWx1ZSA9IChjb25maWcud2l0aENyZWRlbnRpYWxzIHx8IGlzVVJMU2FtZU9yaWdpbihmdWxsUGF0aCkpICYmIGNvbmZpZy54c3JmQ29va2llTmFtZSA/XG4gICAgICAgIGNvb2tpZXMucmVhZChjb25maWcueHNyZkNvb2tpZU5hbWUpIDpcbiAgICAgICAgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoeHNyZlZhbHVlKSB7XG4gICAgICAgIHJlcXVlc3RIZWFkZXJzW2NvbmZpZy54c3JmSGVhZGVyTmFtZV0gPSB4c3JmVmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGhlYWRlcnMgdG8gdGhlIHJlcXVlc3RcbiAgICBpZiAoJ3NldFJlcXVlc3RIZWFkZXInIGluIHJlcXVlc3QpIHtcbiAgICAgIHV0aWxzLmZvckVhY2gocmVxdWVzdEhlYWRlcnMsIGZ1bmN0aW9uIHNldFJlcXVlc3RIZWFkZXIodmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0RGF0YSA9PT0gJ3VuZGVmaW5lZCcgJiYga2V5LnRvTG93ZXJDYXNlKCkgPT09ICdjb250ZW50LXR5cGUnKSB7XG4gICAgICAgICAgLy8gUmVtb3ZlIENvbnRlbnQtVHlwZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICAgICAgICAgIGRlbGV0ZSByZXF1ZXN0SGVhZGVyc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIE90aGVyd2lzZSBhZGQgaGVhZGVyIHRvIHRoZSByZXF1ZXN0XG4gICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIHdpdGhDcmVkZW50aWFscyB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnLndpdGhDcmVkZW50aWFscykpIHtcbiAgICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gISFjb25maWcud2l0aENyZWRlbnRpYWxzO1xuICAgIH1cblxuICAgIC8vIEFkZCByZXNwb25zZVR5cGUgdG8gcmVxdWVzdCBpZiBuZWVkZWRcbiAgICBpZiAoY29uZmlnLnJlc3BvbnNlVHlwZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBFeHBlY3RlZCBET01FeGNlcHRpb24gdGhyb3duIGJ5IGJyb3dzZXJzIG5vdCBjb21wYXRpYmxlIFhNTEh0dHBSZXF1ZXN0IExldmVsIDIuXG4gICAgICAgIC8vIEJ1dCwgdGhpcyBjYW4gYmUgc3VwcHJlc3NlZCBmb3IgJ2pzb24nIHR5cGUgYXMgaXQgY2FuIGJlIHBhcnNlZCBieSBkZWZhdWx0ICd0cmFuc2Zvcm1SZXNwb25zZScgZnVuY3Rpb24uXG4gICAgICAgIGlmIChjb25maWcucmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHByb2dyZXNzIGlmIG5lZWRlZFxuICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vbkRvd25sb2FkUHJvZ3Jlc3MpO1xuICAgIH1cblxuICAgIC8vIE5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB1cGxvYWQgZXZlbnRzXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25VcGxvYWRQcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJyAmJiByZXF1ZXN0LnVwbG9hZCkge1xuICAgICAgcmVxdWVzdC51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBjb25maWcub25VcGxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgICAgLy8gSGFuZGxlIGNhbmNlbGxhdGlvblxuICAgICAgY29uZmlnLmNhbmNlbFRva2VuLnByb21pc2UudGhlbihmdW5jdGlvbiBvbkNhbmNlbGVkKGNhbmNlbCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LmFib3J0KCk7XG4gICAgICAgIHJlamVjdChjYW5jZWwpO1xuICAgICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICAgIHJlcXVlc3QgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXF1ZXN0RGF0YSkge1xuICAgICAgcmVxdWVzdERhdGEgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbmQgdGhlIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQocmVxdWVzdERhdGEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcbnZhciBBeGlvcyA9IHJlcXVpcmUoJy4vY29yZS9BeGlvcycpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9jb3JlL21lcmdlQ29uZmlnJyk7XG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmF1bHRDb25maWcgVGhlIGRlZmF1bHQgY29uZmlnIGZvciB0aGUgaW5zdGFuY2VcbiAqIEByZXR1cm4ge0F4aW9zfSBBIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICovXG5mdW5jdGlvbiBjcmVhdGVJbnN0YW5jZShkZWZhdWx0Q29uZmlnKSB7XG4gIHZhciBjb250ZXh0ID0gbmV3IEF4aW9zKGRlZmF1bHRDb25maWcpO1xuICB2YXIgaW5zdGFuY2UgPSBiaW5kKEF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0LCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGF4aW9zLnByb3RvdHlwZSB0byBpbnN0YW5jZVxuICB1dGlscy5leHRlbmQoaW5zdGFuY2UsIEF4aW9zLnByb3RvdHlwZSwgY29udGV4dCk7XG5cbiAgLy8gQ29weSBjb250ZXh0IHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgY29udGV4dCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG4vLyBDcmVhdGUgdGhlIGRlZmF1bHQgaW5zdGFuY2UgdG8gYmUgZXhwb3J0ZWRcbnZhciBheGlvcyA9IGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRzKTtcblxuLy8gRXhwb3NlIEF4aW9zIGNsYXNzIHRvIGFsbG93IGNsYXNzIGluaGVyaXRhbmNlXG5heGlvcy5BeGlvcyA9IEF4aW9zO1xuXG4vLyBGYWN0b3J5IGZvciBjcmVhdGluZyBuZXcgaW5zdGFuY2VzXG5heGlvcy5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaW5zdGFuY2VDb25maWcpIHtcbiAgcmV0dXJuIGNyZWF0ZUluc3RhbmNlKG1lcmdlQ29uZmlnKGF4aW9zLmRlZmF1bHRzLCBpbnN0YW5jZUNvbmZpZykpO1xufTtcblxuLy8gRXhwb3NlIENhbmNlbCAmIENhbmNlbFRva2VuXG5heGlvcy5DYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWwnKTtcbmF4aW9zLkNhbmNlbFRva2VuID0gcmVxdWlyZSgnLi9jYW5jZWwvQ2FuY2VsVG9rZW4nKTtcbmF4aW9zLmlzQ2FuY2VsID0gcmVxdWlyZSgnLi9jYW5jZWwvaXNDYW5jZWwnKTtcblxuLy8gRXhwb3NlIGFsbC9zcHJlYWRcbmF4aW9zLmFsbCA9IGZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcbmF4aW9zLnNwcmVhZCA9IHJlcXVpcmUoJy4vaGVscGVycy9zcHJlYWQnKTtcblxuLy8gRXhwb3NlIGlzQXhpb3NFcnJvclxuYXhpb3MuaXNBeGlvc0Vycm9yID0gcmVxdWlyZSgnLi9oZWxwZXJzL2lzQXhpb3NFcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF4aW9zO1xuXG4vLyBBbGxvdyB1c2Ugb2YgZGVmYXVsdCBpbXBvcnQgc3ludGF4IGluIFR5cGVTY3JpcHRcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBheGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBBIGBDYW5jZWxgIGlzIGFuIG9iamVjdCB0aGF0IGlzIHRocm93biB3aGVuIGFuIG9wZXJhdGlvbiBpcyBjYW5jZWxlZC5cbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSBUaGUgbWVzc2FnZS5cbiAqL1xuZnVuY3Rpb24gQ2FuY2VsKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn1cblxuQ2FuY2VsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gJ0NhbmNlbCcgKyAodGhpcy5tZXNzYWdlID8gJzogJyArIHRoaXMubWVzc2FnZSA6ICcnKTtcbn07XG5cbkNhbmNlbC5wcm90b3R5cGUuX19DQU5DRUxfXyA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FuY2VsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgQ2FuY2VsID0gcmVxdWlyZSgnLi9DYW5jZWwnKTtcblxuLyoqXG4gKiBBIGBDYW5jZWxUb2tlbmAgaXMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVxdWVzdCBjYW5jZWxsYXRpb24gb2YgYW4gb3BlcmF0aW9uLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY3V0b3IgVGhlIGV4ZWN1dG9yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBDYW5jZWxUb2tlbihleGVjdXRvcikge1xuICBpZiAodHlwZW9mIGV4ZWN1dG9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZXhlY3V0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uLicpO1xuICB9XG5cbiAgdmFyIHJlc29sdmVQcm9taXNlO1xuICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBwcm9taXNlRXhlY3V0b3IocmVzb2x2ZSkge1xuICAgIHJlc29sdmVQcm9taXNlID0gcmVzb2x2ZTtcbiAgfSk7XG5cbiAgdmFyIHRva2VuID0gdGhpcztcbiAgZXhlY3V0b3IoZnVuY3Rpb24gY2FuY2VsKG1lc3NhZ2UpIHtcbiAgICBpZiAodG9rZW4ucmVhc29uKSB7XG4gICAgICAvLyBDYW5jZWxsYXRpb24gaGFzIGFscmVhZHkgYmVlbiByZXF1ZXN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0b2tlbi5yZWFzb24gPSBuZXcgQ2FuY2VsKG1lc3NhZ2UpO1xuICAgIHJlc29sdmVQcm9taXNlKHRva2VuLnJlYXNvbik7XG4gIH0pO1xufVxuXG4vKipcbiAqIFRocm93cyBhIGBDYW5jZWxgIGlmIGNhbmNlbGxhdGlvbiBoYXMgYmVlbiByZXF1ZXN0ZWQuXG4gKi9cbkNhbmNlbFRva2VuLnByb3RvdHlwZS50aHJvd0lmUmVxdWVzdGVkID0gZnVuY3Rpb24gdGhyb3dJZlJlcXVlc3RlZCgpIHtcbiAgaWYgKHRoaXMucmVhc29uKSB7XG4gICAgdGhyb3cgdGhpcy5yZWFzb247XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIG5ldyBgQ2FuY2VsVG9rZW5gIGFuZCBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLFxuICogY2FuY2VscyB0aGUgYENhbmNlbFRva2VuYC5cbiAqL1xuQ2FuY2VsVG9rZW4uc291cmNlID0gZnVuY3Rpb24gc291cmNlKCkge1xuICB2YXIgY2FuY2VsO1xuICB2YXIgdG9rZW4gPSBuZXcgQ2FuY2VsVG9rZW4oZnVuY3Rpb24gZXhlY3V0b3IoYykge1xuICAgIGNhbmNlbCA9IGM7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHRva2VuOiB0b2tlbixcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWxUb2tlbjtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0NhbmNlbCh2YWx1ZSkge1xuICByZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuX19DQU5DRUxfXyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2J1aWxkVVJMJyk7XG52YXIgSW50ZXJjZXB0b3JNYW5hZ2VyID0gcmVxdWlyZSgnLi9JbnRlcmNlcHRvck1hbmFnZXInKTtcbnZhciBkaXNwYXRjaFJlcXVlc3QgPSByZXF1aXJlKCcuL2Rpc3BhdGNoUmVxdWVzdCcpO1xudmFyIG1lcmdlQ29uZmlnID0gcmVxdWlyZSgnLi9tZXJnZUNvbmZpZycpO1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBBeGlvc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZUNvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBBeGlvcyhpbnN0YW5jZUNvbmZpZykge1xuICB0aGlzLmRlZmF1bHRzID0gaW5zdGFuY2VDb25maWc7XG4gIHRoaXMuaW50ZXJjZXB0b3JzID0ge1xuICAgIHJlcXVlc3Q6IG5ldyBJbnRlcmNlcHRvck1hbmFnZXIoKSxcbiAgICByZXNwb25zZTogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpXG4gIH07XG59XG5cbi8qKlxuICogRGlzcGF0Y2ggYSByZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHNwZWNpZmljIGZvciB0aGlzIHJlcXVlc3QgKG1lcmdlZCB3aXRoIHRoaXMuZGVmYXVsdHMpXG4gKi9cbkF4aW9zLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcbiAgLyplc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246MCovXG4gIC8vIEFsbG93IGZvciBheGlvcygnZXhhbXBsZS91cmwnWywgY29uZmlnXSkgYSBsYSBmZXRjaCBBUElcbiAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uZmlnID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIGNvbmZpZy51cmwgPSBhcmd1bWVudHNbMF07XG4gIH0gZWxzZSB7XG4gICAgY29uZmlnID0gY29uZmlnIHx8IHt9O1xuICB9XG5cbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcblxuICAvLyBTZXQgY29uZmlnLm1ldGhvZFxuICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSBjb25maWcubWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0cy5tZXRob2QpIHtcbiAgICBjb25maWcubWV0aG9kID0gdGhpcy5kZWZhdWx0cy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcubWV0aG9kID0gJ2dldCc7XG4gIH1cblxuICAvLyBIb29rIHVwIGludGVyY2VwdG9ycyBtaWRkbGV3YXJlXG4gIHZhciBjaGFpbiA9IFtkaXNwYXRjaFJlcXVlc3QsIHVuZGVmaW5lZF07XG4gIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKGNvbmZpZyk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgY2hhaW4udW5zaGlmdChpbnRlcmNlcHRvci5mdWxmaWxsZWQsIGludGVyY2VwdG9yLnJlamVjdGVkKTtcbiAgfSk7XG5cbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVzcG9uc2UuZm9yRWFjaChmdW5jdGlvbiBwdXNoUmVzcG9uc2VJbnRlcmNlcHRvcnMoaW50ZXJjZXB0b3IpIHtcbiAgICBjaGFpbi5wdXNoKGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihjaGFpbi5zaGlmdCgpLCBjaGFpbi5zaGlmdCgpKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuQXhpb3MucHJvdG90eXBlLmdldFVyaSA9IGZ1bmN0aW9uIGdldFVyaShjb25maWcpIHtcbiAgY29uZmlnID0gbWVyZ2VDb25maWcodGhpcy5kZWZhdWx0cywgY29uZmlnKTtcbiAgcmV0dXJuIGJ1aWxkVVJMKGNvbmZpZy51cmwsIGNvbmZpZy5wYXJhbXMsIGNvbmZpZy5wYXJhbXNTZXJpYWxpemVyKS5yZXBsYWNlKC9eXFw/LywgJycpO1xufTtcblxuLy8gUHJvdmlkZSBhbGlhc2VzIGZvciBzdXBwb3J0ZWQgcmVxdWVzdCBtZXRob2RzXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJywgJ29wdGlvbnMnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZE5vRGF0YShtZXRob2QpIHtcbiAgLyplc2xpbnQgZnVuYy1uYW1lczowKi9cbiAgQXhpb3MucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QobWVyZ2VDb25maWcoY29uZmlnIHx8IHt9LCB7XG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgZGF0YTogKGNvbmZpZyB8fCB7fSkuZGF0YVxuICAgIH0pKTtcbiAgfTtcbn0pO1xuXG51dGlscy5mb3JFYWNoKFsncG9zdCcsICdwdXQnLCAncGF0Y2gnXSwgZnVuY3Rpb24gZm9yRWFjaE1ldGhvZFdpdGhEYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQXhpb3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxuZnVuY3Rpb24gSW50ZXJjZXB0b3JNYW5hZ2VyKCkge1xuICB0aGlzLmhhbmRsZXJzID0gW107XG59XG5cbi8qKlxuICogQWRkIGEgbmV3IGludGVyY2VwdG9yIHRvIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bGZpbGxlZCBUaGUgZnVuY3Rpb24gdG8gaGFuZGxlIGB0aGVuYCBmb3IgYSBgUHJvbWlzZWBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlamVjdGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHJlamVjdGAgZm9yIGEgYFByb21pc2VgXG4gKlxuICogQHJldHVybiB7TnVtYmVyfSBBbiBJRCB1c2VkIHRvIHJlbW92ZSBpbnRlcmNlcHRvciBsYXRlclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gIHRoaXMuaGFuZGxlcnMucHVzaCh7XG4gICAgZnVsZmlsbGVkOiBmdWxmaWxsZWQsXG4gICAgcmVqZWN0ZWQ6IHJlamVjdGVkXG4gIH0pO1xuICByZXR1cm4gdGhpcy5oYW5kbGVycy5sZW5ndGggLSAxO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYW4gaW50ZXJjZXB0b3IgZnJvbSB0aGUgc3RhY2tcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgVGhlIElEIHRoYXQgd2FzIHJldHVybmVkIGJ5IGB1c2VgXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUuZWplY3QgPSBmdW5jdGlvbiBlamVjdChpZCkge1xuICBpZiAodGhpcy5oYW5kbGVyc1tpZF0pIHtcbiAgICB0aGlzLmhhbmRsZXJzW2lkXSA9IG51bGw7XG4gIH1cbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCB0aGUgcmVnaXN0ZXJlZCBpbnRlcmNlcHRvcnNcbiAqXG4gKiBUaGlzIG1ldGhvZCBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBza2lwcGluZyBvdmVyIGFueVxuICogaW50ZXJjZXB0b3JzIHRoYXQgbWF5IGhhdmUgYmVjb21lIGBudWxsYCBjYWxsaW5nIGBlamVjdGAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggaW50ZXJjZXB0b3JcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChmbikge1xuICB1dGlscy5mb3JFYWNoKHRoaXMuaGFuZGxlcnMsIGZ1bmN0aW9uIGZvckVhY2hIYW5kbGVyKGgpIHtcbiAgICBpZiAoaCAhPT0gbnVsbCkge1xuICAgICAgZm4oaCk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJjZXB0b3JNYW5hZ2VyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBYnNvbHV0ZVVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvaXNBYnNvbHV0ZVVSTCcpO1xudmFyIGNvbWJpbmVVUkxzID0gcmVxdWlyZSgnLi4vaGVscGVycy9jb21iaW5lVVJMcycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgVVJMIGJ5IGNvbWJpbmluZyB0aGUgYmFzZVVSTCB3aXRoIHRoZSByZXF1ZXN0ZWRVUkwsXG4gKiBvbmx5IHdoZW4gdGhlIHJlcXVlc3RlZFVSTCBpcyBub3QgYWxyZWFkeSBhbiBhYnNvbHV0ZSBVUkwuXG4gKiBJZiB0aGUgcmVxdWVzdFVSTCBpcyBhYnNvbHV0ZSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSByZXF1ZXN0ZWRVUkwgdW50b3VjaGVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVVJMIFRoZSBiYXNlIFVSTFxuICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RlZFVSTCBBYnNvbHV0ZSBvciByZWxhdGl2ZSBVUkwgdG8gY29tYmluZVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIGZ1bGwgcGF0aFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkRnVsbFBhdGgoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKSB7XG4gIGlmIChiYXNlVVJMICYmICFpc0Fic29sdXRlVVJMKHJlcXVlc3RlZFVSTCkpIHtcbiAgICByZXR1cm4gY29tYmluZVVSTHMoYmFzZVVSTCwgcmVxdWVzdGVkVVJMKTtcbiAgfVxuICByZXR1cm4gcmVxdWVzdGVkVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVuaGFuY2VFcnJvciA9IHJlcXVpcmUoJy4vZW5oYW5jZUVycm9yJyk7XG5cbi8qKlxuICogQ3JlYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBtZXNzYWdlLCBjb25maWcsIGVycm9yIGNvZGUsIHJlcXVlc3QgYW5kIHJlc3BvbnNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIFRoZSBlcnJvciBtZXNzYWdlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBjcmVhdGVkIGVycm9yLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICByZXR1cm4gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciB0cmFuc2Zvcm1EYXRhID0gcmVxdWlyZSgnLi90cmFuc2Zvcm1EYXRhJyk7XG52YXIgaXNDYW5jZWwgPSByZXF1aXJlKCcuLi9jYW5jZWwvaXNDYW5jZWwnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2RlZmF1bHRzJyk7XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpIHtcbiAgaWYgKGNvbmZpZy5jYW5jZWxUb2tlbikge1xuICAgIGNvbmZpZy5jYW5jZWxUb2tlbi50aHJvd0lmUmVxdWVzdGVkKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB1c2luZyB0aGUgY29uZmlndXJlZCBhZGFwdGVyLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyB0aGF0IGlzIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0XG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gVGhlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGlzcGF0Y2hSZXF1ZXN0KGNvbmZpZykge1xuICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgLy8gRW5zdXJlIGhlYWRlcnMgZXhpc3RcbiAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcblxuICAvLyBUcmFuc2Zvcm0gcmVxdWVzdCBkYXRhXG4gIGNvbmZpZy5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICBjb25maWcuZGF0YSxcbiAgICBjb25maWcuaGVhZGVycyxcbiAgICBjb25maWcudHJhbnNmb3JtUmVxdWVzdFxuICApO1xuXG4gIC8vIEZsYXR0ZW4gaGVhZGVyc1xuICBjb25maWcuaGVhZGVycyA9IHV0aWxzLm1lcmdlKFxuICAgIGNvbmZpZy5oZWFkZXJzLmNvbW1vbiB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1tjb25maWcubWV0aG9kXSB8fCB7fSxcbiAgICBjb25maWcuaGVhZGVyc1xuICApO1xuXG4gIHV0aWxzLmZvckVhY2goXG4gICAgWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncG9zdCcsICdwdXQnLCAncGF0Y2gnLCAnY29tbW9uJ10sXG4gICAgZnVuY3Rpb24gY2xlYW5IZWFkZXJDb25maWcobWV0aG9kKSB7XG4gICAgICBkZWxldGUgY29uZmlnLmhlYWRlcnNbbWV0aG9kXTtcbiAgICB9XG4gICk7XG5cbiAgdmFyIGFkYXB0ZXIgPSBjb25maWcuYWRhcHRlciB8fCBkZWZhdWx0cy5hZGFwdGVyO1xuXG4gIHJldHVybiBhZGFwdGVyKGNvbmZpZykudGhlbihmdW5jdGlvbiBvbkFkYXB0ZXJSZXNvbHV0aW9uKHJlc3BvbnNlKSB7XG4gICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICByZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YShcbiAgICAgIHJlc3BvbnNlLmRhdGEsXG4gICAgICByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgY29uZmlnLnRyYW5zZm9ybVJlc3BvbnNlXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfSwgZnVuY3Rpb24gb25BZGFwdGVyUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmICghaXNDYW5jZWwocmVhc29uKSkge1xuICAgICAgdGhyb3dJZkNhbmNlbGxhdGlvblJlcXVlc3RlZChjb25maWcpO1xuXG4gICAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgICAgaWYgKHJlYXNvbiAmJiByZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgcmVhc29uLnJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhKFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhLFxuICAgICAgICAgIHJlYXNvbi5yZXNwb25zZS5oZWFkZXJzLFxuICAgICAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChyZWFzb24pO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXBkYXRlIGFuIEVycm9yIHdpdGggdGhlIHNwZWNpZmllZCBjb25maWcsIGVycm9yIGNvZGUsIGFuZCByZXNwb25zZS5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgZXJyb3IgdG8gdXBkYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2RlXSBUaGUgZXJyb3IgY29kZSAoZm9yIGV4YW1wbGUsICdFQ09OTkFCT1JURUQnKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVxdWVzdF0gVGhlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW3Jlc3BvbnNlXSBUaGUgcmVzcG9uc2UuXG4gKiBAcmV0dXJucyB7RXJyb3J9IFRoZSBlcnJvci5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgZXJyb3IuY29uZmlnID0gY29uZmlnO1xuICBpZiAoY29kZSkge1xuICAgIGVycm9yLmNvZGUgPSBjb2RlO1xuICB9XG5cbiAgZXJyb3IucmVxdWVzdCA9IHJlcXVlc3Q7XG4gIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gIGVycm9yLmlzQXhpb3NFcnJvciA9IHRydWU7XG5cbiAgZXJyb3IudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyBTdGFuZGFyZFxuICAgICAgbWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgLy8gTWljcm9zb2Z0XG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgIG51bWJlcjogdGhpcy5udW1iZXIsXG4gICAgICAvLyBNb3ppbGxhXG4gICAgICBmaWxlTmFtZTogdGhpcy5maWxlTmFtZSxcbiAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcbiAgICAgIGNvbHVtbk51bWJlcjogdGhpcy5jb2x1bW5OdW1iZXIsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIC8vIEF4aW9zXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgY29kZTogdGhpcy5jb2RlXG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIGVycm9yO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLyoqXG4gKiBDb25maWctc3BlY2lmaWMgbWVyZ2UtZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhIG5ldyBjb25maWctb2JqZWN0XG4gKiBieSBtZXJnaW5nIHR3byBjb25maWd1cmF0aW9uIG9iamVjdHMgdG9nZXRoZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZzFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBOZXcgb2JqZWN0IHJlc3VsdGluZyBmcm9tIG1lcmdpbmcgY29uZmlnMiB0byBjb25maWcxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VDb25maWcoY29uZmlnMSwgY29uZmlnMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnMiA9IGNvbmZpZzIgfHwge307XG4gIHZhciBjb25maWcgPSB7fTtcblxuICB2YXIgdmFsdWVGcm9tQ29uZmlnMktleXMgPSBbJ3VybCcsICdtZXRob2QnLCAnZGF0YSddO1xuICB2YXIgbWVyZ2VEZWVwUHJvcGVydGllc0tleXMgPSBbJ2hlYWRlcnMnLCAnYXV0aCcsICdwcm94eScsICdwYXJhbXMnXTtcbiAgdmFyIGRlZmF1bHRUb0NvbmZpZzJLZXlzID0gW1xuICAgICdiYXNlVVJMJywgJ3RyYW5zZm9ybVJlcXVlc3QnLCAndHJhbnNmb3JtUmVzcG9uc2UnLCAncGFyYW1zU2VyaWFsaXplcicsXG4gICAgJ3RpbWVvdXQnLCAndGltZW91dE1lc3NhZ2UnLCAnd2l0aENyZWRlbnRpYWxzJywgJ2FkYXB0ZXInLCAncmVzcG9uc2VUeXBlJywgJ3hzcmZDb29raWVOYW1lJyxcbiAgICAneHNyZkhlYWRlck5hbWUnLCAnb25VcGxvYWRQcm9ncmVzcycsICdvbkRvd25sb2FkUHJvZ3Jlc3MnLCAnZGVjb21wcmVzcycsXG4gICAgJ21heENvbnRlbnRMZW5ndGgnLCAnbWF4Qm9keUxlbmd0aCcsICdtYXhSZWRpcmVjdHMnLCAndHJhbnNwb3J0JywgJ2h0dHBBZ2VudCcsXG4gICAgJ2h0dHBzQWdlbnQnLCAnY2FuY2VsVG9rZW4nLCAnc29ja2V0UGF0aCcsICdyZXNwb25zZUVuY29kaW5nJ1xuICBdO1xuICB2YXIgZGlyZWN0TWVyZ2VLZXlzID0gWyd2YWxpZGF0ZVN0YXR1cyddO1xuXG4gIGZ1bmN0aW9uIGdldE1lcmdlZFZhbHVlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHV0aWxzLmlzUGxhaW5PYmplY3QodGFyZ2V0KSAmJiB1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiB1dGlscy5tZXJnZSh7fSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKHV0aWxzLmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5zbGljZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VEZWVwUHJvcGVydGllcyhwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUoY29uZmlnMVtwcm9wXSwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9XG5cbiAgdXRpbHMuZm9yRWFjaCh2YWx1ZUZyb21Db25maWcyS2V5cywgZnVuY3Rpb24gdmFsdWVGcm9tQ29uZmlnMihwcm9wKSB7XG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcyW3Byb3BdKSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcyW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gobWVyZ2VEZWVwUHJvcGVydGllc0tleXMsIG1lcmdlRGVlcFByb3BlcnRpZXMpO1xuXG4gIHV0aWxzLmZvckVhY2goZGVmYXVsdFRvQ29uZmlnMktleXMsIGZ1bmN0aW9uIGRlZmF1bHRUb0NvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfSBlbHNlIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMVtwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMVtwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKGRpcmVjdE1lcmdlS2V5cywgZnVuY3Rpb24gbWVyZ2UocHJvcCkge1xuICAgIGlmIChwcm9wIGluIGNvbmZpZzIpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAocHJvcCBpbiBjb25maWcxKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGF4aW9zS2V5cyA9IHZhbHVlRnJvbUNvbmZpZzJLZXlzXG4gICAgLmNvbmNhdChtZXJnZURlZXBQcm9wZXJ0aWVzS2V5cylcbiAgICAuY29uY2F0KGRlZmF1bHRUb0NvbmZpZzJLZXlzKVxuICAgIC5jb25jYXQoZGlyZWN0TWVyZ2VLZXlzKTtcblxuICB2YXIgb3RoZXJLZXlzID0gT2JqZWN0XG4gICAgLmtleXMoY29uZmlnMSlcbiAgICAuY29uY2F0KE9iamVjdC5rZXlzKGNvbmZpZzIpKVxuICAgIC5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQXhpb3NLZXlzKGtleSkge1xuICAgICAgcmV0dXJuIGF4aW9zS2V5cy5pbmRleE9mKGtleSkgPT09IC0xO1xuICAgIH0pO1xuXG4gIHV0aWxzLmZvckVhY2gob3RoZXJLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNyZWF0ZUVycm9yID0gcmVxdWlyZSgnLi9jcmVhdGVFcnJvcicpO1xuXG4vKipcbiAqIFJlc29sdmUgb3IgcmVqZWN0IGEgUHJvbWlzZSBiYXNlZCBvbiByZXNwb25zZSBzdGF0dXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZSBBIGZ1bmN0aW9uIHRoYXQgcmVzb2x2ZXMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWplY3QgQSBmdW5jdGlvbiB0aGF0IHJlamVjdHMgdGhlIHByb21pc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgVGhlIHJlc3BvbnNlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKSB7XG4gIHZhciB2YWxpZGF0ZVN0YXR1cyA9IHJlc3BvbnNlLmNvbmZpZy52YWxpZGF0ZVN0YXR1cztcbiAgaWYgKCFyZXNwb25zZS5zdGF0dXMgfHwgIXZhbGlkYXRlU3RhdHVzIHx8IHZhbGlkYXRlU3RhdHVzKHJlc3BvbnNlLnN0YXR1cykpIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICByZWplY3QoY3JlYXRlRXJyb3IoXG4gICAgICAnUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAnICsgcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgcmVzcG9uc2UuY29uZmlnLFxuICAgICAgbnVsbCxcbiAgICAgIHJlc3BvbnNlLnJlcXVlc3QsXG4gICAgICByZXNwb25zZVxuICAgICkpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8qKlxuICogVHJhbnNmb3JtIHRoZSBkYXRhIGZvciBhIHJlcXVlc3Qgb3IgYSByZXNwb25zZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIHtBcnJheX0gaGVhZGVycyBUaGUgaGVhZGVycyBmb3IgdGhlIHJlcXVlc3Qgb3IgcmVzcG9uc2VcbiAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb259IGZucyBBIHNpbmdsZSBmdW5jdGlvbiBvciBBcnJheSBvZiBmdW5jdGlvbnNcbiAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0aW5nIHRyYW5zZm9ybWVkIGRhdGFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2Zvcm1EYXRhKGRhdGEsIGhlYWRlcnMsIGZucykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbihkYXRhLCBoZWFkZXJzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgbm9ybWFsaXplSGVhZGVyTmFtZSA9IHJlcXVpcmUoJy4vaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxudmFyIGRlZmF1bHRzID0ge1xuICBhZGFwdGVyOiBnZXREZWZhdWx0QWRhcHRlcigpLFxuXG4gIHRyYW5zZm9ybVJlcXVlc3Q6IFtmdW5jdGlvbiB0cmFuc2Zvcm1SZXF1ZXN0KGRhdGEsIGhlYWRlcnMpIHtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdBY2NlcHQnKTtcbiAgICBub3JtYWxpemVIZWFkZXJOYW1lKGhlYWRlcnMsICdDb250ZW50LVR5cGUnKTtcbiAgICBpZiAodXRpbHMuaXNGb3JtRGF0YShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNBcnJheUJ1ZmZlcihkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzU3RyZWFtKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0ZpbGUoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQmxvYihkYXRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc0FycmF5QnVmZmVyVmlldyhkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGEuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNVUkxTZWFyY2hQYXJhbXMoZGF0YSkpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBkYXRhLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICh1dGlscy5pc09iamVjdChkYXRhKSkge1xuICAgICAgc2V0Q29udGVudFR5cGVJZlVuc2V0KGhlYWRlcnMsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnKTtcbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgfSBjYXRjaCAoZSkgeyAvKiBJZ25vcmUgKi8gfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xuXG4vKmdsb2JhbCB0b1N0cmluZzp0cnVlKi9cblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgd2UncmUgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqXG4gKiBUaGlzIGFsbG93cyBheGlvcyB0byBydW4gaW4gYSB3ZWIgd29ya2VyLCBhbmQgcmVhY3QtbmF0aXZlLlxuICogQm90aCBlbnZpcm9ubWVudHMgc3VwcG9ydCBYTUxIdHRwUmVxdWVzdCwgYnV0IG5vdCBmdWxseSBzdGFuZGFyZCBnbG9iYWxzLlxuICpcbiAqIHdlYiB3b3JrZXJzOlxuICogIHR5cGVvZiB3aW5kb3cgLT4gdW5kZWZpbmVkXG4gKiAgdHlwZW9mIGRvY3VtZW50IC0+IHVuZGVmaW5lZFxuICpcbiAqIHJlYWN0LW5hdGl2ZTpcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnUmVhY3ROYXRpdmUnXG4gKiBuYXRpdmVzY3JpcHRcbiAqICBuYXZpZ2F0b3IucHJvZHVjdCAtPiAnTmF0aXZlU2NyaXB0JyBvciAnTlMnXG4gKi9cbmZ1bmN0aW9uIGlzU3RhbmRhcmRCcm93c2VyRW52KCkge1xuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgKG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOYXRpdmVTY3JpcHQnIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdOUycpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFuIEFycmF5IG9yIGFuIE9iamVjdCBpbnZva2luZyBhIGZ1bmN0aW9uIGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgYG9iamAgaXMgYW4gQXJyYXkgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgcGFzc2luZ1xuICogdGhlIHZhbHVlLCBpbmRleCwgYW5kIGNvbXBsZXRlIGFycmF5IGZvciBlYWNoIGl0ZW0uXG4gKlxuICogSWYgJ29iaicgaXMgYW4gT2JqZWN0IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwga2V5LCBhbmQgY29tcGxldGUgb2JqZWN0IGZvciBlYWNoIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgdG8gaW52b2tlIGZvciBlYWNoIGl0ZW1cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChvYmosIGZuKSB7XG4gIC8vIERvbid0IGJvdGhlciBpZiBubyB2YWx1ZSBwcm92aWRlZFxuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRm9yY2UgYW4gYXJyYXkgaWYgbm90IGFscmVhZHkgc29tZXRoaW5nIGl0ZXJhYmxlXG4gIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICAgIG9iaiA9IFtvYmpdO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgIC8vIEl0ZXJhdGUgb3ZlciBhcnJheSB2YWx1ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGZuLmNhbGwobnVsbCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgb2JqZWN0IGtleXNcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICBmbi5jYWxsKG51bGwsIG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyB2YXJhcmdzIGV4cGVjdGluZyBlYWNoIGFyZ3VtZW50IHRvIGJlIGFuIG9iamVjdCwgdGhlblxuICogaW1tdXRhYmx5IG1lcmdlcyB0aGUgcHJvcGVydGllcyBvZiBlYWNoIG9iamVjdCBhbmQgcmV0dXJucyByZXN1bHQuXG4gKlxuICogV2hlbiBtdWx0aXBsZSBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUga2V5IHRoZSBsYXRlciBvYmplY3QgaW5cbiAqIHRoZSBhcmd1bWVudHMgbGlzdCB3aWxsIHRha2UgcHJlY2VkZW5jZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYGpzXG4gKiB2YXIgcmVzdWx0ID0gbWVyZ2Uoe2ZvbzogMTIzfSwge2ZvbzogNDU2fSk7XG4gKiBjb25zb2xlLmxvZyhyZXN1bHQuZm9vKTsgLy8gb3V0cHV0cyA0NTZcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIE9iamVjdCB0byBtZXJnZVxuICogQHJldHVybnMge09iamVjdH0gUmVzdWx0IG9mIGFsbCBtZXJnZSBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKC8qIG9iajEsIG9iajIsIG9iajMsIC4uLiAqLykge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIGZ1bmN0aW9uIGFzc2lnblZhbHVlKHZhbCwga2V5KSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0W2tleV0pICYmIGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZShyZXN1bHRba2V5XSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSBtZXJnZSh7fSwgdmFsKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWwuc2xpY2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZm9yRWFjaChhcmd1bWVudHNbaV0sIGFzc2lnblZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEV4dGVuZHMgb2JqZWN0IGEgYnkgbXV0YWJseSBhZGRpbmcgdG8gaXQgdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIG9iamVjdCB0byBiZSBleHRlbmRlZFxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIG9iamVjdCB0byBiaW5kIGZ1bmN0aW9uIHRvXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXN1bHRpbmcgdmFsdWUgb2Ygb2JqZWN0IGFcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kKGEsIGIsIHRoaXNBcmcpIHtcbiAgZm9yRWFjaChiLCBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmICh0aGlzQXJnICYmIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFba2V5XSA9IGJpbmQodmFsLCB0aGlzQXJnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYVtrZXldID0gdmFsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIFJlbW92ZSBieXRlIG9yZGVyIG1hcmtlci4gVGhpcyBjYXRjaGVzIEVGIEJCIEJGICh0aGUgVVRGLTggQk9NKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IHdpdGggQk9NXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGNvbnRlbnQgdmFsdWUgd2l0aG91dCBCT01cbiAqL1xuZnVuY3Rpb24gc3RyaXBCT00oY29udGVudCkge1xuICBpZiAoY29udGVudC5jaGFyQ29kZUF0KDApID09PSAweEZFRkYpIHtcbiAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgxKTtcbiAgfVxuICByZXR1cm4gY29udGVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQXJyYXlCdWZmZXI6IGlzQXJyYXlCdWZmZXIsXG4gIGlzQnVmZmVyOiBpc0J1ZmZlcixcbiAgaXNGb3JtRGF0YTogaXNGb3JtRGF0YSxcbiAgaXNBcnJheUJ1ZmZlclZpZXc6IGlzQXJyYXlCdWZmZXJWaWV3LFxuICBpc1N0cmluZzogaXNTdHJpbmcsXG4gIGlzTnVtYmVyOiBpc051bWJlcixcbiAgaXNPYmplY3Q6IGlzT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWQsXG4gIGlzRGF0ZTogaXNEYXRlLFxuICBpc0ZpbGU6IGlzRmlsZSxcbiAgaXNCbG9iOiBpc0Jsb2IsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzU3RyZWFtOiBpc1N0cmVhbSxcbiAgaXNVUkxTZWFyY2hQYXJhbXM6IGlzVVJMU2VhcmNoUGFyYW1zLFxuICBpc1N0YW5kYXJkQnJvd3NlckVudjogaXNTdGFuZGFyZEJyb3dzZXJFbnYsXG4gIGZvckVhY2g6IGZvckVhY2gsXG4gIG1lcmdlOiBtZXJnZSxcbiAgZXh0ZW5kOiBleHRlbmQsXG4gIHRyaW06IHRyaW0sXG4gIHN0cmlwQk9NOiBzdHJpcEJPTVxufTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvY3NzV2l0aE1hcHBpbmdUb1N0cmluZy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyBmcm9tIFwiLi9hc3NldHMvZm9udHMvcmFsZXdheS1yZWd1bGFyLXdlYmZvbnQud29mZjJcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyBmcm9tIFwiLi9hc3NldHMvZm9udHMvcmFsZXdheS1yZWd1bGFyLXdlYmZvbnQud29mZlwiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8yX19fIGZyb20gXCIuL2Fzc2V0cy9pbWFnZXMvanNsZWV2ZS1waG90by5QTkdcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfM19fXyBmcm9tIFwiLi9hc3NldHMvaW1hZ2VzL2ZydWl0aW9uLWltYWdlLlBOR1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMl9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzNfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8zX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qIGh0dHA6Ly9tZXllcndlYi5jb20vZXJpYy90b29scy9jc3MvcmVzZXQvIFxcbiAgIHYyLjAgfCAyMDExMDEyNlxcbiAgIExpY2Vuc2U6IG5vbmUgKHB1YmxpYyBkb21haW4pXFxuKi9cXG5cXG5odG1sLFxcbmJvZHksXFxuZGl2LFxcbnNwYW4sXFxuYXBwbGV0LFxcbm9iamVjdCxcXG5pZnJhbWUsXFxuaDEsXFxuaDIsXFxuaDMsXFxuaDQsXFxuaDUsXFxuaDYsXFxucCxcXG5ibG9ja3F1b3RlLFxcbnByZSxcXG5hLFxcbmFiYnIsXFxuYWNyb255bSxcXG5hZGRyZXNzLFxcbmJpZyxcXG5jaXRlLFxcbmNvZGUsXFxuZGVsLFxcbmRmbixcXG5lbSxcXG5pbWcsXFxuaW5zLFxcbmtiZCxcXG5xLFxcbnMsXFxuc2FtcCxcXG5zbWFsbCxcXG5zdHJpa2UsXFxuc3Ryb25nLFxcbnN1YixcXG5zdXAsXFxudHQsXFxudmFyLFxcbmIsXFxudSxcXG5pLFxcbmNlbnRlcixcXG5kbCxcXG5kdCxcXG5kZCxcXG5vbCxcXG51bCxcXG5saSxcXG5maWVsZHNldCxcXG5mb3JtLFxcbmxhYmVsLFxcbmxlZ2VuZCxcXG50YWJsZSxcXG5jYXB0aW9uLFxcbnRib2R5LFxcbnRmb290LFxcbnRoZWFkLFxcbnRyLFxcbnRoLFxcbnRkLFxcbmFydGljbGUsXFxuYXNpZGUsXFxuY2FudmFzLFxcbmRldGFpbHMsXFxuZW1iZWQsXFxuZmlndXJlLFxcbmZpZ2NhcHRpb24sXFxuZm9vdGVyLFxcbmhlYWRlcixcXG5oZ3JvdXAsXFxubWVudSxcXG5uYXYsXFxub3V0cHV0LFxcbnJ1YnksXFxuc2VjdGlvbixcXG5zdW1tYXJ5LFxcbnRpbWUsXFxubWFyayxcXG5hdWRpbyxcXG52aWRlbyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgZm9udC1zaXplOiAxMDAlO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5zZWN0aW9uIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5ib2R5IHtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5vbCxcXG51bCB7XFxuICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlLFxcbnEge1xcbiAgcXVvdGVzOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlOmJlZm9yZSxcXG5ibG9ja3F1b3RlOmFmdGVyLFxcbnE6YmVmb3JlLFxcbnE6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBjb250ZW50OiBub25lO1xcbn1cXG50YWJsZSB7XFxuICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcbiAgYm9yZGVyLXNwYWNpbmc6IDA7XFxufVxcblxcbi8qICovXFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogXFxcInJhbGV3YXlyZWd1bGFyXFxcIjtcXG4gIHNyYzogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKSBmb3JtYXQoXFxcIndvZmYyXFxcIiksXFxuICAgIHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gKyBcIikgZm9ybWF0KFxcXCJ3b2ZmXFxcIik7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbn1cXG5cXG5ib2R5IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwicmFsZXdheXJlZ3VsYXJcXFwiO1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG5hIHtcXG4gIGNvbG9yOiBpbmhlcml0O1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG4ub3ZlcmZsb3ctd3JhcCB7XFxuICBvdmVyZmxvdy14OiBoaWRkZW47XFxufVxcblxcbiNob21lIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyYTJjMmI7XFxuICBjb2xvcjogd2hpdGU7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4uY2FudmFzIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG59XFxuXFxuI2NhbnZhcyB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG59XFxuXFxuLmZsZXgge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5mbGV4LnJvdyB7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG5cXG4uZmxleC53cmFwIHtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG59XFxuXFxuLnRleHQge1xcbiAgbWFyZ2luOiAwIDAgMjBweCAwO1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuLmhpZ2hsaWdodCB7XFxuICBjb2xvcjogIzk2ZWQ4OTtcXG59XFxuXFxuLmJ1dHRvbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBwYWRkaW5nOiAxMnB4IDUwcHggMTJweCAyMHB4O1xcbiAgYm9yZGVyOiAycHggc29saWQgd2hpdGU7XFxuICBib3gtc2l6aW5nOiBpbmhlcml0O1xcbiAgbWFyZ2luLWJvdHRvbTogNTNweDtcXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uYnV0dG9uOmhvdmVyIHtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxNjgwMzk7XFxuICBib3JkZXI6IDJweCBzb2xpZCAjMTY4MDM5O1xcbn1cXG5cXG4uYnV0dG9uOmhvdmVyIGkge1xcbiAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbn1cXG5cXG4uYnV0dG9uIGkge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgcmlnaHQ6IDIwcHg7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcztcXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4ubW9kYWwtd3JhcCB7XFxuICB3aWR0aDogMTAwdnc7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgei1pbmRleDogMTAwO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5tb2RhbC13cmFwLnZpc2libGUge1xcbiAgcG9pbnRlci1ldmVudHM6IGluaXRpYWw7XFxufVxcblxcbi5tYXNrIHtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC41KTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogMDtcXG4gIHRvcDogMDtcXG4gIG9wYWNpdHk6IDA7XFxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3M7XFxufVxcblxcbi5tb2RhbCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHdpZHRoOiA3MDBweDtcXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xcbiAgb3BhY2l0eTogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLm1vZGFsLXdyYXAudmlzaWJsZSAubWFzayB7XFxuICBvcGFjaXR5OiAxO1xcbiAgei1pbmRleDogMTAxO1xcbn1cXG5cXG4ubW9kYWwtd3JhcC52aXNpYmxlIC5tb2RhbCB7XFxuICBvcGFjaXR5OiAxO1xcbiAgei1pbmRleDogMTAyO1xcbn1cXG5cXG4uc2xpZGVyLXdyYXAge1xcbiAgd2lkdGg6IDcwMHB4O1xcbiAgaGVpZ2h0OiA0NTBweDtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uc2xpZGVyLXZpZXcge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLnNsaWRlciB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBsZWZ0OiAtNzAwcHg7XFxuICB3aWR0aDogMTAwMDBweDtcXG59XFxuXFxuLnNsaWRlIHtcXG4gIHdpZHRoOiA3MDBweDtcXG4gIGhlaWdodDogNDUwcHg7XFxuICBmbG9hdDogbGVmdDtcXG4gIG1hcmdpbjogMHB4O1xcbiAgcGFkZGluZzogMHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uc2xpZGVyLWJ1dHRvbnMge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBib3R0b206IDcwcHg7XFxufVxcblxcbi5zbGlkZXItYnV0dG9ucyAuc2xpZGVyLWJ1dHRvbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB3aWR0aDogNzBweDtcXG4gIGhlaWdodDogNzBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xcbiAgb3BhY2l0eTogMC4xO1xcbn1cXG5cXG4jcHJldi5zbGlkZXItYnV0dG9uIHtcXG4gIGZsb2F0OiBsZWZ0O1xcbn1cXG5cXG4jbmV4dC5zbGlkZXItYnV0dG9uIHtcXG4gIGZsb2F0OiByaWdodDtcXG59XFxuXFxuLnRyYW5zaXRpb24ge1xcbiAgdHJhbnNpdGlvbjogMC43cztcXG59XFxuXFxuLnByb2plY3QtaW5mbyB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgYm9yZGVyLXRvcDogM3B4IHNvbGlkIGJsYWNrO1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgcGFkZGluZzogMzVweCA2MHB4IDkwcHggMjVweDtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxufVxcblxcbi5wcm9qZWN0LWluZm8gLnRpdGxlIHtcXG4gIGZvbnQtc2l6ZTogMjRweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG4ucHJvamVjdC1pbmZvIC5pbmZvIHtcXG4gIGZvbnQtc2l6ZTogMThweDtcXG4gIHBhZGRpbmc6IDVweCAwcHggMTBweCAwcHg7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEpO1xcbiAgY29sb3I6ICNjMGMwYzA7XFxufVxcblxcbi5wcm9qZWN0LWluZm8gLmRldGFpbHMge1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbWFyZ2luLXRvcDogMjBweDtcXG59XFxuXFxuLm1vZGFsLWJ1dHRvbiB7XFxuICB3aWR0aDogMTIwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICBjb2xvcjogd2hpdGU7XFxuICBiYWNrZ3JvdW5kOiAjMTY4MDM5O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAyMHB4O1xcbn1cXG5cXG4ubW9kYWwgaSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDMwcHg7XFxuICByaWdodDogMjBweDtcXG59XFxuXFxubmF2IHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiA1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM2NDE0MDtcXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjNjdjYzhlO1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHotaW5kZXg6IDk5O1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHBvcERvd24ge1xcbiAgZnJvbSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTAwJSk7XFxuICB9XFxuXFxuICB0byB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwJSk7XFxuICB9XFxufVxcblxcbi5maXhlZC1uYXYgZGl2IG5hdiB7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbiAgei1pbmRleDogMTAwO1xcbiAgYW5pbWF0aW9uOiBwb3BEb3duIDAuNXM7XFxufVxcblxcbm5hdiAubGluay13cmFwIHtcXG4gIG1heC13aWR0aDogMTIwMHB4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiA1M3B4O1xcbiAgei1pbmRleDogOTk7XFxuICB0cmFuc2l0aW9uOiBoZWlnaHQgMC40cyBlYXNlLW91dDtcXG59XFxuXFxubmF2IC5saW5rLXdyYXAudmlzaWJsZSB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XFxuICBoZWlnaHQ6IDIyMHB4O1xcbn1cXG5cXG5uYXYgLmxpbmstd3JhcCBkaXYge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgdHJhbnNpdGlvbjogY29sb3IgMC41cztcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxufVxcblxcbm5hdiAuYmFyLWljb24ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICByaWdodDogNXZ3O1xcbiAgei1pbmRleDogOTk7XFxufVxcblxcbm5hdiAubGluay13cmFwIC5hY3RpdmUge1xcbiAgY29sb3I6ICM2N2NjOGU7XFxufVxcblxcbm5hdiAubW9iaWxlLWxpbmstd3JhcC52aXNpYmxlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4uc2VjdGlvbi1wYWRkaW5nIHtcXG4gIHBhZGRpbmc6IDEwMHB4IDAgMTMwcHggMDtcXG59XFxuXFxuc2VjdGlvbiB7XFxuICBjb2xvcjogIzJhMmMyYjtcXG4gIGxpbmUtaGVpZ2h0OiAyNHB4O1xcbn1cXG5cXG5zZWN0aW9uIC5jb250YWluZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIG1heC13aWR0aDogMTIwMHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbkBrZXlmcmFtZXMgc2xpZGVJbkxlZnQge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTMwMHB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgc2xpZGVJblJpZ2h0IHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgc2xpZGVJblVwIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDE1MHB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZmxpcEluWCB7XFxuICAwJSB7XFxuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2UtaW47XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoNDAwcHgpIHJvdGF0ZVkoOTBkZWcpO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbjtcXG4gICAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg0MDBweCkgcm90YXRlWSgtMjBkZWcpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg0MDBweCkgcm90YXRlWSgxMGRlZyk7XFxuICB9XFxuICA4MCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDQwMHB4KSByb3RhdGVZKDVkZWcpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoNDAwcHgpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGZhZGVJbiB7XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG59XFxuXFxuLnNsaWRlLWluLWxlZnQge1xcbiAgYW5pbWF0aW9uOiBzbGlkZUluTGVmdCAwLjc1cyBlYXNlIGJvdGg7XFxufVxcblxcbi5zbGlkZS1pbi1yaWdodCB7XFxuICBhbmltYXRpb246IHNsaWRlSW5SaWdodCAwLjc1cyBlYXNlIGJvdGg7XFxufVxcblxcbi5mbGlwLWluLXgge1xcbiAgYW5pbWF0aW9uOiBmbGlwSW5YIDAuNzVzIGVhc2UgYm90aDtcXG59XFxuXFxuLmZhZGUtaW4ge1xcbiAgYW5pbWF0aW9uOiBmYWRlSW4gMC43NXMgZWFzZSBib3RoO1xcbn1cXG5cXG4uc2xpZGUtaW4tdXAge1xcbiAgYW5pbWF0aW9uOiBzbGlkZUluVXAgMS43NXMgZWFzZSBib3RoO1xcbn1cXG5cXG4ud2F5cG9pbnQge1xcbiAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmNvbnRhaW5lciAuaGVhZGVyIHtcXG4gIGZvbnQtc2l6ZTogMzJweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG4uaGVhZGVyIHtcXG4gIGNvbG9yOiAjMmEyYzJiO1xcbn1cXG5cXG4uaGVhZGVyLWJhciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmEyYzJiO1xcbiAgd2lkdGg6IDcwcHg7XFxuICBoZWlnaHQ6IDRweDtcXG4gIG1hcmdpbjogMjVweCAwIDcwcHggMDtcXG59XFxuXFxuLmJ1bGxldC13cmFwIHtcXG4gIGhlaWdodDogMjMwcHg7XFxuICBwYWRkaW5nOiAwIDEwcHg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxufVxcblxcbi5idWxsZXQtbGFiZWwge1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBtYXJnaW46IDE1cHggMCA1cHggMDtcXG59XFxuXFxuLmRpYW1vbmQge1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXI6IDUwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItYm90dG9tLWNvbG9yOiAjNjdjYzhlO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdG9wOiAtNTBweDtcXG59XFxuLmRpYW1vbmQ6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAtNTBweDtcXG4gIHRvcDogNTBweDtcXG4gIHdpZHRoOiAwO1xcbiAgaGVpZ2h0OiAwO1xcbiAgYm9yZGVyOiA1MHB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXRvcC1jb2xvcjogIzY3Y2M4ZTtcXG59XFxuXFxuLmxhYmVsLXdyYXAge1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5za2lsbHMtd3JhcHBlciB7XFxuICBtYXJnaW4tdG9wOiA1MHB4O1xcbn1cXG5cXG4ucGVyc29uYWwtcGljdHVyZSB7XFxuICB3aWR0aDogMjAwcHg7XFxuICBoZWlnaHQ6IDIwMHB4O1xcbn1cXG5cXG4uYmlvLWxhYmVsIHtcXG4gIGZvbnQtc2l6ZTogMjRweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgbWFyZ2luOiAyMHB4IDAgMTVweCAwO1xcbn1cXG5cXG4uYmlvLXRleHQge1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbGluZS1oZWlnaHQ6IDI2cHg7XFxuICBwYWRkaW5nOiAwIDEwcHggMjBweCAxMHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICM2MTYxNjE7XFxufVxcblxcbi50ZWNoLXdyYXBwZXIge1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4udGVjaC13cmFwcGVyIGltZyB7XFxuICB3aWR0aDogMTAwcHg7XFxuICBoZWlnaHQ6IDEwMHB4O1xcbiAgcGFkZGluZzogMTBweCAyMHB4O1xcbn1cXG5cXG4udGVjaC13cmFwcGVyIDpudGgtY2hpbGQoOSkge1xcbiAgd2lkdGg6IDE1MHB4O1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuI3BvcnRmb2xpbyB7XFxuICBiYWNrZ3JvdW5kOiAjZjVmNWY1O1xcbn1cXG5cXG4ucHJvamVjdCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5jYXJkIHtcXG4gIHdpZHRoOiA0MzBweDtcXG4gIGhlaWdodDogMzIwcHg7XFxuICBvcGFjaXR5OiAxO1xcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcXG59XFxuXFxuI3BvcnRmb2xpbyAjcHJvamVjdHMgOm50aC1jaGlsZCgxKSAuY2FyZCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fICsgXCIpIGNlbnRlciBjZW50ZXIvY292ZXI7XFxufVxcblxcbiNwb3J0Zm9saW8gI3Byb2plY3RzIDpudGgtY2hpbGQoMikgLmNhcmQge1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fXyArIFwiKSBjZW50ZXIgY2VudGVyL2NvdmVyO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdDpob3ZlciAuY2FyZCB7XFxuICBvcGFjaXR5OiAwO1xcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdCAudGV4dCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAwO1xcbiAgdG9wOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlLWluLW91dDtcXG4gIG9wYWNpdHk6IDA7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdDpob3ZlciAudGV4dCB7XFxuICBvcGFjaXR5OiAxO1xcbiAgdG9wOiAyNCU7XFxufVxcblxcbiNwb3J0Zm9saW8gI3Byb2plY3RzIC5wcm9qZWN0IC5idXR0b24ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICB3aWR0aDogMTcwcHg7XFxuICBwYWRkaW5nOiA3cHggMDtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XFxuICBvcGFjaXR5OiAwO1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuI3BvcnRmb2xpbyAjcHJvamVjdHMgLnByb2plY3Q6aG92ZXIgLmJ1dHRvbiB7XFxuICBvcGFjaXR5OiAxO1xcbiAgYm90dG9tOiAyNCU7XFxufVxcblxcbi5tZWRpdW0tZ3JlZW4ge1xcbiAgY29sb3I6ICM2N2NjOGU7XFxufVxcblxcbiNjb250YWN0IHtcXG4gIGJhY2tncm91bmQ6ICMyNTI5MzQ7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbiNjb250YWN0IC5oZWFkZXIge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jY29udGFjdCAuaGVhZGVyLWJhciB7XFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcXG4gIG1hcmdpbjogMjVweCAwIDQwcHggMDtcXG4gIHdpZHRoOiAxMTBweDtcXG59XFxuXFxuI2NvbnRhY3QgZm9ybSB7XFxuICBtaW4td2lkdGg6IDUwMHB4O1xcbiAgbWFyZ2luOiA0MHB4IGF1dG8gMCBhdXRvO1xcbn1cXG5cXG4jY29udGFjdCBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0sXFxuI2NvbnRhY3QgaW5wdXRbdHlwZT1cXFwiZW1haWxcXFwiXSxcXG4jY29udGFjdCB0ZXh0YXJlYSB7XFxuICBiYWNrZ3JvdW5kOiAjMWUyNDJjO1xcbiAgYm9yZGVyOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbWFyZ2luLWJvdHRvbTogM3B4O1xcbiAgcGFkZGluZzogMTBweCAxNXB4O1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbiNjb250YWN0IHRleHRhcmVhIHtcXG4gIG1hcmdpbi1ib3R0b206IDVweDtcXG4gIG1pbi1oZWlnaHQ6IDE1MHB4O1xcbn1cXG5cXG4jY29udGFjdCAuYnV0dG9uIHtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgcGFkZGluZzogMTBweCAzMHB4O1xcbiAgb3V0bGluZTogMDtcXG4gIG1hcmdpbjogNXB4IDAgMCAwO1xcbn1cXG5cXG4jY29udGFjdCAuY29uZmlybSB7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICBtYXJnaW46IDVweCAwIDAgMDtcXG59XFxuXFxuI2NvbnRhY3QgLmNvbmZpcm0uc3VjY2VzcyB7XFxuICBjb2xvcjogZ3JlZW47XFxufVxcblxcbiNjb250YWN0IC5jb25maXJtLmVycm9yIHtcXG4gIGNvbG9yOiByZWQ7XFxufVxcblxcbiNjb250YWN0IGkge1xcbiAgb3BhY2l0eTogMDtcXG4gIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gIG1hcmdpbjogMTBweCAwIDAgMDtcXG59XFxuXFxuI2NvbnRhY3QgaS5wZW5kaW5nIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbkBrZXlmcmFtZXMgZ3JvdyB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG59XFxuXFxuLmdyb3cge1xcbiAgYW5pbWF0aW9uOiBncm93IDFzIGVhc2UgYm90aDtcXG59XFxuXFxuZm9vdGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kOiAjMWIyNDJmO1xcbiAgcGFkZGluZzogNzBweCAwIDUwcHggMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuZm9vdGVyICNzY3JvbGxUb3Age1xcbiAgd2lkdGg6IDUwcHg7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IC0yNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY3Y2M4ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuZm9vdGVyICNzY3JvbGxUb3AgaSB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuZm9vdGVyIC5pY29uLXdyYXAge1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbmZvb3RlciAuaWNvbiB7XFxuICB3aWR0aDogNTBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzNDM3M2Y7XFxuICBtYXJnaW46IDAgMTVweDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzLCB0cmFuc2Zvcm0gMC41cztcXG59XFxuXFxuZm9vdGVyIC5pY29uOmhvdmVyIGkge1xcbiAgYW5pbWF0aW9uOiBzbGlkZURvd24gMC4zcztcXG59XFxuXFxuZm9vdGVyIC5pY29uOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2N2NjOGU7XFxufVxcblxcbkBrZXlmcmFtZXMgc2xpZGVEb3duIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zNXB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDYwMHB4KSB7XFxuICAudGV4dCB7XFxuICAgIGZvbnQtc2l6ZTogMzJwdDtcXG4gICAgbGluZS1oZWlnaHQ6IDM2cHQ7XFxuICB9XFxuXFxuICAuYnV0dG9uIHtcXG4gICAgZm9udC1zaXplOiAyMXB4O1xcbiAgfVxcblxcbiAgbmF2IC5saW5rLXdyYXAge1xcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xcbiAgICBoZWlnaHQ6IGluaXRpYWw7XFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgICBwb3NpdGlvbjogaW5pdGlhbDtcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIH1cXG5cXG4gIG5hdiAubGluay13cmFwIGRpdiB7XFxuICAgIGRpc3BsYXk6IGlubGluZTtcXG4gICAgZm9udC1zaXplOiBpbml0aWFsO1xcbiAgICBtYXJnaW46IDAgMjBweDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgfVxcblxcbiAgbmF2IC5iYXItaWNvbiB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICBzZWN0aW9uIC5jb250YWluZXIge1xcbiAgICBwYWRkaW5nOiAwIDEwcHg7XFxuICB9XFxuXFxuICAuY29udGFpbmVyIC5oZWFkZXIge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgfVxcbiAgLmJpby13cmFwcGVyIHtcXG4gICAgcGFkZGluZzogMCA1MHB4IDAgNTBweDtcXG4gICAgbWF4LXdpZHRoOiA1MCU7XFxuICB9XFxuICAudGVjaC13cmFwcGVyIHtcXG4gICAgbWF4LXdpZHRoOiA1MCU7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDk2MHB4KSB7XFxuICAucm93LXNjcmVlbi1sYXJnZSB7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIHBhZGRpbmc6IDAgMTVweDtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gIC50ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxNnB0O1xcbiAgICBsaW5lLWhlaWdodDogMjRwdDtcXG4gIH1cXG4gIC5idWxsZXQtd3JhcCB7XFxuICAgIGhlaWdodDogMjAwcHg7XFxuICB9XFxuICAuYnVsbGV0LWxhYmVsIHtcXG4gICAgZm9udC1zaXplOiAxOHB4O1xcbiAgfVxcbiAgLmJ1bGxldC10ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcbiAgfVxcbiAgI2Fib3V0IC5oZWFkZXItYmFyIHtcXG4gICAgbWFyZ2luOiAyNXB4IDAgMzBweCAwO1xcbiAgfVxcbiAgLmRpYW1vbmQge1xcbiAgICB3aWR0aDogMDtcXG4gICAgaGVpZ2h0OiAwO1xcbiAgICBib3JkZXI6IDI1cHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICM2N2NjOGU7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdG9wOiAtMjVweDtcXG4gIH1cXG4gIC5kaWFtb25kOmFmdGVyIHtcXG4gICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgbGVmdDogLTI1cHg7XFxuICAgIHRvcDogMjVweDtcXG4gICAgd2lkdGg6IDA7XFxuICAgIGhlaWdodDogMDtcXG4gICAgYm9yZGVyOiAyNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNjdjYzhlO1xcbiAgfVxcbiAgLmJpby10ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcbiAgfVxcbiAgLnRlY2gtd3JhcHBlciBpbWcge1xcbiAgICB3aWR0aDogNzVweDtcXG4gICAgaGVpZ2h0OiA3NXB4O1xcbiAgfVxcbiAgLmNhcmQge1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGhlaWdodDogMjAwcHg7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB9XFxuICAubW9kYWwtd3JhcCB7XFxuICAgIHotaW5kZXg6IDEwMTtcXG4gIH1cXG4gIC5tb2RhbCB7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gIH1cXG4gIC5zbGlkZXItd3JhcCB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDI1MHB4O1xcbiAgfVxcbiAgLnNsaWRlci12aWV3IHtcXG4gICAgaGVpZ2h0OiAyNTBweDtcXG4gIH1cXG4gIC5zbGlkZXIge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGxlZnQ6IC03MDBweDtcXG4gICAgd2lkdGg6IDEwMDAwcHg7XFxuICB9XFxuICAuc2xpZGUge1xcbiAgfVxcblxcbiAgLnByb2plY3QtaW5mbyB7XFxuICAgIHBhZGRpbmc6IDE1cHggNDBweCAyMHB4IDE1cHg7XFxuICB9XFxuXFxuICAucHJvamVjdC1pbmZvIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMjRweDtcXG4gIH1cXG5cXG4gIC5wcm9qZWN0LWluZm8gLmluZm8ge1xcbiAgICBmb250LXNpemU6IDE2cHg7XFxuICAgIHBhZGRpbmc6IDhweCAwcHggMTBweCAwcHg7XFxuICB9XFxuXFxuICAucHJvamVjdC1pbmZvIC5kZXRhaWxzIHtcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xcbiAgfVxcblxcbiAgLm1vZGFsLWJ1dHRvbiB7XFxuICAgIHdpZHRoOiAxMjBweDtcXG4gICAgaGVpZ2h0OiA0MHB4O1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGJhY2tncm91bmQ6ICMxNjgwMzk7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgYm90dG9tOiAyMHB4O1xcbiAgfVxcbn1cXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7Q0FHQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBaUZFLFNBQVM7RUFDVCxVQUFVO0VBQ1YsU0FBUztFQUNULGVBQWU7RUFDZixhQUFhO0VBQ2Isd0JBQXdCO0FBQzFCO0FBQ0EsZ0RBQWdEO0FBQ2hEOzs7Ozs7Ozs7OztFQVdFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTs7RUFFRSxnQkFBZ0I7QUFDbEI7QUFDQTs7RUFFRSxZQUFZO0FBQ2Q7QUFDQTs7OztFQUlFLFdBQVc7RUFDWCxhQUFhO0FBQ2Y7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixpQkFBaUI7QUFDbkI7O0FBRUEsSUFBSTs7QUFFSjtFQUNFLDZCQUE2QjtFQUM3QjswREFDbUU7RUFDbkUsbUJBQW1CO0VBQ25CLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQiw2QkFBNkI7RUFDN0IsWUFBWTtBQUNkOztBQUVBO0VBQ0UsY0FBYztFQUNkLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixZQUFZO0VBQ1osYUFBYTtBQUNmOztBQUVBO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLE9BQU87QUFDVDs7QUFFQTtFQUNFLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0Usa0JBQWtCO0VB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VCw4QkFBOEI7SUFDOUIsNEJBQTRCO0lBQzVCLGtCQUFrQjtJQUNsQixVQUFVO0VBQ1o7RUFDQTtJQUNFLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsV0FBVztJQUNYLFNBQVM7SUFDVCxRQUFRO0lBQ1IsU0FBUztJQUNULDhCQUE4QjtJQUM5Qix5QkFBeUI7RUFDM0I7RUFDQTtJQUNFLGVBQWU7RUFDakI7RUFDQTtJQUNFLFdBQVc7SUFDWCxZQUFZO0VBQ2Q7RUFDQTtJQUNFLFlBQVk7SUFDWixhQUFhO0lBQ2Isc0JBQXNCO0VBQ3hCO0VBQ0E7SUFDRSxZQUFZO0VBQ2Q7RUFDQTtJQUNFLFlBQVk7SUFDWixhQUFhO0VBQ2Y7RUFDQTtJQUNFLFdBQVc7SUFDWCxhQUFhO0VBQ2Y7RUFDQTtJQUNFLGFBQWE7RUFDZjtFQUNBO0lBQ0Usa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixjQUFjO0VBQ2hCO0VBQ0E7RUFDQTs7RUFFQTtJQUNFLDRCQUE0QjtFQUM5Qjs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSxlQUFlO0lBQ2YseUJBQXlCO0VBQzNCOztFQUVBO0lBQ0UsZUFBZTtJQUNmLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsWUFBWTtFQUNkO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogaHR0cDovL21leWVyd2ViLmNvbS9lcmljL3Rvb2xzL2Nzcy9yZXNldC8gXFxuICAgdjIuMCB8IDIwMTEwMTI2XFxuICAgTGljZW5zZTogbm9uZSAocHVibGljIGRvbWFpbilcXG4qL1xcblxcbmh0bWwsXFxuYm9keSxcXG5kaXYsXFxuc3BhbixcXG5hcHBsZXQsXFxub2JqZWN0LFxcbmlmcmFtZSxcXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNixcXG5wLFxcbmJsb2NrcXVvdGUsXFxucHJlLFxcbmEsXFxuYWJicixcXG5hY3JvbnltLFxcbmFkZHJlc3MsXFxuYmlnLFxcbmNpdGUsXFxuY29kZSxcXG5kZWwsXFxuZGZuLFxcbmVtLFxcbmltZyxcXG5pbnMsXFxua2JkLFxcbnEsXFxucyxcXG5zYW1wLFxcbnNtYWxsLFxcbnN0cmlrZSxcXG5zdHJvbmcsXFxuc3ViLFxcbnN1cCxcXG50dCxcXG52YXIsXFxuYixcXG51LFxcbmksXFxuY2VudGVyLFxcbmRsLFxcbmR0LFxcbmRkLFxcbm9sLFxcbnVsLFxcbmxpLFxcbmZpZWxkc2V0LFxcbmZvcm0sXFxubGFiZWwsXFxubGVnZW5kLFxcbnRhYmxlLFxcbmNhcHRpb24sXFxudGJvZHksXFxudGZvb3QsXFxudGhlYWQsXFxudHIsXFxudGgsXFxudGQsXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5jYW52YXMsXFxuZGV0YWlscyxcXG5lbWJlZCxcXG5maWd1cmUsXFxuZmlnY2FwdGlvbixcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5tZW51LFxcbm5hdixcXG5vdXRwdXQsXFxucnVieSxcXG5zZWN0aW9uLFxcbnN1bW1hcnksXFxudGltZSxcXG5tYXJrLFxcbmF1ZGlvLFxcbnZpZGVvIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3JkZXI6IDA7XFxuICBmb250LXNpemU6IDEwMCU7XFxuICBmb250OiBpbmhlcml0O1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSxcXG5hc2lkZSxcXG5kZXRhaWxzLFxcbmZpZ2NhcHRpb24sXFxuZmlndXJlLFxcbmZvb3RlcixcXG5oZWFkZXIsXFxuaGdyb3VwLFxcbm1lbnUsXFxubmF2LFxcbnNlY3Rpb24ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcbmJvZHkge1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxufVxcbm9sLFxcbnVsIHtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGUsXFxucSB7XFxuICBxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLFxcbmJsb2NrcXVvdGU6YWZ0ZXIsXFxucTpiZWZvcmUsXFxucTphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGNvbnRlbnQ6IG5vbmU7XFxufVxcbnRhYmxlIHtcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICBib3JkZXItc3BhY2luZzogMDtcXG59XFxuXFxuLyogKi9cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwicmFsZXdheXJlZ3VsYXJcXFwiO1xcbiAgc3JjOiB1cmwoXFxcIi4vYXNzZXRzL2ZvbnRzL3JhbGV3YXktcmVndWxhci13ZWJmb250LndvZmYyXFxcIikgZm9ybWF0KFxcXCJ3b2ZmMlxcXCIpLFxcbiAgICB1cmwoXFxcIi4vYXNzZXRzL2ZvbnRzL3JhbGV3YXktcmVndWxhci13ZWJmb250LndvZmZcXFwiKSBmb3JtYXQoXFxcIndvZmZcXFwiKTtcXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxufVxcblxcbmJvZHkge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJyYWxld2F5cmVndWxhclxcXCI7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbmEge1xcbiAgY29sb3I6IGluaGVyaXQ7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbi5vdmVyZmxvdy13cmFwIHtcXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcXG59XFxuXFxuI2hvbWUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzJhMmMyYjtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcblxcbi5jYW52YXMge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwO1xcbn1cXG5cXG4jY2FudmFzIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG4uZmxleCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuXFxuLmZsZXgucm93IHtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5mbGV4LndyYXAge1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbn1cXG5cXG4udGV4dCB7XFxuICBtYXJnaW46IDAgMCAyMHB4IDA7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uaGlnaGxpZ2h0IHtcXG4gIGNvbG9yOiAjOTZlZDg5O1xcbn1cXG5cXG4uYnV0dG9uIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmc6IDEycHggNTBweCAxMnB4IDIwcHg7XFxuICBib3JkZXI6IDJweCBzb2xpZCB3aGl0ZTtcXG4gIGJveC1zaXppbmc6IGluaGVyaXQ7XFxuICBtYXJnaW4tYm90dG9tOiA1M3B4O1xcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5idXR0b246aG92ZXIge1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzE2ODAzOTtcXG4gIGJvcmRlcjogMnB4IHNvbGlkICMxNjgwMzk7XFxufVxcblxcbi5idXR0b246aG92ZXIgaSB7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxufVxcblxcbi5idXR0b24gaSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICByaWdodDogMjBweDtcXG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5tb2RhbC13cmFwIHtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGhlaWdodDogMTAwdmg7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB6LWluZGV4OiAxMDA7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLm1vZGFsLXdyYXAudmlzaWJsZSB7XFxuICBwb2ludGVyLWV2ZW50czogaW5pdGlhbDtcXG59XFxuXFxuLm1hc2sge1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAwO1xcbiAgdG9wOiAwO1xcbiAgb3BhY2l0eTogMDtcXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcztcXG59XFxuXFxuLm1vZGFsIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgd2lkdGg6IDcwMHB4O1xcbiAgYmFja2dyb3VuZDogd2hpdGU7XFxuICBvcGFjaXR5OiAwO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4ubW9kYWwtd3JhcC52aXNpYmxlIC5tYXNrIHtcXG4gIG9wYWNpdHk6IDE7XFxuICB6LWluZGV4OiAxMDE7XFxufVxcblxcbi5tb2RhbC13cmFwLnZpc2libGUgLm1vZGFsIHtcXG4gIG9wYWNpdHk6IDE7XFxuICB6LWluZGV4OiAxMDI7XFxufVxcblxcbi5zbGlkZXItd3JhcCB7XFxuICB3aWR0aDogNzAwcHg7XFxuICBoZWlnaHQ6IDQ1MHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5zbGlkZXItdmlldyB7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uc2xpZGVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGxlZnQ6IC03MDBweDtcXG4gIHdpZHRoOiAxMDAwMHB4O1xcbn1cXG5cXG4uc2xpZGUge1xcbiAgd2lkdGg6IDcwMHB4O1xcbiAgaGVpZ2h0OiA0NTBweDtcXG4gIGZsb2F0OiBsZWZ0O1xcbiAgbWFyZ2luOiAwcHg7XFxuICBwYWRkaW5nOiAwcHg7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5zbGlkZXItYnV0dG9ucyB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIGJvdHRvbTogNzBweDtcXG59XFxuXFxuLnNsaWRlci1idXR0b25zIC5zbGlkZXItYnV0dG9uIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHdpZHRoOiA3MHB4O1xcbiAgaGVpZ2h0OiA3MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuICBvcGFjaXR5OiAwLjE7XFxufVxcblxcbiNwcmV2LnNsaWRlci1idXR0b24ge1xcbiAgZmxvYXQ6IGxlZnQ7XFxufVxcblxcbiNuZXh0LnNsaWRlci1idXR0b24ge1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbn1cXG5cXG4udHJhbnNpdGlvbiB7XFxuICB0cmFuc2l0aW9uOiAwLjdzO1xcbn1cXG5cXG4ucHJvamVjdC1pbmZvIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBib3JkZXItdG9wOiAzcHggc29saWQgYmxhY2s7XFxuICBjb2xvcjogYmxhY2s7XFxuICBwYWRkaW5nOiAzNXB4IDYwcHggOTBweCAyNXB4O1xcbiAgdGV4dC1hbGlnbjogbGVmdDtcXG59XFxuXFxuLnByb2plY3QtaW5mbyAudGl0bGUge1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5wcm9qZWN0LWluZm8gLmluZm8ge1xcbiAgZm9udC1zaXplOiAxOHB4O1xcbiAgcGFkZGluZzogNXB4IDBweCAxMHB4IDBweDtcXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMSk7XFxuICBjb2xvcjogI2MwYzBjMDtcXG59XFxuXFxuLnByb2plY3QtaW5mbyAuZGV0YWlscyB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBtYXJnaW4tdG9wOiAyMHB4O1xcbn1cXG5cXG4ubW9kYWwtYnV0dG9uIHtcXG4gIHdpZHRoOiAxMjBweDtcXG4gIGhlaWdodDogNDBweDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGJhY2tncm91bmQ6ICMxNjgwMzk7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDIwcHg7XFxufVxcblxcbi5tb2RhbCBpIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvdHRvbTogMzBweDtcXG4gIHJpZ2h0OiAyMHB4O1xcbn1cXG5cXG5uYXYge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzY0MTQwO1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICM2N2NjOGU7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgei1pbmRleDogOTk7XFxufVxcblxcbkBrZXlmcmFtZXMgcG9wRG93biB7XFxuICBmcm9tIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMDAlKTtcXG4gIH1cXG5cXG4gIHRvIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDAlKTtcXG4gIH1cXG59XFxuXFxuLmZpeGVkLW5hdiBkaXYgbmF2IHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIHRvcDogMDtcXG4gIGxlZnQ6IDA7XFxuICB6LWluZGV4OiAxMDA7XFxuICBhbmltYXRpb246IHBvcERvd24gMC41cztcXG59XFxuXFxubmF2IC5saW5rLXdyYXAge1xcbiAgbWF4LXdpZHRoOiAxMjAwcHg7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XFxuICBvdmVyZmxvdy14OiBoaWRkZW47XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUzcHg7XFxuICB6LWluZGV4OiA5OTtcXG4gIHRyYW5zaXRpb246IGhlaWdodCAwLjRzIGVhc2Utb3V0O1xcbn1cXG5cXG5uYXYgLmxpbmstd3JhcC52aXNpYmxlIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG4gIGhlaWdodDogMjIwcHg7XFxufVxcblxcbm5hdiAubGluay13cmFwIGRpdiB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBwYWRkaW5nOiAxMnB4IDIwcHg7XFxuICB0cmFuc2l0aW9uOiBjb2xvciAwLjVzO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG59XFxuXFxubmF2IC5iYXItaWNvbiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIHJpZ2h0OiA1dnc7XFxuICB6LWluZGV4OiA5OTtcXG59XFxuXFxubmF2IC5saW5rLXdyYXAgLmFjdGl2ZSB7XFxuICBjb2xvcjogIzY3Y2M4ZTtcXG59XFxuXFxubmF2IC5tb2JpbGUtbGluay13cmFwLnZpc2libGUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi5zZWN0aW9uLXBhZGRpbmcge1xcbiAgcGFkZGluZzogMTAwcHggMCAxMzBweCAwO1xcbn1cXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjMmEyYzJiO1xcbiAgbGluZS1oZWlnaHQ6IDI0cHg7XFxufVxcblxcbnNlY3Rpb24gLmNvbnRhaW5lciB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgbWF4LXdpZHRoOiAxMjAwcHg7XFxuICBtYXJnaW46IDAgYXV0bztcXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZUluTGVmdCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZUluUmlnaHQge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMzAwcHgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzbGlkZUluVXAge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTUwcHgpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyBmbGlwSW5YIHtcXG4gIDAlIHtcXG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbjtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg0MDBweCkgcm90YXRlWSg5MGRlZyk7XFxuICB9XFxuICA0MCUge1xcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluO1xcbiAgICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDQwMHB4KSByb3RhdGVZKC0yMGRlZyk7XFxuICB9XFxuICA2MCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHBlcnNwZWN0aXZlKDQwMHB4KSByb3RhdGVZKDEwZGVnKTtcXG4gIH1cXG4gIDgwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoNDAwcHgpIHJvdGF0ZVkoNWRlZyk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSg0MDBweCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgZmFkZUluIHtcXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbn1cXG5cXG4uc2xpZGUtaW4tbGVmdCB7XFxuICBhbmltYXRpb246IHNsaWRlSW5MZWZ0IDAuNzVzIGVhc2UgYm90aDtcXG59XFxuXFxuLnNsaWRlLWluLXJpZ2h0IHtcXG4gIGFuaW1hdGlvbjogc2xpZGVJblJpZ2h0IDAuNzVzIGVhc2UgYm90aDtcXG59XFxuXFxuLmZsaXAtaW4teCB7XFxuICBhbmltYXRpb246IGZsaXBJblggMC43NXMgZWFzZSBib3RoO1xcbn1cXG5cXG4uZmFkZS1pbiB7XFxuICBhbmltYXRpb246IGZhZGVJbiAwLjc1cyBlYXNlIGJvdGg7XFxufVxcblxcbi5zbGlkZS1pbi11cCB7XFxuICBhbmltYXRpb246IHNsaWRlSW5VcCAxLjc1cyBlYXNlIGJvdGg7XFxufVxcblxcbi53YXlwb2ludCB7XFxuICBvcGFjaXR5OiAwO1xcbn1cXG5cXG4uY29udGFpbmVyIC5oZWFkZXIge1xcbiAgZm9udC1zaXplOiAzMnB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5oZWFkZXIge1xcbiAgY29sb3I6ICMyYTJjMmI7XFxufVxcblxcbi5oZWFkZXItYmFyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyYTJjMmI7XFxuICB3aWR0aDogNzBweDtcXG4gIGhlaWdodDogNHB4O1xcbiAgbWFyZ2luOiAyNXB4IDAgNzBweCAwO1xcbn1cXG5cXG4uYnVsbGV0LXdyYXAge1xcbiAgaGVpZ2h0OiAyMzBweDtcXG4gIHBhZGRpbmc6IDAgMTBweDtcXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcXG59XFxuXFxuLmJ1bGxldC1sYWJlbCB7XFxuICBmb250LXNpemU6IDI0cHg7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIG1hcmdpbjogMTVweCAwIDVweCAwO1xcbn1cXG5cXG4uZGlhbW9uZCB7XFxuICB3aWR0aDogMDtcXG4gIGhlaWdodDogMDtcXG4gIGJvcmRlcjogNTBweCBzb2xpZCB0cmFuc3BhcmVudDtcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICM2N2NjOGU7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB0b3A6IC01MHB4O1xcbn1cXG4uZGlhbW9uZDphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGxlZnQ6IC01MHB4O1xcbiAgdG9wOiA1MHB4O1xcbiAgd2lkdGg6IDA7XFxuICBoZWlnaHQ6IDA7XFxuICBib3JkZXI6IDUwcHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICBib3JkZXItdG9wLWNvbG9yOiAjNjdjYzhlO1xcbn1cXG5cXG4ubGFiZWwtd3JhcCB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnNraWxscy13cmFwcGVyIHtcXG4gIG1hcmdpbi10b3A6IDUwcHg7XFxufVxcblxcbi5wZXJzb25hbC1waWN0dXJlIHtcXG4gIHdpZHRoOiAyMDBweDtcXG4gIGhlaWdodDogMjAwcHg7XFxufVxcblxcbi5iaW8tbGFiZWwge1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBtYXJnaW46IDIwcHggMCAxNXB4IDA7XFxufVxcblxcbi5iaW8tdGV4dCB7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICBsaW5lLWhlaWdodDogMjZweDtcXG4gIHBhZGRpbmc6IDAgMTBweCAyMHB4IDEwcHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBjb2xvcjogIzYxNjE2MTtcXG59XFxuXFxuLnRlY2gtd3JhcHBlciB7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxufVxcblxcbi50ZWNoLXdyYXBwZXIgaW1nIHtcXG4gIHdpZHRoOiAxMDBweDtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBwYWRkaW5nOiAxMHB4IDIwcHg7XFxufVxcblxcbi50ZWNoLXdyYXBwZXIgOm50aC1jaGlsZCg5KSB7XFxuICB3aWR0aDogMTUwcHg7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4jcG9ydGZvbGlvIHtcXG4gIGJhY2tncm91bmQ6ICNmNWY1ZjU7XFxufVxcblxcbi5wcm9qZWN0IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmNhcmQge1xcbiAgd2lkdGg6IDQzMHB4O1xcbiAgaGVpZ2h0OiAzMjBweDtcXG4gIG9wYWNpdHk6IDE7XFxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXM7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIGJsYWNrO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyA6bnRoLWNoaWxkKDEpIC5jYXJkIHtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiLi9hc3NldHMvaW1hZ2VzL2pzbGVldmUtcGhvdG8uUE5HXFxcIikgY2VudGVyIGNlbnRlci9jb3ZlcjtcXG59XFxuXFxuI3BvcnRmb2xpbyAjcHJvamVjdHMgOm50aC1jaGlsZCgyKSAuY2FyZCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcIi4vYXNzZXRzL2ltYWdlcy9mcnVpdGlvbi1pbWFnZS5QTkdcXFwiKSBjZW50ZXIgY2VudGVyL2NvdmVyO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdDpob3ZlciAuY2FyZCB7XFxuICBvcGFjaXR5OiAwO1xcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdCAudGV4dCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAwO1xcbiAgdG9wOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlLWluLW91dDtcXG4gIG9wYWNpdHk6IDA7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4jcG9ydGZvbGlvICNwcm9qZWN0cyAucHJvamVjdDpob3ZlciAudGV4dCB7XFxuICBvcGFjaXR5OiAxO1xcbiAgdG9wOiAyNCU7XFxufVxcblxcbiNwb3J0Zm9saW8gI3Byb2plY3RzIC5wcm9qZWN0IC5idXR0b24ge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogMDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XFxuICBmb250LXNpemU6IDE2cHg7XFxuICB3aWR0aDogMTcwcHg7XFxuICBwYWRkaW5nOiA3cHggMDtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgZWFzZS1pbi1vdXQ7XFxuICBvcGFjaXR5OiAwO1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuI3BvcnRmb2xpbyAjcHJvamVjdHMgLnByb2plY3Q6aG92ZXIgLmJ1dHRvbiB7XFxuICBvcGFjaXR5OiAxO1xcbiAgYm90dG9tOiAyNCU7XFxufVxcblxcbi5tZWRpdW0tZ3JlZW4ge1xcbiAgY29sb3I6ICM2N2NjOGU7XFxufVxcblxcbiNjb250YWN0IHtcXG4gIGJhY2tncm91bmQ6ICMyNTI5MzQ7XFxuICBjb2xvcjogd2hpdGU7XFxufVxcblxcbiNjb250YWN0IC5oZWFkZXIge1xcbiAgY29sb3I6IHdoaXRlO1xcbn1cXG5cXG4jY29udGFjdCAuaGVhZGVyLWJhciB7XFxuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcXG4gIG1hcmdpbjogMjVweCAwIDQwcHggMDtcXG4gIHdpZHRoOiAxMTBweDtcXG59XFxuXFxuI2NvbnRhY3QgZm9ybSB7XFxuICBtaW4td2lkdGg6IDUwMHB4O1xcbiAgbWFyZ2luOiA0MHB4IGF1dG8gMCBhdXRvO1xcbn1cXG5cXG4jY29udGFjdCBpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0sXFxuI2NvbnRhY3QgaW5wdXRbdHlwZT1cXFwiZW1haWxcXFwiXSxcXG4jY29udGFjdCB0ZXh0YXJlYSB7XFxuICBiYWNrZ3JvdW5kOiAjMWUyNDJjO1xcbiAgYm9yZGVyOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGNvbG9yOiB3aGl0ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbWFyZ2luLWJvdHRvbTogM3B4O1xcbiAgcGFkZGluZzogMTBweCAxNXB4O1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbiNjb250YWN0IHRleHRhcmVhIHtcXG4gIG1hcmdpbi1ib3R0b206IDVweDtcXG4gIG1pbi1oZWlnaHQ6IDE1MHB4O1xcbn1cXG5cXG4jY29udGFjdCAuYnV0dG9uIHtcXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZmxvYXQ6IHJpZ2h0O1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgcGFkZGluZzogMTBweCAzMHB4O1xcbiAgb3V0bGluZTogMDtcXG4gIG1hcmdpbjogNXB4IDAgMCAwO1xcbn1cXG5cXG4jY29udGFjdCAuY29uZmlybSB7XFxuICBmbG9hdDogcmlnaHQ7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxuICBtYXJnaW46IDVweCAwIDAgMDtcXG59XFxuXFxuI2NvbnRhY3QgLmNvbmZpcm0uc3VjY2VzcyB7XFxuICBjb2xvcjogZ3JlZW47XFxufVxcblxcbiNjb250YWN0IC5jb25maXJtLmVycm9yIHtcXG4gIGNvbG9yOiByZWQ7XFxufVxcblxcbiNjb250YWN0IGkge1xcbiAgb3BhY2l0eTogMDtcXG4gIHBhZGRpbmc6IDEwcHggMzBweDtcXG4gIG1hcmdpbjogMTBweCAwIDAgMDtcXG59XFxuXFxuI2NvbnRhY3QgaS5wZW5kaW5nIHtcXG4gIG9wYWNpdHk6IDE7XFxufVxcblxcbkBrZXlmcmFtZXMgZ3JvdyB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgb3BhY2l0eTogMTtcXG4gIH1cXG59XFxuXFxuLmdyb3cge1xcbiAgYW5pbWF0aW9uOiBncm93IDFzIGVhc2UgYm90aDtcXG59XFxuXFxuZm9vdGVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kOiAjMWIyNDJmO1xcbiAgcGFkZGluZzogNzBweCAwIDUwcHggMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuZm9vdGVyICNzY3JvbGxUb3Age1xcbiAgd2lkdGg6IDUwcHg7XFxuICBoZWlnaHQ6IDUwcHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IC0yNXB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzY3Y2M4ZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuZm9vdGVyICNzY3JvbGxUb3AgaSB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuZm9vdGVyIC5pY29uLXdyYXAge1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbmZvb3RlciAuaWNvbiB7XFxuICB3aWR0aDogNTBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzNDM3M2Y7XFxuICBtYXJnaW46IDAgMTVweDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzLCB0cmFuc2Zvcm0gMC41cztcXG59XFxuXFxuZm9vdGVyIC5pY29uOmhvdmVyIGkge1xcbiAgYW5pbWF0aW9uOiBzbGlkZURvd24gMC4zcztcXG59XFxuXFxuZm9vdGVyIC5pY29uOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM2N2NjOGU7XFxufVxcblxcbkBrZXlmcmFtZXMgc2xpZGVEb3duIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zNXB4KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDYwMHB4KSB7XFxuICAudGV4dCB7XFxuICAgIGZvbnQtc2l6ZTogMzJwdDtcXG4gICAgbGluZS1oZWlnaHQ6IDM2cHQ7XFxuICB9XFxuXFxuICAuYnV0dG9uIHtcXG4gICAgZm9udC1zaXplOiAyMXB4O1xcbiAgfVxcblxcbiAgbmF2IC5saW5rLXdyYXAge1xcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xcbiAgICBoZWlnaHQ6IGluaXRpYWw7XFxuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xcbiAgICBwb3NpdGlvbjogaW5pdGlhbDtcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXG4gIH1cXG5cXG4gIG5hdiAubGluay13cmFwIGRpdiB7XFxuICAgIGRpc3BsYXk6IGlubGluZTtcXG4gICAgZm9udC1zaXplOiBpbml0aWFsO1xcbiAgICBtYXJnaW46IDAgMjBweDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgfVxcblxcbiAgbmF2IC5iYXItaWNvbiB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICB9XFxuXFxuICBzZWN0aW9uIC5jb250YWluZXIge1xcbiAgICBwYWRkaW5nOiAwIDEwcHg7XFxuICB9XFxuXFxuICAuY29udGFpbmVyIC5oZWFkZXIge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgfVxcbiAgLmJpby13cmFwcGVyIHtcXG4gICAgcGFkZGluZzogMCA1MHB4IDAgNTBweDtcXG4gICAgbWF4LXdpZHRoOiA1MCU7XFxuICB9XFxuICAudGVjaC13cmFwcGVyIHtcXG4gICAgbWF4LXdpZHRoOiA1MCU7XFxuICB9XFxufVxcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDk2MHB4KSB7XFxuICAucm93LXNjcmVlbi1sYXJnZSB7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIHBhZGRpbmc6IDAgMTVweDtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gIC50ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxNnB0O1xcbiAgICBsaW5lLWhlaWdodDogMjRwdDtcXG4gIH1cXG4gIC5idWxsZXQtd3JhcCB7XFxuICAgIGhlaWdodDogMjAwcHg7XFxuICB9XFxuICAuYnVsbGV0LWxhYmVsIHtcXG4gICAgZm9udC1zaXplOiAxOHB4O1xcbiAgfVxcbiAgLmJ1bGxldC10ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcbiAgfVxcbiAgI2Fib3V0IC5oZWFkZXItYmFyIHtcXG4gICAgbWFyZ2luOiAyNXB4IDAgMzBweCAwO1xcbiAgfVxcbiAgLmRpYW1vbmQge1xcbiAgICB3aWR0aDogMDtcXG4gICAgaGVpZ2h0OiAwO1xcbiAgICBib3JkZXI6IDI1cHggc29saWQgdHJhbnNwYXJlbnQ7XFxuICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICM2N2NjOGU7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgdG9wOiAtMjVweDtcXG4gIH1cXG4gIC5kaWFtb25kOmFmdGVyIHtcXG4gICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgbGVmdDogLTI1cHg7XFxuICAgIHRvcDogMjVweDtcXG4gICAgd2lkdGg6IDA7XFxuICAgIGhlaWdodDogMDtcXG4gICAgYm9yZGVyOiAyNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItdG9wLWNvbG9yOiAjNjdjYzhlO1xcbiAgfVxcbiAgLmJpby10ZXh0IHtcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcbiAgfVxcbiAgLnRlY2gtd3JhcHBlciBpbWcge1xcbiAgICB3aWR0aDogNzVweDtcXG4gICAgaGVpZ2h0OiA3NXB4O1xcbiAgfVxcbiAgLmNhcmQge1xcbiAgICB3aWR0aDogMTAwdnc7XFxuICAgIGhlaWdodDogMjAwcHg7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB9XFxuICAubW9kYWwtd3JhcCB7XFxuICAgIHotaW5kZXg6IDEwMTtcXG4gIH1cXG4gIC5tb2RhbCB7XFxuICAgIHdpZHRoOiAxMDB2dztcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gIH1cXG4gIC5zbGlkZXItd3JhcCB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDI1MHB4O1xcbiAgfVxcbiAgLnNsaWRlci12aWV3IHtcXG4gICAgaGVpZ2h0OiAyNTBweDtcXG4gIH1cXG4gIC5zbGlkZXIge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGxlZnQ6IC03MDBweDtcXG4gICAgd2lkdGg6IDEwMDAwcHg7XFxuICB9XFxuICAuc2xpZGUge1xcbiAgfVxcblxcbiAgLnByb2plY3QtaW5mbyB7XFxuICAgIHBhZGRpbmc6IDE1cHggNDBweCAyMHB4IDE1cHg7XFxuICB9XFxuXFxuICAucHJvamVjdC1pbmZvIC50aXRsZSB7XFxuICAgIGZvbnQtc2l6ZTogMjRweDtcXG4gIH1cXG5cXG4gIC5wcm9qZWN0LWluZm8gLmluZm8ge1xcbiAgICBmb250LXNpemU6IDE2cHg7XFxuICAgIHBhZGRpbmc6IDhweCAwcHggMTBweCAwcHg7XFxuICB9XFxuXFxuICAucHJvamVjdC1pbmZvIC5kZXRhaWxzIHtcXG4gICAgZm9udC1zaXplOiAxNHB4O1xcbiAgICBtYXJnaW4tdG9wOiAxNXB4O1xcbiAgfVxcblxcbiAgLm1vZGFsLWJ1dHRvbiB7XFxuICAgIHdpZHRoOiAxMjBweDtcXG4gICAgaGVpZ2h0OiA0MHB4O1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGJhY2tncm91bmQ6ICMxNjgwMzk7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgYm90dG9tOiAyMHB4O1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcblxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgcmV0dXJuIFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChjb250ZW50LCBcIn1cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiAobW9kdWxlcywgbWVkaWFRdWVyeSwgZGVkdXBlKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IG1vZHVsZXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19pXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udGludWVcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWRpYVF1ZXJ5KSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMl0gPSBcIlwiLmNvbmNhdChtZWRpYVF1ZXJ5LCBcIiBhbmQgXCIpLmNvbmNhdChpdGVtWzJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pIHtcbiAgdmFyIF9pdGVtID0gX3NsaWNlZFRvQXJyYXkoaXRlbSwgNCksXG4gICAgICBjb250ZW50ID0gX2l0ZW1bMV0sXG4gICAgICBjc3NNYXBwaW5nID0gX2l0ZW1bM107XG5cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgXCJcIikuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBvcHRpb25zID0ge307XG4gIH0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlLCBuby1wYXJhbS1yZWFzc2lnblxuXG5cbiAgdXJsID0gdXJsICYmIHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmw7XG5cbiAgaWYgKHR5cGVvZiB1cmwgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9IC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuXG5cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9IC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcblxuXG4gIGlmICgvW1wiJygpIFxcdFxcbl0vLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuXG4gIHJldHVybiB1cmw7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImFzc2V0cy9pbWFnZXMvZnJ1aXRpb24taW1hZ2UuUE5HXCI7IiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYXNzZXRzL2ltYWdlcy9qc2xlZXZlLXBob3RvLlBOR1wiOyIsImltcG9ydCBhcGkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgICAgICAgIGltcG9ydCBjb250ZW50IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuaW5zZXJ0ID0gXCJoZWFkXCI7XG5vcHRpb25zLnNpbmdsZXRvbiA9IGZhbHNlO1xuXG52YXIgdXBkYXRlID0gYXBpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY29udGVudC5sb2NhbHMgfHwge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc09sZElFID0gZnVuY3Rpb24gaXNPbGRJRSgpIHtcbiAgdmFyIG1lbW87XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSgpIHtcbiAgICBpZiAodHlwZW9mIG1lbW8gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuICAgICAgLy8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuICAgICAgLy8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuICAgICAgLy8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcbiAgICAgIG1lbW8gPSBCb29sZWFuKHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcbn0oKTtcblxudmFyIGdldFRhcmdldCA9IGZ1bmN0aW9uIGdldFRhcmdldCgpIHtcbiAgdmFyIG1lbW8gPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lbW9yaXplKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1t0YXJnZXRdO1xuICB9O1xufSgpO1xuXG52YXIgc3R5bGVzSW5Eb20gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRvbS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRvbVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdXG4gICAgfTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNJbkRvbS5wdXNoKHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogYWRkU3R5bGUob2JqLCBvcHRpb25zKSxcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBvcHRpb25zLmF0dHJpYnV0ZXMgfHwge307XG5cbiAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVzLm5vbmNlID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gJ3VuZGVmaW5lZCcgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgICBpZiAobm9uY2UpIHtcbiAgICAgIGF0dHJpYnV0ZXMubm9uY2UgPSBub25jZTtcbiAgICB9XG4gIH1cblxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICB9KTtcblxuICBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5pbnNlcnQoc3R5bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQob3B0aW9ucy5pbnNlcnQgfHwgJ2hlYWQnKTtcblxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICAgIH1cblxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICByZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbnZhciByZXBsYWNlVGV4dCA9IGZ1bmN0aW9uIHJlcGxhY2VUZXh0KCkge1xuICB2YXIgdGV4dFN0b3JlID0gW107XG4gIHJldHVybiBmdW5jdGlvbiByZXBsYWNlKGluZGV4LCByZXBsYWNlbWVudCkge1xuICAgIHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcbiAgICByZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcbiAgfTtcbn0oKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG4gIHZhciBjc3MgPSByZW1vdmUgPyAnJyA6IG9iai5tZWRpYSA/IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIikuY29uY2F0KG9iai5jc3MsIFwifVwiKSA6IG9iai5jc3M7IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZSwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBvYmouY3NzO1xuICB2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChtZWRpYSkge1xuICAgIHN0eWxlLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUucmVtb3ZlQXR0cmlidXRlKCdtZWRpYScpO1xuICB9XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyIHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlO1xuICB2YXIgdXBkYXRlO1xuICB2YXIgcmVtb3ZlO1xuXG4gIGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuICAgIHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuICAgIHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuICAgIHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUgPSBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gICAgdXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblxuICAgIHJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZShvYmopO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307IC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuICAvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cbiAgaWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09ICdib29sZWFuJykge1xuICAgIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuICB9XG5cbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuZXdMaXN0KSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRvbVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5Eb21bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5Eb20uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJpbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcblxyXG5jb25zdCBmb3JtU3VjY2VzcyA9IChlbGVtZW50KSA9PiB7XHJcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gXCJUaGFuayB5b3UhXCI7XHJcbiAgICBlbGVtZW50LmNsYXNzTGlzdCA9IFwiY29uZmlybSBzdWNjZXNzXCI7XHJcbn1cclxuXHJcbmNvbnN0IGZvcm1FcnJvciA9IChlbGVtZW50KSA9PiB7XHJcbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gXCJUaGVyZSB3YXMgYW4gZXJyb3IsIHBsZWFzZSB0cnkgYWdhaW4hXCI7XHJcbiAgICBlbGVtZW50LmNsYXNzTGlzdCA9IFwiY29uZmlybSBlcnJvclwiO1xyXG59XHJcblxyXG5jb25zdCBmb3JtUGVuZGluZyA9IChlbGVtZW50KSA9PiB7XHJcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJwZW5kaW5nXCIpO1xyXG59O1xyXG5cclxuY29uc3QgcmVtb3ZlRm9ybVBlbmRpbmcgPSAoZWxlbWVudCkgPT4ge1xyXG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwicGVuZGluZ1wiKTtcclxufTtcclxuXHJcbmNvbnN0IGhhbmRsZVBlbmRpbmcgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwZW5kaW5nSWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFjdCBpXCIpO1xyXG4gICAgaWYgKHBlbmRpbmdJY29uLmNsYXNzTGlzdC5jb250YWlucyhcInBlbmRpbmdcIikpIHtcclxuICAgICAgICByZW1vdmVGb3JtUGVuZGluZyhwZW5kaW5nSWNvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1QZW5kaW5nKHBlbmRpbmdJY29uKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5jb25zdCBjb250YWN0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgbXlGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWN0LWZvcm1cIik7XHJcbiAgICBteUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hbWVcIikudmFsdWU7XHJcbiAgICAgICAgY29uc3QgZW1haWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VtYWlsXCIpLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lc3NhZ2VcIikudmFsdWU7XHJcbiAgICAgICAgY29uc3QgY29uZmlybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29uZmlybVwiKTtcclxuICAgICAgICBjb25zdCBwZW5kaW5nSWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFjdCBpXCIpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBoYW5kbGVQZW5kaW5nKCk7XHJcbiAgICAgICAgYXhpb3Moe1xyXG4gICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi94emJ5enBsa1wiLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVQZW5kaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBmb3JtU3VjY2Vzcyhjb25maXJtKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlUGVuZGluZygpO1xyXG4gICAgICAgICAgICAgICAgZm9ybUVycm9yKGNvbmZpcm0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb250YWN0OyIsImNvbnN0IGZpeE5hdiA9ICgpID0+IHtcclxuICAgIGNvbnN0IG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpO1xyXG4gICAgY29uc3QgYWJvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWJvdXQnKTtcclxuICAgIGNvbnN0IHRvcE9mQWJvdXQgPSBhYm91dC5vZmZzZXRUb3A7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID49IHRvcE9mQWJvdXQgKyBuYXYub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdmaXhlZC1uYXYnKTtcclxuICAgIH0gZWxzZSBpZiAod2luZG93LnNjcm9sbFkgPD0gdG9wT2ZBYm91dCl7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZC1uYXYnKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZpeE5hdjsiLCJjb25zdCBtb2RhbFRleHQgPSB7XHJcbiAgICBmcnVpdGlvbjoge1xyXG4gICAgICAgIHRpdGxlOiBcIkZydWl0aW9uIFRlY2ggTGFic1wiLFxyXG4gICAgICAgIGluZm86IFwiQnVzaW5lc3MgYW5kIFRlY2hub2xvZ3kgQ29tbWVyY2lhbGl6YXRpb24gQ29tcGFueVwiLFxyXG4gICAgICAgIGRldGFpbHM6IFwiRGV2ZWxvcGVkIHVzaW5nIEhUTUw1LCBDU1MzLCBKYXZhc2NyaXB0LCBSZWFjdC5qcywgQm9vdHN0cmFwXCIsXHJcbiAgICAgICAgbGluazogXCJodHRwOi8vd3d3LmZydWl0aW9udGVjaGxhYnMuY29tLyMvXCIsXHJcbiAgICB9LFxyXG4gICAganNsZWV2ZToge1xyXG4gICAgICAgIHRpdGxlOiBcIlN5bmVyZ3kgU3ZuXCIsXHJcbiAgICAgICAgaW5mbzogXCJBdGhsZXRpYyBUZWNoIENvbXBhbnlcIixcclxuICAgICAgICBkZXRhaWxzOiBcIkRldmVsb3BlZCB1c2luZyBSZWFjdC5qcywgTmV4dC5qcywgR3JhcGhRTCwgTm9kZS5qcywgUG9zdGdyZVNRTC4gRGVzaWduIGJ5IEJyb29rZSBBZGFtc1wiLFxyXG4gICAgICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuanNsZWV2ZS5jb20vXCIsXHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb2RhbFRleHQ7IiwiY29uc3Qgb25TY3JvbGxJbml0ID0gKGVsZW1lbnRzKSA9PiB7XHJcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGFBbmltYXRpb24gPSBlbGVtZW50LmdldEF0dHJpYnV0ZShgZGF0YS1hbmltYXRpb25gKTtcclxuICAgICAgICBjb25zdCBkYXRhRGVsYXkgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1kZWxheScpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+PSBlbGVtZW50Lm9mZnNldFRvcCAtIDU1MCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGRhdGFBbmltYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZSA9IGBhbmltYXRpb24tZGVsYXk6ICR7ZGF0YURlbGF5fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgb25TY3JvbGxJbml0OyIsImNvbnN0IGhpZ2hsaWdodFRleHQgPSAoYW5jaG9yKSA9PiB7XHJcbiAgICBjb25zdCBhY3RpdmVMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm5hdiAubGluay13cmFwIC5hY3RpdmVcIik7XHJcbiAgICBhY3RpdmVMaW5rLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgY29uc3QgbmV3QWN0aXZlTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYG5hdiAubGluay13cmFwIFtkYXRhLWxpbms9XCIke2FuY2hvcn1cIl1gKTtcclxuICAgIG5ld0FjdGl2ZUxpbmsuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxufVxyXG5cclxuY29uc3Qgc2V0SGlnaGxpZ2h0VGV4dEV2ZW50ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaG9tZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdob21lJyk7XHJcbiAgICBjb25zdCBhYm91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhYm91dCcpO1xyXG4gICAgY29uc3QgcG9ydGZvbGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvcnRmb2xpbycpO1xyXG4gICAgY29uc3QgY29udGFjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0Jyk7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID49IGhvbWUub2Zmc2V0VG9wICYmIHdpbmRvdy5zY3JvbGxZIDw9IGFib3V0Lm9mZnNldFRvcCkge1xyXG4gICAgICAgIGhpZ2hsaWdodFRleHQoXCJob21lXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID49IGFib3V0Lm9mZnNldFRvcCAmJiB3aW5kb3cuc2Nyb2xsWSA8PSBwb3J0Zm9saW8ub2Zmc2V0VG9wKSB7XHJcbiAgICAgICAgaGlnaGxpZ2h0VGV4dChcImFib3V0XCIpO1xyXG4gICAgfSBcclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+PSBwb3J0Zm9saW8ub2Zmc2V0VG9wICYmIHdpbmRvdy5zY3JvbGxZIDw9IGNvbnRhY3Qub2Zmc2V0VG9wKSB7XHJcbiAgICAgICAgaGlnaGxpZ2h0VGV4dChcInBvcnRmb2xpb1wiKTtcclxuICAgIH1cclxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWSA+PSBjb250YWN0Lm9mZnNldFRvcCAtIDIwMCkge1xyXG4gICAgICAgIGhpZ2hsaWdodFRleHQoXCJjb250YWN0XCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0SGlnaGxpZ2h0VGV4dEV2ZW50OyIsImltcG9ydCBzaGlmdFNsaWRlIGZyb20gXCIuL3NoaWZ0U2xpZGUuanNcIjtcclxuXHJcbmNvbnN0IHNldE1vZGFsID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbW9kYWxXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbC13cmFwXCIpO1xyXG4gICAgbW9kYWxXcmFwLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzZXRNb2RhbDsiLCJpbXBvcnQgc2hpZnRTbGlkZSBmcm9tIFwiLi9zaGlmdFNsaWRlLmpzXCI7XHJcblxyXG5jb25zdCBzZXRNb2RhbEV2ZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1vZGFsTWFzayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWFza1wiKTtcclxuICAgIGNvbnN0IG1vZGFsV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwtd3JhcFwiKTtcclxuICAgIGNvbnN0IGNsb3NlSWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwgaVwiKTtcclxuICAgIGNvbnN0IG5leHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25leHRcIik7XHJcbiAgICBjb25zdCBwcmV2QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmV2XCIpO1xyXG5cclxuICAgIGNvbnN0IGNsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICAgICAgbW9kYWxXcmFwLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xyXG4gICAgfTtcclxuICAgIG1vZGFsTWFzay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xvc2VNb2RhbCk7XHJcbiAgICBjbG9zZUljb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsb3NlTW9kYWwpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2V0TW9kYWxFdmVudHM7IiwiY29uc3Qgc2Nyb2xsVG9TZWN0aW9uID0gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2V2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWxpbmtcIil9YCk7XHJcbiAgICBkZXN0aW5hdGlvbi5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBzZXROYXZMaW5rc0V2ZW50cyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wYWdlLWxpbmtcIik7XHJcbiAgICBuYXZMaW5rcy5mb3JFYWNoKG5hdkxpbmsgPT4ge1xyXG4gICAgICAgIG5hdkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzY3JvbGxUb1NlY3Rpb24pO1xyXG4gICAgICAgIG5hdkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vYmlsZU5hdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxpbmstd3JhcFwiKTtcclxuICAgICAgICAgICAgaWYgKG1vYmlsZU5hdkVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwidmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgbW9iaWxlTmF2RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNldE5hdkxpbmtzRXZlbnRzOyIsImltcG9ydCBtb2RhbFRleHQgZnJvbSBcIi4vbW9kYWxUZXh0LmpzXCI7XHJcbmltcG9ydCBzZXRNb2RhbCBmcm9tIFwiLi9zZXRNb2RhbC5qc1wiO1xyXG5cclxuY29uc3Qgc2V0UHJvamVjdEluZm8gPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHByb2plY3RUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwgLnRpdGxlXCIpO1xyXG4gICAgcHJvamVjdFRpdGxlLmlubmVySFRNTCA9IG1vZGFsVGV4dFtpZF0udGl0bGU7XHJcblxyXG4gICAgY29uc3QgcHJvamVjdEluZm8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1vZGFsIC5pbmZvXCIpO1xyXG4gICAgcHJvamVjdEluZm8uaW5uZXJIVE1MID0gbW9kYWxUZXh0W2lkXS5pbmZvO1xyXG5cclxuICAgIGNvbnN0IHByb2plY3REZXRhaWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbCAuZGV0YWlsc1wiKTtcclxuICAgIHByb2plY3REZXRhaWxzLmlubmVySFRNTCA9IG1vZGFsVGV4dFtpZF0uZGV0YWlscztcclxuXHJcbiAgICBjb25zdCBwcm9qZWN0TGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWwgLmxpbmtcIik7XHJcbiAgICBwcm9qZWN0TGluay5ocmVmID0gbW9kYWxUZXh0W2lkXS5saW5rO1xyXG5cclxuICAgIGNvbnN0IG1vZGFsU2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb2RhbCAuc2xpZGVcIik7XHJcbiAgICBtb2RhbFNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaW5kZXgpID0+IHtcclxuICAgICAgICBzbGlkZS5zdHlsZS5iYWNrZ3JvdW5kID0gYHVybChcIi4vYXNzZXRzL2ltYWdlcy9zbGlkZXMvJHtpZH0tc2xpZGUtJHtpbmRleH0uUE5HXCIpIGNlbnRlciBjZW50ZXIvY292ZXJgO1xyXG4gICAgICAgIHNsaWRlLnN0eWxlLmJhY2tncm91bmRTaXplID0gXCJjb3ZlclwiO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBzZXRQcm9qZWN0QnV0dG9ucyA9ICgpID0+IHtcclxuICAgIGNvbnN0IHByb2plY3RCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcm9qZWN0LWJ1dHRvblwiKTtcclxuICAgIHByb2plY3RCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcclxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldE1vZGFsKTtcclxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgc2V0UHJvamVjdEluZm8oYnV0dG9uLmlkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNldFByb2plY3RCdXR0b25zOyIsImNvbnN0IHNoaWZ0U2xpZGUgPSAoZGlyZWN0aW9uKSA9PiB7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlclwiKTtcclxuICAgIHNsaWRlci5jbGFzc0xpc3QuYWRkKFwidHJhbnNpdGlvblwiKTtcclxuICAgIHNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2RpcmVjdGlvbiAqIDcwMH1weClgO1xyXG4gICAgY29uc29sZS5sb2coXCJiZWZvcmUgdGltZW91dFwiKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIGRlYnVnZ2VyO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gMSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlOmZpcnN0LWNoaWxkXCIpLmJlZm9yZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlOmxhc3QtY2hpbGRcIikpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhpXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IC0xKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGU6bGFzdC1jaGlsZFwiKS5hZnRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlOmZpcnN0LWNoaWxkXCIpKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCItaGlcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNsaWRlci5jbGFzc0xpc3QucmVtb3ZlKFwidHJhbnNpdGlvblwiKTtcclxuICAgICAgICBzbGlkZXIuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoMHB4KWA7XHJcbiAgICB9LCA3MDApOyAgXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2hpZnRTbGlkZTsiLCJjb25zdCB0b2dnbGVNb2JpbGVOYXYgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBtb2JpbGVOYXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5saW5rLXdyYXBcIik7XHJcbiAgICBpZiAobW9iaWxlTmF2RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJ2aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgbW9iaWxlTmF2RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbW9iaWxlTmF2RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvZ2dsZU1vYmlsZU5hdjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJpbXBvcnQgc2V0TmF2TGlua3NFdmVudHMgZnJvbSBcIi4vbW9kdWxlcy9zZXROYXZMaW5rc0V2ZW50c1wiO1xyXG5pbXBvcnQgc2V0SGlnaGxpZ2h0VGV4dEV2ZW50IGZyb20gXCIuL21vZHVsZXMvc2V0SGlnaGxpZ2h0VGV4dEV2ZW50XCI7XHJcbmltcG9ydCBvblNjcm9sbEluaXQgZnJvbSBcIi4vbW9kdWxlcy9vblNjcm9sbEluaXRcIjtcclxuaW1wb3J0IHRvZ2dsZU1vYmlsZU5hdiBmcm9tIFwiLi9tb2R1bGVzL3RvZ2dsZU1vYmlsZU5hdlwiO1xyXG5pbXBvcnQgZml4TmF2IGZyb20gXCIuL21vZHVsZXMvZml4TmF2XCI7XHJcbmltcG9ydCBzZXRQcm9qZWN0QnV0dG9ucyBmcm9tIFwiLi9tb2R1bGVzL3NldFByb2plY3RCdXR0b25zXCJcclxuaW1wb3J0IHNldE1vZGFsRXZlbnRzIGZyb20gXCIuL21vZHVsZXMvc2V0TW9kYWxFdmVudHNcIjtcclxuaW1wb3J0IHNoaWZ0U2xpZGUgZnJvbSBcIi4vbW9kdWxlcy9zaGlmdFNsaWRlXCI7XHJcbmltcG9ydCBjb250YWN0IGZyb20gXCIuL21vZHVsZXMvY29udGFjdFwiO1xyXG5pbXBvcnQgJy4vc3R5bGUuY3NzJztcclxuXHJcblxyXG5cclxuXHJcbmNvbnN0IG5leHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25leHRcIik7XHJcbm5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgIHNoaWZ0U2xpZGUoLTEpO1xyXG59KTtcclxuY29uc3QgcHJldkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJldlwiKTtcclxucHJldkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgc2hpZnRTbGlkZSgxKTtcclxufSk7XHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZpeE5hdik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzZXRIaWdobGlnaHRUZXh0RXZlbnQpO1xyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJhci1pY29uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVNb2JpbGVOYXYpO1xyXG5vblNjcm9sbEluaXQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53YXlwb2ludFwiKSk7XHJcbnNldE5hdkxpbmtzRXZlbnRzKCk7XHJcbnNldFByb2plY3RCdXR0b25zKCk7XHJcbnNldE1vZGFsRXZlbnRzKCk7XHJcbmNvbnRhY3QoKTsiXSwic291cmNlUm9vdCI6IiJ9