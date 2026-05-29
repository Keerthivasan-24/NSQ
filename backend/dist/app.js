"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const record_routes_1 = __importDefault(require("./routes/record.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const latency_middleware_1 = require("./middleware/latency.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Enable CORS with support for headers/methods
app.use((0, cors_1.default)({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Simulate-Latency'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// Body parser
app.use(express_1.default.json());
// Log incoming requests
app.use(logger_middleware_1.loggerMiddleware);
// Artificial latency simulator middleware
app.use(latency_middleware_1.latencyMiddleware);
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/records', record_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Root route check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MPloyChek Verification API is active.' });
});
// Error handling middleware
app.use(error_middleware_1.errorMiddleware);
// Start server
app.listen(PORT, () => {
    console.log(`[Server] MPloyChek backend is running on http://localhost:${PORT}`);
});
