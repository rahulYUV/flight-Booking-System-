# Flight Booking System (Software Testing Project)

## Project Overview
This represents the explicitly tested backend matrix of an airline management system (functioning identically to carriers such as IndiGo). 
It has been structurally engineered entirely as a Software Testing Framework demonstrating production-ready concepts such as JWT Authentication, Zod Input Payload Validation, algorithmic cross-collection capacity constraints, error intercepts, and Automated Unit & Integration Testing safely via MongoDB mappings.

## Scope of the Project
The fundamental scope of this architecture is to provide a highly secure, mathematically verified REST API environment for quality assurance operations. Rather than simply building standard CRUD components, this project was scoped explicitly to demonstrate:
* **Defensive Programming**: Preventing bad data via Middleware (Zod) before it reaches the MongoDB Database.
* **Algorithmic Consistency**: Guaranteeing that booking a flight perfectly decrements the global `availableSeats` integer across collections natively.
* **Negative Testing Paths**: Deliberately programming edge cases (such as attempting to overbook a full flight or submitting invalid JWT tokens) to test the strict bounds of the error-handling layers.
* **Isolated Testing Infrastructure**: Using Sandbox nodes (`mongodb-memory-server`) to guarantee that algorithmic testing never taints or destroys real-world database records.

---

## Technology Stack
* **Language & Syntax**: TypeScript running smoothly over Node.js and Express.js
* **Data Storage**: MongoDB cluster mapped flawlessly via Mongoose.
* **Testing Architecture**: Jest intercepting routes smoothly simulated by Supertest.
* **Database Mocking**: `mongodb-memory-server`
* **Data Validations**: Zod schemas correctly isolating types.
* **API Documentation**: Swagger-UI dynamically generating live endpoints at `/api-docs`.

---

## Commands & Scripts Details
This project contains specifically tailored execution hooks managed natively inside the `package.json` file. 

### Development Scripts
* `npm run dev`
  * **What it does**: Boots the application seamlessly over `nodemon` targeting `src/index.ts`.
  * **Use case**: Run this during standard API development. It dynamically watches all TypeScript files and reboots your local `http://localhost:5000` instance instantaneously upon saving code.
* `npm run build`
  * **What it does**: Scans all raw `.ts` files securely translating them purely into javascript safely over the `/dist` directory.
* `npm start`
  * **What it does**: Starts the compiled production output explicitly from your mapped `/dist/index.js` payload.

### Testing Scripts
* `npm run test`
  * **What it does**: Executes `jest --watchAll`.
  * **Use case**: Boot this in a secondary terminal. Jest will continuously listen to file changes, injecting testing databases automatically, and displaying live Pass/Fail green checkmarks as you actively write code.
* `npm run test:coverage`
  * **What it does**: Executes `jest --coverage`.
  * **Use case**: Runs the entire test suite once and mathematically calculates the exact percentage of application code lines physically touched by your testing vectors. Generates a graphical table for QA review.

### Database Utility Scripts
* `npm run data:import` (mapped manually via `npx ts-node src/seeder.ts`)
  * **What it does**: Physically wipes your linked MongoDB Atlas collections and natively repopulates them explicitly with structured mock Users and 3 specific mock Flights. Ideal for resetting your Postman environment.

---

## Comprehensive Test Cases Log
The Software Testing matrix implements explicit HTTP interception testing cleanly isolating your real data safely via Sandbox databases securely mapped by Jest. We execute 9 specific test algorithms directly assessing our Codebase.

### 1. Integration: The Flight Controller Module (`flightController.test.ts`)
* **Test Case 1 (Positive): Empty Database Assertions**
  * Submits `GET /api/flights` against a blank memory database. Asserts strict `200 OK` return codes enforcing that empty arrays `[]` are handled natively without crashing.
* **Test Case 2 (Positive): Database Population Mapping**
  * Programmatically builds a mock Flight natively into Mongoose, executes `GET /api/flights/`, and explicitly asserts the response Array physically contains exactly 1 block matching the string `"IndiGo Mock"`.
* **Test Case 3 (Negative): Auth Guard Injections**
  * Attempts to submit a `POST /api/flights` block utterly devoid of a Bearer Token. Asserts the Express middleware rigidly halts execution, strictly returning `401 Unauthorized`.

### 2. Integration: The Booking Controller Module (`bookingController.test.ts`)
* **Test Case 4 (Positive): Logical Mathematical Deductions**
  * Creates a booking successfully. Intercepts the response securely and queries the MongoDB `Flights` table explicitly, natively asserting that `availableSeats` was sequentially reduced exactly from `2` down to `1`.
* **Test Case 5 (Negative): Phantom Table Targeting**
  * Submits an exact 24-character Mongoose ID that inherently doesn't exist. Ascertains that the software smoothly calculates the void returning a secure `404 Flight not found` without terminating Node statically.
* **Test Case 6 (Negative): Overbooking Constraints**
  * Modifies a live flight setting `availableSeats = 0`. Attempts a standard Booking POST. Asserts the controller dynamically intercepts the bounds, completely aborting the payment loop and sending a `400 Bad Request` mapping "No seats available".
* **Test Case 7 (Positive): Foreign Key Array Population**
  * Calls `GET /api/bookings`. Asserts Mongoose successfully parsed the internal references natively expanding the HEX Object IDs dynamically into nested Flight JSON properties flawlessly.

### 3. Unit Testing: The Express Middlewares Module (`validateMiddleware.test.ts`)
* **Test Case 8 (Positive): Zod HTTP Interception**
  * Detaches Javascript cleanly away from Express endpoints natively. Fires mock Request strings matching standard schemas. Asserts Jest Mock `next()` functions are securely called precisely 1 time.
* **Test Case 9 (Negative): Zod HTTP Blocks**
  * Implements invalid Numbers structurally targeting a String parameter. Asserts `next()` triggers 0 times, completely halting the Express tree natively while verifying `res.status(400)` functions execute sequentially throwing strict formatting logs natively.

---

## API Documentation 
Every specific route logic algorithm natively outputs automatically via a visually readable dashboard natively generated by Swagger. 
* Turn on the server via `npm run dev`.
* Navigate a web browser to `http://localhost:5000/api-docs`.

### Core Endpoints Matrix:
* `GET /api/flights` (Search Engine natively accepting `maxPrice`, `minSeats`, and explicitly sequencing via `sortBy=price:desc`)
* `POST /api/flights` (Admin strict creation)
* `PUT /api/flights/:id` | `DELETE /api/flights/:id` (Admin strict overriding)
* `POST /api/users/signup` | `POST /api/users/login` (Authentication & Security Hashes)
* `GET /api/users/profile` (Private Payload Fetching)
* `POST /api/bookings` (Live logical booking engine)
* `GET /api/bookings` (Historical payload expansions)
* `PUT /api/bookings/:id/cancel` (Logical ticket reversals & explicit seat pool refunds)
