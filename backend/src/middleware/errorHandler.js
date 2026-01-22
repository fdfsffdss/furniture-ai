/**
 * Error handling middleware
 */

export class AppError extends Error {
  constructor(statusCode, message, errorCode = 'UNKNOWN_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    code: err.errorCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      timestamp: err.timestamp
    });
  }

  // Handle API errors from Gemini
  if (err.message?.includes('API') || err.message?.includes('Gemini')) {
    return res.status(503).json({
      error: 'GEMINI_API_ERROR',
      message: 'Сервис AI временно недоступен',
      timestamp: new Date().toISOString()
    });
  }

  // Default error
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Внутренняя ошибка сервера',
    timestamp: new Date().toISOString()
  });
};

/**
 * Rate limiting middleware
 */
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

export const rateLimiter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, []);
  }

  const requests = requestCounts.get(clientIP);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Слишком много запросов. Попробуйте позже.',
      retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - validRequests[0])) / 1000)
    });
  }

  validRequests.push(now);
  requestCounts.set(clientIP, validRequests);

  // Clean up old IPs
  if (requestCounts.size > 1000) {
    for (const [ip, times] of requestCounts) {
      if (times.filter(t => now - t < RATE_LIMIT_WINDOW).length === 0) {
        requestCounts.delete(ip);
      }
    }
  }

  next();
};

/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? '⚠️' : '✓';
    console.log(`${logLevel} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
