import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters string"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password is required")
  })
});

export const bookingSchema = z.object({
  body: z.object({
    flightId: z.string().length(24, "Invalid MongoDB Object ID (must be exactly 24 characters)"),
    passengerName: z.string().min(2, "Name is required"),
    seatNumber: z.string().min(1, "Seat is required")
  })
});

export const updateFlightSchema = z.object({
  body: z.object({
    price: z.number().positive("Price must be greater than 0").optional(),
    availableSeats: z.number().min(0, "Seats cannot be negative").optional(),
    departureTime: z.string().optional(),
    arrivalTime: z.string().optional()
  })
});
