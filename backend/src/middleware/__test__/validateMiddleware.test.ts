import { validate } from '../validateMiddleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

describe('Validate Middleware Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('calls next() if the incoming payload perfectly matches the Zod schema', () => {
    const mockSchema = z.object({
      body: z.object({
        username: z.string()
      })
    });

    mockRequest = {
      body: { username: 'testuser' },
      query: {},
      params: {}
    };

    const middleware = validate(mockSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith(); // Called cleanly without errors
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('returns 400 Bad Request if the payload fails Zod schema validation', () => {
    const mockSchema = z.object({
      body: z.object({
        username: z.string()
      })
    });

    // Provide a number instead of the required string
    mockRequest = {
      body: { username: 123 }, 
      query: {},
      params: {}
    };

    const middleware = validate(mockSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid Input Type',
        errors: expect.any(Array) // Asserts that Zod generated an error list
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
