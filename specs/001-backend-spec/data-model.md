# Data Model: Task Management API

## Entity: Task

### Fields
- **id**: Integer (Primary Key, Auto-increment)
  - Purpose: Unique identifier for each task
  - Constraints: Not null, auto-generated
  
- **user_id**: String (Foreign Key Reference)
  - Purpose: Links task to the user who owns it
  - Constraints: Not null, indexed for performance
  - Length: Up to 255 characters
  
- **title**: String
  - Purpose: Brief description of the task
  - Constraints: Not null, length between 1-200 characters
  
- **description**: String (Optional)
  - Purpose: Detailed information about the task
  - Constraints: Nullable, length up to 1000 characters
  
- **completed**: Boolean
  - Purpose: Tracks completion status of the task
  - Constraints: Not null, defaults to false
  
- **created_at**: DateTime
  - Purpose: Timestamp when the task was created
  - Constraints: Not null, defaults to current timestamp
  
- **updated_at**: DateTime
  - Purpose: Timestamp when the task was last modified
  - Constraints: Not null, defaults to current timestamp and updates on modification

### Relationships
- **Owner Relationship**: Each task belongs to one user (identified by user_id)
- **User Relationship**: One user can have many tasks

### Validation Rules
- Title must be between 1 and 200 characters
- Description must be between 0 and 1000 characters if provided
- user_id must match the authenticated user's ID for access
- completed defaults to false when creating new tasks

### Indexes
- Primary Key index on `id`
- Index on `user_id` for efficient retrieval of user-specific tasks
- Composite index on `user_id` and `completed` for filtered queries
- Index on `created_at` for chronological sorting

## Entity: User (External Reference)

### Fields (Referenced from Auth System)
- **user_id**: String (Primary identifier from JWT token)
  - Purpose: Unique identifier for each user
  - Constraints: Comes from Better Auth system, must match JWT sub claim

### Relationships
- **Owned Tasks**: One user can own many tasks