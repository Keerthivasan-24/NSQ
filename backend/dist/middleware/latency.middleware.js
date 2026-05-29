"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latencyMiddleware = void 0;
const latencyMiddleware = (req, res, next) => {
    const latencyHeader = req.header('X-Simulate-Latency');
    const latencyQuery = req.query.latency;
    const latencyValue = latencyHeader || (typeof latencyQuery === 'string' ? latencyQuery : null);
    const delayMs = latencyValue ? parseInt(latencyValue, 10) * 1000 : 0;
    if (delayMs > 0 && !isNaN(delayMs)) {
        setTimeout(() => {
            next();
        }, delayMs);
    }
    else {
        next();
    }
};
exports.latencyMiddleware = latencyMiddleware;
