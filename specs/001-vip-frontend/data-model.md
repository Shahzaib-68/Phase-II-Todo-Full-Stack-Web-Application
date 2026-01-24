# Data Model: VIP Todo Frontend (Phase II)

## Entities

### User
Represents an authenticated user with unique identifier, session information, and associated tasks.

**Fields**:
- `id` (string): Unique identifier for the user
- `email` (string): User's email address
- `name` (string): User's display name
- `createdAt` (Date): Account creation timestamp
- `updatedAt` (Date): Last update timestamp

**Relationships**:
- One-to-many with Task (user has many tasks)

### Task
Represents a user's task with properties like title, description, completion status, creation date, and owner relationship.

**Fields**:
- `id` (string): Unique identifier for the task
- `userId` (string): Reference to the owning user
- `title` (string): Task title (required, max 255 chars)
- `description` (string): Optional task description (max 1000 chars)
- `completed` (boolean): Completion status (default: false)
- `createdAt` (Date): Task creation timestamp
- `updatedAt` (Date): Last update timestamp

**Validation Rules**:
- Title must be 1-255 characters
- Description must be 0-1000 characters if provided
- userId must reference an existing user
- createdAt and updatedAt are automatically managed

**State Transitions**:
- `incomplete` → `completed` (when user marks task as done)
- `completed` → `incomplete` (when user unmarks task)

## API Contract Models

### TaskRequest
Model for creating or updating tasks.

**Fields**:
- `title` (string): Task title (required)
- `description` (string): Optional task description
- `completed` (boolean): Completion status (optional, default: false)

### TaskResponse
Model for returning task data from API.

**Fields**:
- `id` (string): Unique identifier for the task
- `userId` (string): Reference to the owning user
- `title` (string): Task title
- `description` (string): Optional task description
- `completed` (boolean): Completion status
- `createdAt` (string): ISO date string for creation timestamp
- `updatedAt` (string): ISO date string for last update timestamp

### ErrorResponse
Model for API error responses.

**Fields**:
- `message` (string): Error message
- `code` (string): Error code
- `timestamp` (string): ISO date string for when error occurred

## State Management Models

### TaskState
Local state representation for tasks in the frontend.

**Fields**:
- `tasks` (Task[]): Array of user's tasks
- `loading` (boolean): Loading state indicator
- `error` (string | null): Error message if any
- `filter` ('all' | 'pending' | 'completed'): Current task filter

### AuthState
Authentication state representation in the frontend.

**Fields**:
- `user` (User | null): Current authenticated user
- `loading` (boolean): Authentication loading state
- `authenticated` (boolean): Authentication status
- `error` (string | null): Authentication error if any