"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/troika-worker-utils";
exports.ids = ["vendor-chunks/troika-worker-utils"];
exports.modules = {

/***/ "(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js":
/*!**************************************************************************!*\
  !*** ./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   defineWorkerModule: () => (/* binding */ defineWorkerModule),\n/* harmony export */   stringifyFunction: () => (/* binding */ stringifyFunction),\n/* harmony export */   terminateWorker: () => (/* binding */ terminateWorker)\n/* harmony export */ });\n/**\n * Main content for the worker that handles the loading and execution of\n * modules within it.\n */\nfunction workerBootstrap() {\n  var modules = Object.create(null);\n\n  // Handle messages for registering a module\n  function registerModule(ref, callback) {\n    var id = ref.id;\n    var name = ref.name;\n    var dependencies = ref.dependencies; if ( dependencies === void 0 ) dependencies = [];\n    var init = ref.init; if ( init === void 0 ) init = function(){};\n    var getTransferables = ref.getTransferables; if ( getTransferables === void 0 ) getTransferables = null;\n\n    // Only register once\n    if (modules[id]) { return }\n\n    try {\n      // If any dependencies are modules, ensure they're registered and grab their value\n      dependencies = dependencies.map(function (dep) {\n        if (dep && dep.isWorkerModule) {\n          registerModule(dep, function (depResult) {\n            if (depResult instanceof Error) { throw depResult }\n          });\n          dep = modules[dep.id].value;\n        }\n        return dep\n      });\n\n      // Rehydrate functions\n      init = rehydrate((\"<\" + name + \">.init\"), init);\n      if (getTransferables) {\n        getTransferables = rehydrate((\"<\" + name + \">.getTransferables\"), getTransferables);\n      }\n\n      // Initialize the module and store its value\n      var value = null;\n      if (typeof init === 'function') {\n        value = init.apply(void 0, dependencies);\n      } else {\n        console.error('worker module init function failed to rehydrate');\n      }\n      modules[id] = {\n        id: id,\n        value: value,\n        getTransferables: getTransferables\n      };\n      callback(value);\n    } catch(err) {\n      if (!(err && err.noLog)) {\n        console.error(err);\n      }\n      callback(err);\n    }\n  }\n\n  // Handle messages for calling a registered module's result function\n  function callModule(ref, callback) {\n    var ref$1;\n\n    var id = ref.id;\n    var args = ref.args;\n    if (!modules[id] || typeof modules[id].value !== 'function') {\n      callback(new Error((\"Worker module \" + id + \": not found or its 'init' did not return a function\")));\n    }\n    try {\n      var result = (ref$1 = modules[id]).value.apply(ref$1, args);\n      if (result && typeof result.then === 'function') {\n        result.then(handleResult, function (rej) { return callback(rej instanceof Error ? rej : new Error('' + rej)); });\n      } else {\n        handleResult(result);\n      }\n    } catch(err) {\n      callback(err);\n    }\n    function handleResult(result) {\n      try {\n        var tx = modules[id].getTransferables && modules[id].getTransferables(result);\n        if (!tx || !Array.isArray(tx) || !tx.length) {\n          tx = undefined; //postMessage is very picky about not passing null or empty transferables\n        }\n        callback(result, tx);\n      } catch(err) {\n        console.error(err);\n        callback(err);\n      }\n    }\n  }\n\n  function rehydrate(name, str) {\n    var result = void 0;\n    self.troikaDefine = function (r) { return result = r; };\n    var url = URL.createObjectURL(\n      new Blob(\n        [(\"/** \" + (name.replace(/\\*/g, '')) + \" **/\\n\\ntroikaDefine(\\n\" + str + \"\\n)\")],\n        {type: 'application/javascript'}\n      )\n    );\n    try {\n      importScripts(url);\n    } catch(err) {\n      console.error(err);\n    }\n    URL.revokeObjectURL(url);\n    delete self.troikaDefine;\n    return result\n  }\n\n  // Handler for all messages within the worker\n  self.addEventListener('message', function (e) {\n    var ref = e.data;\n    var messageId = ref.messageId;\n    var action = ref.action;\n    var data = ref.data;\n    try {\n      // Module registration\n      if (action === 'registerModule') {\n        registerModule(data, function (result) {\n          if (result instanceof Error) {\n            postMessage({\n              messageId: messageId,\n              success: false,\n              error: result.message\n            });\n          } else {\n            postMessage({\n              messageId: messageId,\n              success: true,\n              result: {isCallable: typeof result === 'function'}\n            });\n          }\n        });\n      }\n      // Invocation\n      if (action === 'callModule') {\n        callModule(data, function (result, transferables) {\n          if (result instanceof Error) {\n            postMessage({\n              messageId: messageId,\n              success: false,\n              error: result.message\n            });\n          } else {\n            postMessage({\n              messageId: messageId,\n              success: true,\n              result: result\n            }, transferables || undefined);\n          }\n        });\n      }\n    } catch(err) {\n      postMessage({\n        messageId: messageId,\n        success: false,\n        error: err.stack\n      });\n    }\n  });\n}\n\n/**\n * Fallback for `defineWorkerModule` that behaves identically but runs in the main\n * thread, for when the execution environment doesn't support web workers or they\n * are disallowed due to e.g. CSP security restrictions.\n */\nfunction defineMainThreadModule(options) {\n  var moduleFunc = function() {\n    var args = [], len = arguments.length;\n    while ( len-- ) args[ len ] = arguments[ len ];\n\n    return moduleFunc._getInitResult().then(function (initResult) {\n      if (typeof initResult === 'function') {\n        return initResult.apply(void 0, args)\n      } else {\n        throw new Error('Worker module function was called but `init` did not return a callable function')\n      }\n    })\n  };\n  moduleFunc._getInitResult = function() {\n    // We can ignore getTransferables in main thread. TODO workerId?\n    var dependencies = options.dependencies;\n    var init = options.init;\n\n    // Resolve dependencies\n    dependencies = Array.isArray(dependencies) ? dependencies.map(function (dep) { return dep && dep._getInitResult ? dep._getInitResult() : dep; }\n    ) : [];\n\n    // Invoke init with the resolved dependencies\n    var initPromise = Promise.all(dependencies).then(function (deps) {\n      return init.apply(null, deps)\n    });\n\n    // Cache the resolved promise for subsequent calls\n    moduleFunc._getInitResult = function () { return initPromise; };\n\n    return initPromise\n  };\n  return moduleFunc\n}\n\nvar supportsWorkers = function () {\n  var supported = false;\n\n  // Only attempt worker initialization in browsers; elsewhere it would just be\n  // noise e.g. loading into a Node environment for SSR.\n  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {\n    try {\n      // TODO additional checks for things like importScripts within the worker?\n      //  Would need to be an async check.\n      var worker = new Worker(\n        URL.createObjectURL(new Blob([''], { type: 'application/javascript' }))\n      );\n      worker.terminate();\n      supported = true;\n    } catch (err) {\n      if (typeof process !== 'undefined' && \"development\" === 'test') {} else {\n        console.log(\n          (\"Troika createWorkerModule: web workers not allowed; falling back to main thread execution. Cause: [\" + (err.message) + \"]\")\n        );\n      }\n    }\n  }\n\n  // Cached result\n  supportsWorkers = function () { return supported; };\n  return supported\n};\n\nvar _workerModuleId = 0;\nvar _messageId = 0;\nvar _allowInitAsString = false;\nvar workers = Object.create(null);\nvar registeredModules = Object.create(null); //workerId -> Set<unregisterFn>\nvar openRequests = Object.create(null);\n\n\n/**\n * Define a module of code that will be executed with a web worker. This provides a simple\n * interface for moving chunks of logic off the main thread, and managing their dependencies\n * among one another.\n *\n * @param {object} options\n * @param {function} options.init\n * @param {array} [options.dependencies]\n * @param {function} [options.getTransferables]\n * @param {string} [options.name]\n * @param {string} [options.workerId]\n * @return {function(...[*]): {then}}\n */\nfunction defineWorkerModule(options) {\n  if ((!options || typeof options.init !== 'function') && !_allowInitAsString) {\n    throw new Error('requires `options.init` function')\n  }\n  var dependencies = options.dependencies;\n  var init = options.init;\n  var getTransferables = options.getTransferables;\n  var workerId = options.workerId;\n\n  if (!supportsWorkers()) {\n    return defineMainThreadModule(options)\n  }\n\n  if (workerId == null) {\n    workerId = '#default';\n  }\n  var id = \"workerModule\" + (++_workerModuleId);\n  var name = options.name || id;\n  var registrationPromise = null;\n\n  dependencies = dependencies && dependencies.map(function (dep) {\n    // Wrap raw functions as worker modules with no dependencies\n    if (typeof dep === 'function' && !dep.workerModuleData) {\n      _allowInitAsString = true;\n      dep = defineWorkerModule({\n        workerId: workerId,\n        name: (\"<\" + name + \"> function dependency: \" + (dep.name)),\n        init: (\"function(){return (\\n\" + (stringifyFunction(dep)) + \"\\n)}\")\n      });\n      _allowInitAsString = false;\n    }\n    // Grab postable data for worker modules\n    if (dep && dep.workerModuleData) {\n      dep = dep.workerModuleData;\n    }\n    return dep\n  });\n\n  function moduleFunc() {\n    var args = [], len = arguments.length;\n    while ( len-- ) args[ len ] = arguments[ len ];\n\n    // Register this module if needed\n    if (!registrationPromise) {\n      registrationPromise = callWorker(workerId,'registerModule', moduleFunc.workerModuleData);\n      var unregister = function () {\n        registrationPromise = null;\n        registeredModules[workerId].delete(unregister);\n      }\n      ;(registeredModules[workerId] || (registeredModules[workerId] = new Set())).add(unregister);\n    }\n\n    // Invoke the module, returning a promise\n    return registrationPromise.then(function (ref) {\n      var isCallable = ref.isCallable;\n\n      if (isCallable) {\n        return callWorker(workerId,'callModule', {id: id, args: args})\n      } else {\n        throw new Error('Worker module function was called but `init` did not return a callable function')\n      }\n    })\n  }\n  moduleFunc.workerModuleData = {\n    isWorkerModule: true,\n    id: id,\n    name: name,\n    dependencies: dependencies,\n    init: stringifyFunction(init),\n    getTransferables: getTransferables && stringifyFunction(getTransferables)\n  };\n  return moduleFunc\n}\n\n/**\n * Terminate an active Worker by a workerId that was passed to defineWorkerModule.\n * This only terminates the Worker itself; the worker module will remain available\n * and if you call it again its Worker will be respawned.\n * @param {string} workerId\n */\nfunction terminateWorker(workerId) {\n  // Unregister all modules that were registered in that worker\n  if (registeredModules[workerId]) {\n    registeredModules[workerId].forEach(function (unregister) {\n      unregister();\n    });\n  }\n  // Terminate the Worker object\n  if (workers[workerId]) {\n    workers[workerId].terminate();\n    delete workers[workerId];\n  }\n}\n\n/**\n * Stringifies a function into a form that can be deserialized in the worker\n * @param fn\n */\nfunction stringifyFunction(fn) {\n  var str = fn.toString();\n  // If it was defined in object method/property format, it needs to be modified\n  if (!/^function/.test(str) && /^\\w+\\s*\\(/.test(str)) {\n    str = 'function ' + str;\n  }\n  return str\n}\n\n\nfunction getWorker(workerId) {\n  var worker = workers[workerId];\n  if (!worker) {\n    // Bootstrap the worker's content\n    var bootstrap = stringifyFunction(workerBootstrap);\n\n    // Create the worker from the bootstrap function content\n    worker = workers[workerId] = new Worker(\n      URL.createObjectURL(\n        new Blob(\n          [(\"/** Worker Module Bootstrap: \" + (workerId.replace(/\\*/g, '')) + \" **/\\n\\n;(\" + bootstrap + \")()\")],\n          {type: 'application/javascript'}\n        )\n      )\n    );\n\n    // Single handler for response messages from the worker\n    worker.onmessage = function (e) {\n      var response = e.data;\n      var msgId = response.messageId;\n      var callback = openRequests[msgId];\n      if (!callback) {\n        throw new Error('WorkerModule response with empty or unknown messageId')\n      }\n      delete openRequests[msgId];\n      callback(response);\n    };\n  }\n  return worker\n}\n\n// Issue a call to the worker with a callback to handle the response\nfunction callWorker(workerId, action, data) {\n  return new Promise(function (resolve, reject) {\n    var messageId = ++_messageId;\n    openRequests[messageId] = function (response) {\n      if (response.success) {\n        resolve(response.result);\n      } else {\n        reject(new Error((\"Error in worker \" + action + \" call: \" + (response.error))));\n      }\n    };\n    getWorker(workerId).postMessage({\n      messageId: messageId,\n      action: action,\n      data: data\n    });\n  })\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHJvaWthLXdvcmtlci11dGlscy9kaXN0L3Ryb2lrYS13b3JrZXItdXRpbHMuZXNtLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6Qyx5QkFBeUI7QUFDekIsaURBQWlEOztBQUVqRDtBQUNBLHVCQUF1Qjs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELG9FQUFvRTtBQUN2SCxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1GQUFtRjtBQUNuRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsZ0NBQWdDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTiw0Q0FBNEMsYUFBb0IsYUFBYSxFQUFDLENBQUM7QUFDL0U7QUFDQSxnRUFBZ0U7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3Qzs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CLFlBQVksbUJBQW1CO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLDhDQUE4QztBQUN6RSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsbUJBQW1CO0FBQ3JFLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0ZBQXdGO0FBQ3hGLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRWtFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLXN0YXJ0ZXItcHJpc21pYy1taW5pbWFsLy4vbm9kZV9tb2R1bGVzL3Ryb2lrYS13b3JrZXItdXRpbHMvZGlzdC90cm9pa2Etd29ya2VyLXV0aWxzLmVzbS5qcz9mN2RjIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTWFpbiBjb250ZW50IGZvciB0aGUgd29ya2VyIHRoYXQgaGFuZGxlcyB0aGUgbG9hZGluZyBhbmQgZXhlY3V0aW9uIG9mXG4gKiBtb2R1bGVzIHdpdGhpbiBpdC5cbiAqL1xuZnVuY3Rpb24gd29ya2VyQm9vdHN0cmFwKCkge1xuICB2YXIgbW9kdWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy8gSGFuZGxlIG1lc3NhZ2VzIGZvciByZWdpc3RlcmluZyBhIG1vZHVsZVxuICBmdW5jdGlvbiByZWdpc3Rlck1vZHVsZShyZWYsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gcmVmLmlkO1xuICAgIHZhciBuYW1lID0gcmVmLm5hbWU7XG4gICAgdmFyIGRlcGVuZGVuY2llcyA9IHJlZi5kZXBlbmRlbmNpZXM7IGlmICggZGVwZW5kZW5jaWVzID09PSB2b2lkIDAgKSBkZXBlbmRlbmNpZXMgPSBbXTtcbiAgICB2YXIgaW5pdCA9IHJlZi5pbml0OyBpZiAoIGluaXQgPT09IHZvaWQgMCApIGluaXQgPSBmdW5jdGlvbigpe307XG4gICAgdmFyIGdldFRyYW5zZmVyYWJsZXMgPSByZWYuZ2V0VHJhbnNmZXJhYmxlczsgaWYgKCBnZXRUcmFuc2ZlcmFibGVzID09PSB2b2lkIDAgKSBnZXRUcmFuc2ZlcmFibGVzID0gbnVsbDtcblxuICAgIC8vIE9ubHkgcmVnaXN0ZXIgb25jZVxuICAgIGlmIChtb2R1bGVzW2lkXSkgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIElmIGFueSBkZXBlbmRlbmNpZXMgYXJlIG1vZHVsZXMsIGVuc3VyZSB0aGV5J3JlIHJlZ2lzdGVyZWQgYW5kIGdyYWIgdGhlaXIgdmFsdWVcbiAgICAgIGRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcy5tYXAoZnVuY3Rpb24gKGRlcCkge1xuICAgICAgICBpZiAoZGVwICYmIGRlcC5pc1dvcmtlck1vZHVsZSkge1xuICAgICAgICAgIHJlZ2lzdGVyTW9kdWxlKGRlcCwgZnVuY3Rpb24gKGRlcFJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlcFJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7IHRocm93IGRlcFJlc3VsdCB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGVwID0gbW9kdWxlc1tkZXAuaWRdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXBcbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZWh5ZHJhdGUgZnVuY3Rpb25zXG4gICAgICBpbml0ID0gcmVoeWRyYXRlKChcIjxcIiArIG5hbWUgKyBcIj4uaW5pdFwiKSwgaW5pdCk7XG4gICAgICBpZiAoZ2V0VHJhbnNmZXJhYmxlcykge1xuICAgICAgICBnZXRUcmFuc2ZlcmFibGVzID0gcmVoeWRyYXRlKChcIjxcIiArIG5hbWUgKyBcIj4uZ2V0VHJhbnNmZXJhYmxlc1wiKSwgZ2V0VHJhbnNmZXJhYmxlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluaXRpYWxpemUgdGhlIG1vZHVsZSBhbmQgc3RvcmUgaXRzIHZhbHVlXG4gICAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgICAgaWYgKHR5cGVvZiBpbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhbHVlID0gaW5pdC5hcHBseSh2b2lkIDAsIGRlcGVuZGVuY2llcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCd3b3JrZXIgbW9kdWxlIGluaXQgZnVuY3Rpb24gZmFpbGVkIHRvIHJlaHlkcmF0ZScpO1xuICAgICAgfVxuICAgICAgbW9kdWxlc1tpZF0gPSB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBnZXRUcmFuc2ZlcmFibGVzOiBnZXRUcmFuc2ZlcmFibGVzXG4gICAgICB9O1xuICAgICAgY2FsbGJhY2sodmFsdWUpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICBpZiAoIShlcnIgJiYgZXJyLm5vTG9nKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhhbmRsZSBtZXNzYWdlcyBmb3IgY2FsbGluZyBhIHJlZ2lzdGVyZWQgbW9kdWxlJ3MgcmVzdWx0IGZ1bmN0aW9uXG4gIGZ1bmN0aW9uIGNhbGxNb2R1bGUocmVmLCBjYWxsYmFjaykge1xuICAgIHZhciByZWYkMTtcblxuICAgIHZhciBpZCA9IHJlZi5pZDtcbiAgICB2YXIgYXJncyA9IHJlZi5hcmdzO1xuICAgIGlmICghbW9kdWxlc1tpZF0gfHwgdHlwZW9mIG1vZHVsZXNbaWRdLnZhbHVlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKFwiV29ya2VyIG1vZHVsZSBcIiArIGlkICsgXCI6IG5vdCBmb3VuZCBvciBpdHMgJ2luaXQnIGRpZCBub3QgcmV0dXJuIGEgZnVuY3Rpb25cIikpKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHZhciByZXN1bHQgPSAocmVmJDEgPSBtb2R1bGVzW2lkXSkudmFsdWUuYXBwbHkocmVmJDEsIGFyZ3MpO1xuICAgICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0LnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmVzdWx0LnRoZW4oaGFuZGxlUmVzdWx0LCBmdW5jdGlvbiAocmVqKSB7IHJldHVybiBjYWxsYmFjayhyZWogaW5zdGFuY2VvZiBFcnJvciA/IHJlaiA6IG5ldyBFcnJvcignJyArIHJlaikpOyB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhhbmRsZVJlc3VsdChyZXN1bHQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHQocmVzdWx0KSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgdHggPSBtb2R1bGVzW2lkXS5nZXRUcmFuc2ZlcmFibGVzICYmIG1vZHVsZXNbaWRdLmdldFRyYW5zZmVyYWJsZXMocmVzdWx0KTtcbiAgICAgICAgaWYgKCF0eCB8fCAhQXJyYXkuaXNBcnJheSh0eCkgfHwgIXR4Lmxlbmd0aCkge1xuICAgICAgICAgIHR4ID0gdW5kZWZpbmVkOyAvL3Bvc3RNZXNzYWdlIGlzIHZlcnkgcGlja3kgYWJvdXQgbm90IHBhc3NpbmcgbnVsbCBvciBlbXB0eSB0cmFuc2ZlcmFibGVzXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2socmVzdWx0LCB0eCk7XG4gICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVoeWRyYXRlKG5hbWUsIHN0cikge1xuICAgIHZhciByZXN1bHQgPSB2b2lkIDA7XG4gICAgc2VsZi50cm9pa2FEZWZpbmUgPSBmdW5jdGlvbiAocikgeyByZXR1cm4gcmVzdWx0ID0gcjsgfTtcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChcbiAgICAgIG5ldyBCbG9iKFxuICAgICAgICBbKFwiLyoqIFwiICsgKG5hbWUucmVwbGFjZSgvXFwqL2csICcnKSkgKyBcIiAqKi9cXG5cXG50cm9pa2FEZWZpbmUoXFxuXCIgKyBzdHIgKyBcIlxcbilcIildLFxuICAgICAgICB7dHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnfVxuICAgICAgKVxuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgIGltcG9ydFNjcmlwdHModXJsKTtcbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgZGVsZXRlIHNlbGYudHJvaWthRGVmaW5lO1xuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8vIEhhbmRsZXIgZm9yIGFsbCBtZXNzYWdlcyB3aXRoaW4gdGhlIHdvcmtlclxuICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciByZWYgPSBlLmRhdGE7XG4gICAgdmFyIG1lc3NhZ2VJZCA9IHJlZi5tZXNzYWdlSWQ7XG4gICAgdmFyIGFjdGlvbiA9IHJlZi5hY3Rpb247XG4gICAgdmFyIGRhdGEgPSByZWYuZGF0YTtcbiAgICB0cnkge1xuICAgICAgLy8gTW9kdWxlIHJlZ2lzdHJhdGlvblxuICAgICAgaWYgKGFjdGlvbiA9PT0gJ3JlZ2lzdGVyTW9kdWxlJykge1xuICAgICAgICByZWdpc3Rlck1vZHVsZShkYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgZXJyb3I6IHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVzdWx0OiB7aXNDYWxsYWJsZTogdHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBJbnZvY2F0aW9uXG4gICAgICBpZiAoYWN0aW9uID09PSAnY2FsbE1vZHVsZScpIHtcbiAgICAgICAgY2FsbE1vZHVsZShkYXRhLCBmdW5jdGlvbiAocmVzdWx0LCB0cmFuc2ZlcmFibGVzKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgICAgZXJyb3I6IHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2VJZCxcbiAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHRcbiAgICAgICAgICAgIH0sIHRyYW5zZmVyYWJsZXMgfHwgdW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGVyci5zdGFja1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBGYWxsYmFjayBmb3IgYGRlZmluZVdvcmtlck1vZHVsZWAgdGhhdCBiZWhhdmVzIGlkZW50aWNhbGx5IGJ1dCBydW5zIGluIHRoZSBtYWluXG4gKiB0aHJlYWQsIGZvciB3aGVuIHRoZSBleGVjdXRpb24gZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IHdlYiB3b3JrZXJzIG9yIHRoZXlcbiAqIGFyZSBkaXNhbGxvd2VkIGR1ZSB0byBlLmcuIENTUCBzZWN1cml0eSByZXN0cmljdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGRlZmluZU1haW5UaHJlYWRNb2R1bGUob3B0aW9ucykge1xuICB2YXIgbW9kdWxlRnVuYyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCBsZW4tLSApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHJldHVybiBtb2R1bGVGdW5jLl9nZXRJbml0UmVzdWx0KCkudGhlbihmdW5jdGlvbiAoaW5pdFJlc3VsdCkge1xuICAgICAgaWYgKHR5cGVvZiBpbml0UmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBpbml0UmVzdWx0LmFwcGx5KHZvaWQgMCwgYXJncylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignV29ya2VyIG1vZHVsZSBmdW5jdGlvbiB3YXMgY2FsbGVkIGJ1dCBgaW5pdGAgZGlkIG5vdCByZXR1cm4gYSBjYWxsYWJsZSBmdW5jdGlvbicpXG4gICAgICB9XG4gICAgfSlcbiAgfTtcbiAgbW9kdWxlRnVuYy5fZ2V0SW5pdFJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFdlIGNhbiBpZ25vcmUgZ2V0VHJhbnNmZXJhYmxlcyBpbiBtYWluIHRocmVhZC4gVE9ETyB3b3JrZXJJZD9cbiAgICB2YXIgZGVwZW5kZW5jaWVzID0gb3B0aW9ucy5kZXBlbmRlbmNpZXM7XG4gICAgdmFyIGluaXQgPSBvcHRpb25zLmluaXQ7XG5cbiAgICAvLyBSZXNvbHZlIGRlcGVuZGVuY2llc1xuICAgIGRlcGVuZGVuY2llcyA9IEFycmF5LmlzQXJyYXkoZGVwZW5kZW5jaWVzKSA/IGRlcGVuZGVuY2llcy5tYXAoZnVuY3Rpb24gKGRlcCkgeyByZXR1cm4gZGVwICYmIGRlcC5fZ2V0SW5pdFJlc3VsdCA/IGRlcC5fZ2V0SW5pdFJlc3VsdCgpIDogZGVwOyB9XG4gICAgKSA6IFtdO1xuXG4gICAgLy8gSW52b2tlIGluaXQgd2l0aCB0aGUgcmVzb2x2ZWQgZGVwZW5kZW5jaWVzXG4gICAgdmFyIGluaXRQcm9taXNlID0gUHJvbWlzZS5hbGwoZGVwZW5kZW5jaWVzKS50aGVuKGZ1bmN0aW9uIChkZXBzKSB7XG4gICAgICByZXR1cm4gaW5pdC5hcHBseShudWxsLCBkZXBzKVxuICAgIH0pO1xuXG4gICAgLy8gQ2FjaGUgdGhlIHJlc29sdmVkIHByb21pc2UgZm9yIHN1YnNlcXVlbnQgY2FsbHNcbiAgICBtb2R1bGVGdW5jLl9nZXRJbml0UmVzdWx0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaW5pdFByb21pc2U7IH07XG5cbiAgICByZXR1cm4gaW5pdFByb21pc2VcbiAgfTtcbiAgcmV0dXJuIG1vZHVsZUZ1bmNcbn1cblxudmFyIHN1cHBvcnRzV29ya2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN1cHBvcnRlZCA9IGZhbHNlO1xuXG4gIC8vIE9ubHkgYXR0ZW1wdCB3b3JrZXIgaW5pdGlhbGl6YXRpb24gaW4gYnJvd3NlcnM7IGVsc2V3aGVyZSBpdCB3b3VsZCBqdXN0IGJlXG4gIC8vIG5vaXNlIGUuZy4gbG9hZGluZyBpbnRvIGEgTm9kZSBlbnZpcm9ubWVudCBmb3IgU1NSLlxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0cnkge1xuICAgICAgLy8gVE9ETyBhZGRpdGlvbmFsIGNoZWNrcyBmb3IgdGhpbmdzIGxpa2UgaW1wb3J0U2NyaXB0cyB3aXRoaW4gdGhlIHdvcmtlcj9cbiAgICAgIC8vICBXb3VsZCBuZWVkIHRvIGJlIGFuIGFzeW5jIGNoZWNrLlxuICAgICAgdmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoXG4gICAgICAgIFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoWycnXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcgfSkpXG4gICAgICApO1xuICAgICAgd29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgICAgc3VwcG9ydGVkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICd0ZXN0JykgOyBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgKFwiVHJvaWthIGNyZWF0ZVdvcmtlck1vZHVsZTogd2ViIHdvcmtlcnMgbm90IGFsbG93ZWQ7IGZhbGxpbmcgYmFjayB0byBtYWluIHRocmVhZCBleGVjdXRpb24uIENhdXNlOiBbXCIgKyAoZXJyLm1lc3NhZ2UpICsgXCJdXCIpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FjaGVkIHJlc3VsdFxuICBzdXBwb3J0c1dvcmtlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBzdXBwb3J0ZWQ7IH07XG4gIHJldHVybiBzdXBwb3J0ZWRcbn07XG5cbnZhciBfd29ya2VyTW9kdWxlSWQgPSAwO1xudmFyIF9tZXNzYWdlSWQgPSAwO1xudmFyIF9hbGxvd0luaXRBc1N0cmluZyA9IGZhbHNlO1xudmFyIHdvcmtlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xudmFyIHJlZ2lzdGVyZWRNb2R1bGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgLy93b3JrZXJJZCAtPiBTZXQ8dW5yZWdpc3RlckZuPlxudmFyIG9wZW5SZXF1ZXN0cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblxuLyoqXG4gKiBEZWZpbmUgYSBtb2R1bGUgb2YgY29kZSB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2l0aCBhIHdlYiB3b3JrZXIuIFRoaXMgcHJvdmlkZXMgYSBzaW1wbGVcbiAqIGludGVyZmFjZSBmb3IgbW92aW5nIGNodW5rcyBvZiBsb2dpYyBvZmYgdGhlIG1haW4gdGhyZWFkLCBhbmQgbWFuYWdpbmcgdGhlaXIgZGVwZW5kZW5jaWVzXG4gKiBhbW9uZyBvbmUgYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5pbml0XG4gKiBAcGFyYW0ge2FycmF5fSBbb3B0aW9ucy5kZXBlbmRlbmNpZXNdXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5nZXRUcmFuc2ZlcmFibGVzXVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWVdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMud29ya2VySWRdXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5bKl0pOiB7dGhlbn19XG4gKi9cbmZ1bmN0aW9uIGRlZmluZVdvcmtlck1vZHVsZShvcHRpb25zKSB7XG4gIGlmICgoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMuaW5pdCAhPT0gJ2Z1bmN0aW9uJykgJiYgIV9hbGxvd0luaXRBc1N0cmluZykge1xuICAgIHRocm93IG5ldyBFcnJvcigncmVxdWlyZXMgYG9wdGlvbnMuaW5pdGAgZnVuY3Rpb24nKVxuICB9XG4gIHZhciBkZXBlbmRlbmNpZXMgPSBvcHRpb25zLmRlcGVuZGVuY2llcztcbiAgdmFyIGluaXQgPSBvcHRpb25zLmluaXQ7XG4gIHZhciBnZXRUcmFuc2ZlcmFibGVzID0gb3B0aW9ucy5nZXRUcmFuc2ZlcmFibGVzO1xuICB2YXIgd29ya2VySWQgPSBvcHRpb25zLndvcmtlcklkO1xuXG4gIGlmICghc3VwcG9ydHNXb3JrZXJzKCkpIHtcbiAgICByZXR1cm4gZGVmaW5lTWFpblRocmVhZE1vZHVsZShvcHRpb25zKVxuICB9XG5cbiAgaWYgKHdvcmtlcklkID09IG51bGwpIHtcbiAgICB3b3JrZXJJZCA9ICcjZGVmYXVsdCc7XG4gIH1cbiAgdmFyIGlkID0gXCJ3b3JrZXJNb2R1bGVcIiArICgrK193b3JrZXJNb2R1bGVJZCk7XG4gIHZhciBuYW1lID0gb3B0aW9ucy5uYW1lIHx8IGlkO1xuICB2YXIgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IG51bGw7XG5cbiAgZGVwZW5kZW5jaWVzID0gZGVwZW5kZW5jaWVzICYmIGRlcGVuZGVuY2llcy5tYXAoZnVuY3Rpb24gKGRlcCkge1xuICAgIC8vIFdyYXAgcmF3IGZ1bmN0aW9ucyBhcyB3b3JrZXIgbW9kdWxlcyB3aXRoIG5vIGRlcGVuZGVuY2llc1xuICAgIGlmICh0eXBlb2YgZGVwID09PSAnZnVuY3Rpb24nICYmICFkZXAud29ya2VyTW9kdWxlRGF0YSkge1xuICAgICAgX2FsbG93SW5pdEFzU3RyaW5nID0gdHJ1ZTtcbiAgICAgIGRlcCA9IGRlZmluZVdvcmtlck1vZHVsZSh7XG4gICAgICAgIHdvcmtlcklkOiB3b3JrZXJJZCxcbiAgICAgICAgbmFtZTogKFwiPFwiICsgbmFtZSArIFwiPiBmdW5jdGlvbiBkZXBlbmRlbmN5OiBcIiArIChkZXAubmFtZSkpLFxuICAgICAgICBpbml0OiAoXCJmdW5jdGlvbigpe3JldHVybiAoXFxuXCIgKyAoc3RyaW5naWZ5RnVuY3Rpb24oZGVwKSkgKyBcIlxcbil9XCIpXG4gICAgICB9KTtcbiAgICAgIF9hbGxvd0luaXRBc1N0cmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBHcmFiIHBvc3RhYmxlIGRhdGEgZm9yIHdvcmtlciBtb2R1bGVzXG4gICAgaWYgKGRlcCAmJiBkZXAud29ya2VyTW9kdWxlRGF0YSkge1xuICAgICAgZGVwID0gZGVwLndvcmtlck1vZHVsZURhdGE7XG4gICAgfVxuICAgIHJldHVybiBkZXBcbiAgfSk7XG5cbiAgZnVuY3Rpb24gbW9kdWxlRnVuYygpIHtcbiAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICAvLyBSZWdpc3RlciB0aGlzIG1vZHVsZSBpZiBuZWVkZWRcbiAgICBpZiAoIXJlZ2lzdHJhdGlvblByb21pc2UpIHtcbiAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBjYWxsV29ya2VyKHdvcmtlcklkLCdyZWdpc3Rlck1vZHVsZScsIG1vZHVsZUZ1bmMud29ya2VyTW9kdWxlRGF0YSk7XG4gICAgICB2YXIgdW5yZWdpc3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IG51bGw7XG4gICAgICAgIHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXS5kZWxldGUodW5yZWdpc3Rlcik7XG4gICAgICB9XG4gICAgICA7KHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXSB8fCAocmVnaXN0ZXJlZE1vZHVsZXNbd29ya2VySWRdID0gbmV3IFNldCgpKSkuYWRkKHVucmVnaXN0ZXIpO1xuICAgIH1cblxuICAgIC8vIEludm9rZSB0aGUgbW9kdWxlLCByZXR1cm5pbmcgYSBwcm9taXNlXG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvblByb21pc2UudGhlbihmdW5jdGlvbiAocmVmKSB7XG4gICAgICB2YXIgaXNDYWxsYWJsZSA9IHJlZi5pc0NhbGxhYmxlO1xuXG4gICAgICBpZiAoaXNDYWxsYWJsZSkge1xuICAgICAgICByZXR1cm4gY2FsbFdvcmtlcih3b3JrZXJJZCwnY2FsbE1vZHVsZScsIHtpZDogaWQsIGFyZ3M6IGFyZ3N9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXb3JrZXIgbW9kdWxlIGZ1bmN0aW9uIHdhcyBjYWxsZWQgYnV0IGBpbml0YCBkaWQgbm90IHJldHVybiBhIGNhbGxhYmxlIGZ1bmN0aW9uJylcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIG1vZHVsZUZ1bmMud29ya2VyTW9kdWxlRGF0YSA9IHtcbiAgICBpc1dvcmtlck1vZHVsZTogdHJ1ZSxcbiAgICBpZDogaWQsXG4gICAgbmFtZTogbmFtZSxcbiAgICBkZXBlbmRlbmNpZXM6IGRlcGVuZGVuY2llcyxcbiAgICBpbml0OiBzdHJpbmdpZnlGdW5jdGlvbihpbml0KSxcbiAgICBnZXRUcmFuc2ZlcmFibGVzOiBnZXRUcmFuc2ZlcmFibGVzICYmIHN0cmluZ2lmeUZ1bmN0aW9uKGdldFRyYW5zZmVyYWJsZXMpXG4gIH07XG4gIHJldHVybiBtb2R1bGVGdW5jXG59XG5cbi8qKlxuICogVGVybWluYXRlIGFuIGFjdGl2ZSBXb3JrZXIgYnkgYSB3b3JrZXJJZCB0aGF0IHdhcyBwYXNzZWQgdG8gZGVmaW5lV29ya2VyTW9kdWxlLlxuICogVGhpcyBvbmx5IHRlcm1pbmF0ZXMgdGhlIFdvcmtlciBpdHNlbGY7IHRoZSB3b3JrZXIgbW9kdWxlIHdpbGwgcmVtYWluIGF2YWlsYWJsZVxuICogYW5kIGlmIHlvdSBjYWxsIGl0IGFnYWluIGl0cyBXb3JrZXIgd2lsbCBiZSByZXNwYXduZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gd29ya2VySWRcbiAqL1xuZnVuY3Rpb24gdGVybWluYXRlV29ya2VyKHdvcmtlcklkKSB7XG4gIC8vIFVucmVnaXN0ZXIgYWxsIG1vZHVsZXMgdGhhdCB3ZXJlIHJlZ2lzdGVyZWQgaW4gdGhhdCB3b3JrZXJcbiAgaWYgKHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXSkge1xuICAgIHJlZ2lzdGVyZWRNb2R1bGVzW3dvcmtlcklkXS5mb3JFYWNoKGZ1bmN0aW9uICh1bnJlZ2lzdGVyKSB7XG4gICAgICB1bnJlZ2lzdGVyKCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gVGVybWluYXRlIHRoZSBXb3JrZXIgb2JqZWN0XG4gIGlmICh3b3JrZXJzW3dvcmtlcklkXSkge1xuICAgIHdvcmtlcnNbd29ya2VySWRdLnRlcm1pbmF0ZSgpO1xuICAgIGRlbGV0ZSB3b3JrZXJzW3dvcmtlcklkXTtcbiAgfVxufVxuXG4vKipcbiAqIFN0cmluZ2lmaWVzIGEgZnVuY3Rpb24gaW50byBhIGZvcm0gdGhhdCBjYW4gYmUgZGVzZXJpYWxpemVkIGluIHRoZSB3b3JrZXJcbiAqIEBwYXJhbSBmblxuICovXG5mdW5jdGlvbiBzdHJpbmdpZnlGdW5jdGlvbihmbikge1xuICB2YXIgc3RyID0gZm4udG9TdHJpbmcoKTtcbiAgLy8gSWYgaXQgd2FzIGRlZmluZWQgaW4gb2JqZWN0IG1ldGhvZC9wcm9wZXJ0eSBmb3JtYXQsIGl0IG5lZWRzIHRvIGJlIG1vZGlmaWVkXG4gIGlmICghL15mdW5jdGlvbi8udGVzdChzdHIpICYmIC9eXFx3K1xccypcXCgvLnRlc3Qoc3RyKSkge1xuICAgIHN0ciA9ICdmdW5jdGlvbiAnICsgc3RyO1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuXG5mdW5jdGlvbiBnZXRXb3JrZXIod29ya2VySWQpIHtcbiAgdmFyIHdvcmtlciA9IHdvcmtlcnNbd29ya2VySWRdO1xuICBpZiAoIXdvcmtlcikge1xuICAgIC8vIEJvb3RzdHJhcCB0aGUgd29ya2VyJ3MgY29udGVudFxuICAgIHZhciBib290c3RyYXAgPSBzdHJpbmdpZnlGdW5jdGlvbih3b3JrZXJCb290c3RyYXApO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB3b3JrZXIgZnJvbSB0aGUgYm9vdHN0cmFwIGZ1bmN0aW9uIGNvbnRlbnRcbiAgICB3b3JrZXIgPSB3b3JrZXJzW3dvcmtlcklkXSA9IG5ldyBXb3JrZXIoXG4gICAgICBVUkwuY3JlYXRlT2JqZWN0VVJMKFxuICAgICAgICBuZXcgQmxvYihcbiAgICAgICAgICBbKFwiLyoqIFdvcmtlciBNb2R1bGUgQm9vdHN0cmFwOiBcIiArICh3b3JrZXJJZC5yZXBsYWNlKC9cXCovZywgJycpKSArIFwiICoqL1xcblxcbjsoXCIgKyBib290c3RyYXAgKyBcIikoKVwiKV0sXG4gICAgICAgICAge3R5cGU6ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0J31cbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgICAvLyBTaW5nbGUgaGFuZGxlciBmb3IgcmVzcG9uc2UgbWVzc2FnZXMgZnJvbSB0aGUgd29ya2VyXG4gICAgd29ya2VyLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgcmVzcG9uc2UgPSBlLmRhdGE7XG4gICAgICB2YXIgbXNnSWQgPSByZXNwb25zZS5tZXNzYWdlSWQ7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBvcGVuUmVxdWVzdHNbbXNnSWRdO1xuICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlck1vZHVsZSByZXNwb25zZSB3aXRoIGVtcHR5IG9yIHVua25vd24gbWVzc2FnZUlkJylcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSBvcGVuUmVxdWVzdHNbbXNnSWRdO1xuICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIHdvcmtlclxufVxuXG4vLyBJc3N1ZSBhIGNhbGwgdG8gdGhlIHdvcmtlciB3aXRoIGEgY2FsbGJhY2sgdG8gaGFuZGxlIHRoZSByZXNwb25zZVxuZnVuY3Rpb24gY2FsbFdvcmtlcih3b3JrZXJJZCwgYWN0aW9uLCBkYXRhKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIG1lc3NhZ2VJZCA9ICsrX21lc3NhZ2VJZDtcbiAgICBvcGVuUmVxdWVzdHNbbWVzc2FnZUlkXSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcigoXCJFcnJvciBpbiB3b3JrZXIgXCIgKyBhY3Rpb24gKyBcIiBjYWxsOiBcIiArIChyZXNwb25zZS5lcnJvcikpKSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBnZXRXb3JrZXIod29ya2VySWQpLnBvc3RNZXNzYWdlKHtcbiAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZUlkLFxuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0pXG59XG5cbmV4cG9ydCB7IGRlZmluZVdvcmtlck1vZHVsZSwgc3RyaW5naWZ5RnVuY3Rpb24sIHRlcm1pbmF0ZVdvcmtlciB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/troika-worker-utils/dist/troika-worker-utils.esm.js\n");

/***/ })

};
;