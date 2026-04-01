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
    seatNumber: z.string().min(1, "Seat is required"),
    mealPreference: z.enum(['Veg', 'Non-Veg', 'None']).optional()
  })
});


export const createFlightSchema = z.object({
  body: z.object({
    flightNumber: z.string().min(3),
    airline: z.string().min(2),
    airlineLogo: z.string().url("Invalid Logo URL"),
    source: z.string().min(2),
    destination: z.string().min(2),
    departureTime: z.string(),
    arrivalTime: z.string(),
    duration: z.number().positive().optional(),
    price: z.number().positive(),
    availableSeats: z.number().min(0),
    stops: z.number().min(0).optional(),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First']).optional(),
    amenities: z.array(z.string()).optional(),
    isRefundable: z.boolean().optional(),
    baggageInfo: z.object({
      carryOn: z.string(),
      checked: z.string()
    }).optional()
  })
});

export const updateFlightSchema = z.object({
  body: z.object({
    price: z.number().positive("Price must be greater than 0").optional(),
    availableSeats: z.number().min(0, "Seats cannot be negative").optional(),
    departureTime: z.string().optional(),
    arrivalTime: z.string().optional(),
    airlineLogo: z.string().url().optional(),
    duration: z.number().positive().optional(),
    stops: z.number().min(0).optional(),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First']).optional(),
    amenities: z.array(z.string()).optional(),
    isRefundable: z.boolean().optional(),
    baggageInfo: z.object({
      carryOn: z.string(),
      checked: z.string()
    }).optional()
  })
});

