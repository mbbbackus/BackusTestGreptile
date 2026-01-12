# Complete API Reference Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks](#webhooks)
9. [SDKs and Libraries](#sdks-and-libraries)
10. [Best Practices](#best-practices)

## Introduction

This comprehensive API reference documentation provides detailed information about all available endpoints, request/response formats, authentication mechanisms, error codes, and best practices for integrating with our platform. Whether you're building a simple integration or a complex application, this guide will help you understand how to effectively use our API.

### Overview

Our API is built on REST principles and uses standard HTTP methods (GET, POST, PUT, PATCH, DELETE) to perform operations. All responses are returned in JSON format, and we support JSON request bodies for POST and PUT requests. The API is versioned to ensure backward compatibility, and we maintain support for at least two major versions at any given time.

### Key Features

- **RESTful Architecture**: Clean, predictable URLs and standard HTTP methods
- **JSON Format**: All requests and responses use JSON
- **OAuth 2.0 Authentication**: Industry-standard authentication protocol
- **Rate Limiting**: Fair usage policies with clear limits
- **Webhooks**: Real-time event notifications
- **Comprehensive Error Messages**: Detailed error responses with actionable information
- **Pagination**: Efficient handling of large data sets
- **Filtering and Sorting**: Flexible query parameters for data retrieval
- **CORS Support**: Cross-origin requests for browser-based applications
- **API Versioning**: Backward compatible changes with clear deprecation policies

## Getting Started

### Prerequisites

Before you begin using the API, ensure you have:

1. Created an account on our platform
2. Generated API credentials from your account dashboard
3. Familiarized yourself with REST API concepts
4. Set up your development environment with HTTPS support
5. Reviewed our terms of service and acceptable use policy

### Quick Start Guide

Here's a simple example to get you started:

```bash
curl -X GET "https://api.example.com/v1/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:

```json
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:22:00Z",
  "status": "active"
}
```

### Authentication Setup

To authenticate your requests, you'll need to obtain an access token. Follow these steps:

1. Navigate to your account settings
2. Click on "API Credentials"
3. Generate a new API key
4. Store your credentials securely (never commit them to version control)
5. Use the access token in the Authorization header of all requests

Example authentication request:

```bash
curl -X POST "https://api.example.com/v1/auth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "your_client_id",
    "client_secret": "your_client_secret",
    "grant_type": "client_credentials"
  }'
```

## Core Concepts

### Resources

Resources are the fundamental building blocks of our API. Each resource represents a distinct entity in the system and can be accessed through its unique endpoint. Common resources include:

- **Users**: Individual user accounts with profiles and preferences
- **Organizations**: Group entities that contain multiple users
- **Projects**: Work units that belong to organizations
- **Tasks**: Individual items within projects
- **Comments**: Discussions and notes attached to tasks
- **Attachments**: Files and documents associated with various resources
- **Webhooks**: Event notification configurations
- **API Keys**: Authentication credentials for programmatic access

### Identifiers

All resources in our system are assigned unique identifiers (IDs) that follow a specific format:

- Format: `{resource_type}_{random_string}`
- Example: `user_a1b2c3d4e5f6`
- Length: Typically 20-24 characters
- Case: Always lowercase
- Pattern: Alphanumeric with underscores

These identifiers are immutable and remain constant throughout the lifetime of the resource. They are used in API endpoints to reference specific resources and in relationships between resources.

### Relationships

Resources in our system often have relationships with other resources. We support three types of relationships:

1. **One-to-One**: Each instance of Resource A is associated with exactly one instance of Resource B
2. **One-to-Many**: Each instance of Resource A can be associated with multiple instances of Resource B
3. **Many-to-Many**: Multiple instances of Resource A can be associated with multiple instances of Resource B

Example relationships:
- A User belongs to an Organization (one-to-one)
- An Organization has many Projects (one-to-many)
- A Task can have many Assignees, and a User can be assigned to many Tasks (many-to-many)

### Timestamps

All resources include standard timestamp fields that track when they were created and last modified:

- `created_at`: ISO 8601 formatted timestamp of when the resource was created
- `updated_at`: ISO 8601 formatted timestamp of the last modification
- `deleted_at`: ISO 8601 formatted timestamp of soft deletion (if applicable)

Example timestamp format: `2024-01-15T10:30:00Z`

### Pagination

For endpoints that return lists of resources, we implement cursor-based pagination to efficiently handle large datasets. Pagination parameters include:

- `limit`: Number of results per page (default: 20, max: 100)
- `cursor`: Opaque string pointing to a specific position in the result set
- `order`: Sort order (`asc` or `desc`)

Example paginated response:

```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzNDU2fQ==",
    "prev_cursor": "eyJpZCI6MTIzNDAwfQ==",
    "has_more": true,
    "total_count": 1500
  }
}
```

## API Endpoints

### Users

#### List Users

Retrieves a paginated list of all users in the system.

**Endpoint**: `GET /v1/users`

**Query Parameters**:
- `limit` (integer, optional): Number of results per page (1-100, default: 20)
- `cursor` (string, optional): Pagination cursor for fetching next/previous page
- `order` (string, optional): Sort order - `asc` or `desc` (default: `asc`)
- `status` (string, optional): Filter by status - `active`, `inactive`, `pending`
- `search` (string, optional): Search query for filtering by name or email
- `created_after` (string, optional): ISO 8601 timestamp to filter users created after this date
- `created_before` (string, optional): ISO 8601 timestamp to filter users created before this date

**Response**:

```json
{
  "data": [
    {
      "id": "user_12345",
      "email": "user1@example.com",
      "name": "Alice Smith",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:22:00Z"
    },
    {
      "id": "user_67890",
      "email": "user2@example.com",
      "name": "Bob Johnson",
      "status": "active",
      "created_at": "2024-01-16T11:45:00Z",
      "updated_at": "2024-01-21T09:15:00Z"
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6IjEyMzQ1Njc4OTAifQ==",
    "prev_cursor": null,
    "has_more": true,
    "total_count": 150
  }
}
```

#### Get User

Retrieves detailed information about a specific user.

**Endpoint**: `GET /v1/users/{user_id}`

**Path Parameters**:
- `user_id` (string, required): The unique identifier of the user

**Response**:

```json
{
  "id": "user_12345",
  "email": "user@example.com",
  "name": "Alice Smith",
  "status": "active",
  "avatar_url": "https://cdn.example.com/avatars/user_12345.jpg",
  "bio": "Product designer passionate about user experience",
  "location": "San Francisco, CA",
  "timezone": "America/Los_Angeles",
  "language": "en-US",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:22:00Z",
  "last_login_at": "2024-01-22T08:00:00Z",
  "metadata": {
    "department": "Design",
    "employee_id": "EMP-12345"
  }
}
```

#### Create User

Creates a new user in the system.

**Endpoint**: `POST /v1/users`

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "name": "Charlie Brown",
  "password": "SecurePassword123!",
  "send_welcome_email": true,
  "metadata": {
    "department": "Engineering",
    "employee_id": "EMP-67890"
  }
}
```

**Response**:

```json
{
  "id": "user_new123",
  "email": "newuser@example.com",
  "name": "Charlie Brown",
  "status": "pending",
  "created_at": "2024-01-23T10:00:00Z",
  "updated_at": "2024-01-23T10:00:00Z"
}
```

#### Update User

Updates an existing user's information.

**Endpoint**: `PATCH /v1/users/{user_id}`

**Path Parameters**:
- `user_id` (string, required): The unique identifier of the user

**Request Body**:

```json
{
  "name": "Alice Smith-Jones",
  "bio": "Senior Product Designer with 10 years of experience",
  "location": "Seattle, WA",
  "metadata": {
    "department": "Product Design",
    "title": "Senior Designer"
  }
}
```

**Response**: Returns the updated user object (same format as Get User)

#### Delete User

Soft deletes a user from the system. The user's data is retained for 30 days before permanent deletion.

**Endpoint**: `DELETE /v1/users/{user_id}`

**Path Parameters**:
- `user_id` (string, required): The unique identifier of the user

**Response**:

```json
{
  "id": "user_12345",
  "deleted": true,
  "deleted_at": "2024-01-23T15:30:00Z",
  "permanent_deletion_date": "2024-02-22T15:30:00Z"
}
```

### Organizations

#### List Organizations

Retrieves a paginated list of all organizations accessible to the authenticated user.

**Endpoint**: `GET /v1/organizations`

**Query Parameters**:
- `limit` (integer, optional): Number of results per page (1-100, default: 20)
- `cursor` (string, optional): Pagination cursor
- `order` (string, optional): Sort order - `asc` or `desc`
- `type` (string, optional): Filter by organization type - `company`, `team`, `personal`

**Response**:

```json
{
  "data": [
    {
      "id": "org_abc123",
      "name": "Acme Corporation",
      "slug": "acme-corp",
      "type": "company",
      "member_count": 150,
      "created_at": "2023-06-01T09:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  "pagination": {
    "next_cursor": "eyJpZCI6Im9yZ19hYmMxMjMifQ==",
    "prev_cursor": null,
    "has_more": false,
    "total_count": 1
  }
}
```

#### Get Organization

Retrieves detailed information about a specific organization.

**Endpoint**: `GET /v1/organizations/{org_id}`

**Path Parameters**:
- `org_id` (string, required): The unique identifier of the organization

**Response**:

```json
{
  "id": "org_abc123",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "type": "company",
  "description": "Leading provider of innovative solutions",
  "website": "https://acme-corp.com",
  "logo_url": "https://cdn.example.com/logos/org_abc123.png",
  "member_count": 150,
  "plan": "enterprise",
  "billing_email": "billing@acme-corp.com",
  "settings": {
    "require_2fa": true,
    "allow_public_signup": false,
    "default_project_visibility": "private"
  },
  "created_at": "2023-06-01T09:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

#### Create Organization

Creates a new organization.

**Endpoint**: `POST /v1/organizations`

**Request Body**:

```json
{
  "name": "New Startup Inc",
  "slug": "new-startup",
  "type": "company",
  "description": "An exciting new venture",
  "website": "https://newstartup.com"
}
```

**Response**: Returns the newly created organization object

### Projects

#### List Projects

Retrieves a paginated list of projects within an organization.

**Endpoint**: `GET /v1/organizations/{org_id}/projects`

**Path Parameters**:
- `org_id` (string, required): The unique identifier of the organization

**Query Parameters**:
- `limit` (integer, optional): Number of results per page
- `cursor` (string, optional): Pagination cursor
- `status` (string, optional): Filter by status - `active`, `archived`, `draft`
- `visibility` (string, optional): Filter by visibility - `public`, `private`

**Response**:

```json
{
  "data": [
    {
      "id": "proj_xyz789",
      "name": "Q1 Marketing Campaign",
      "description": "Planning and execution of Q1 marketing initiatives",
      "status": "active",
      "visibility": "private",
      "owner_id": "user_12345",
      "member_count": 8,
      "task_count": 42,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-22T16:45:00Z"
    }
  ],
  "pagination": {
    "next_cursor": null,
    "prev_cursor": null,
    "has_more": false,
    "total_count": 1
  }
}
```

#### Get Project

Retrieves detailed information about a specific project.

**Endpoint**: `GET /v1/projects/{project_id}`

**Response**:

```json
{
  "id": "proj_xyz789",
  "name": "Q1 Marketing Campaign",
  "description": "Planning and execution of Q1 marketing initiatives",
  "status": "active",
  "visibility": "private",
  "owner": {
    "id": "user_12345",
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "organization": {
    "id": "org_abc123",
    "name": "Acme Corporation"
  },
  "members": [
    {
      "user_id": "user_12345",
      "role": "owner",
      "added_at": "2024-01-01T00:00:00Z"
    }
  ],
  "statistics": {
    "total_tasks": 42,
    "completed_tasks": 18,
    "in_progress_tasks": 15,
    "pending_tasks": 9
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-22T16:45:00Z"
}
```

#### Create Project

Creates a new project within an organization.

**Endpoint**: `POST /v1/organizations/{org_id}/projects`

**Request Body**:

```json
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "visibility": "private",
  "template_id": "template_web_project"
}
```

**Response**: Returns the newly created project object

### Tasks

#### List Tasks

Retrieves a paginated list of tasks within a project.

**Endpoint**: `GET /v1/projects/{project_id}/tasks`

**Query Parameters**:
- `status` (string, optional): Filter by status - `todo`, `in_progress`, `completed`, `blocked`
- `assignee_id` (string, optional): Filter by assigned user
- `priority` (string, optional): Filter by priority - `low`, `medium`, `high`, `urgent`
- `due_before` (string, optional): ISO 8601 timestamp
- `due_after` (string, optional): ISO 8601 timestamp

**Response**:

```json
{
  "data": [
    {
      "id": "task_def456",
      "title": "Design homepage mockups",
      "description": "Create high-fidelity mockups for new homepage",
      "status": "in_progress",
      "priority": "high",
      "assignee": {
        "id": "user_12345",
        "name": "Alice Smith"
      },
      "due_date": "2024-01-30T23:59:59Z",
      "completed_at": null,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-22T14:30:00Z"
    }
  ],
  "pagination": {
    "next_cursor": null,
    "prev_cursor": null,
    "has_more": false,
    "total_count": 1
  }
}
```

#### Create Task

Creates a new task within a project.

**Endpoint**: `POST /v1/projects/{project_id}/tasks`

**Request Body**:

```json
{
  "title": "Implement login form",
  "description": "Build responsive login form with validation",
  "status": "todo",
  "priority": "medium",
  "assignee_id": "user_67890",
  "due_date": "2024-02-15T23:59:59Z",
  "tags": ["frontend", "authentication"]
}
```

**Response**: Returns the newly created task object

## Authentication

Our API uses OAuth 2.0 for authentication. We support multiple grant types to accommodate different use cases:

### Client Credentials Grant

Used for server-to-server authentication where user interaction is not required.

**Endpoint**: `POST /v1/auth/token`

**Request**:

```json
{
  "grant_type": "client_credentials",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "scope": "read write"
}
```

**Response**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### Authorization Code Grant

Used for applications that need to act on behalf of a user.

**Step 1**: Redirect user to authorization URL:

```
GET https://api.example.com/v1/auth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read+write&
  state=RANDOM_STRING
```

**Step 2**: Exchange authorization code for access token:

```json
POST /v1/auth/token
{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "redirect_uri": "your_redirect_uri"
}
```

### Refresh Token

Use a refresh token to obtain a new access token without re-authenticating.

**Endpoint**: `POST /v1/auth/token`

**Request**:

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "your_refresh_token",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

### Using Access Tokens

Include the access token in the Authorization header of all API requests:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Token Expiration

Access tokens are valid for 1 hour. Refresh tokens are valid for 30 days. When an access token expires, you'll receive a 401 Unauthorized response. Use the refresh token to obtain a new access token.

### Revoking Tokens

To revoke an access token or refresh token:

**Endpoint**: `POST /v1/auth/revoke`

**Request**:

```json
{
  "token": "token_to_revoke",
  "token_type_hint": "access_token"
}
```

## Error Handling

Our API uses standard HTTP status codes to indicate success or failure of requests. When an error occurs, the response body contains detailed information to help you diagnose the issue.

### HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource successfully created
- **204 No Content**: Request succeeded with no response body
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but insufficient permissions
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Request conflicts with current state
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service temporarily unavailable

### Error Response Format

```json
{
  "error": {
    "code": "validation_error",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "email",
        "message": "Email address is not valid",
        "code": "invalid_format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters",
        "code": "too_short"
      }
    ],
    "request_id": "req_abc123xyz",
    "documentation_url": "https://docs.example.com/errors/validation_error"
  }
}
```

### Common Error Codes

- `authentication_failed`: Invalid credentials or expired token
- `authorization_failed`: Insufficient permissions
- `validation_error`: Request validation failed
- `not_found`: Resource not found
- `rate_limit_exceeded`: Too many requests
- `conflict`: Resource state conflict
- `internal_error`: Server-side error
- `service_unavailable`: Temporary service disruption

### Error Handling Best Practices

1. Always check HTTP status codes
2. Parse error response bodies for detailed information
3. Implement exponential backoff for rate limit errors
4. Log error details including request_id for debugging
5. Display user-friendly error messages in your UI
6. Handle network errors gracefully
7. Implement retry logic for transient errors

## Rate Limiting

To ensure fair usage and system stability, we implement rate limiting across our API endpoints.

### Rate Limit Tiers

- **Free Tier**: 100 requests per minute
- **Pro Tier**: 1,000 requests per minute
- **Enterprise Tier**: 10,000 requests per minute

### Rate Limit Headers

Every API response includes headers with rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640000000
```

### Handling Rate Limits

When you exceed the rate limit, you'll receive a 429 status code:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded your rate limit",
    "retry_after": 60
  }
}
```

Implement exponential backoff when you receive a 429 response.

## Webhooks

Webhooks allow you to receive real-time notifications when events occur in your account.

### Creating Webhooks

**Endpoint**: `POST /v1/webhooks`

**Request**:

```json
{
  "url": "https://your-app.com/webhook-handler",
  "events": ["user.created", "task.completed"],
  "secret": "your_webhook_secret"
}
```

### Webhook Events

Available event types:

- `user.created`
- `user.updated`
- `user.deleted`
- `project.created`
- `project.updated`
- `task.created`
- `task.completed`
- `comment.added`

### Webhook Payload

```json
{
  "event": "task.completed",
  "timestamp": "2024-01-23T15:30:00Z",
  "data": {
    "id": "task_def456",
    "title": "Design homepage mockups",
    "completed_by": "user_12345",
    "completed_at": "2024-01-23T15:30:00Z"
  }
}
```

### Verifying Webhooks

Verify webhook signatures using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature === computedSignature;
}
```

## Best Practices

### Security

1. Always use HTTPS for API requests
2. Store credentials securely (use environment variables)
3. Implement proper error handling
4. Validate and sanitize all input data
5. Use refresh tokens appropriately
6. Implement rate limiting in your application
7. Monitor for suspicious activity

### Performance

1. Use pagination for large datasets
2. Implement caching where appropriate
3. Use batch endpoints when available
4. Minimize unnecessary API calls
5. Compress request/response data
6. Use webhooks instead of polling

### Reliability

1. Implement exponential backoff for retries
2. Handle network timeouts gracefully
3. Log all API interactions
4. Monitor API response times
5. Set appropriate timeout values
6. Implement circuit breaker patterns

## Conclusion

This documentation provides a comprehensive overview of our API. For additional support, please contact our developer support team at api-support@example.com or visit our developer portal at https://developers.example.com.

Version: 1.0.0
Last Updated: January 23, 2024

## Advanced Topics

### Custom Field Definitions

You can define custom fields for various resource types to extend the default schema.

#### Creating Custom Fields

**Endpoint**: `POST /v1/custom_fields`

**Request**:

```json
{
  "resource_type": "task",
  "field_name": "estimated_hours",
  "field_type": "number",
  "required": false,
  "default_value": 0,
  "validation": {
    "min": 0,
    "max": 1000
  }
}
```

### Bulk Operations

For efficiency, we provide bulk endpoints that allow you to perform operations on multiple resources in a single request.

#### Bulk Create Tasks

**Endpoint**: `POST /v1/projects/{project_id}/tasks/bulk`

**Request**:

```json
{
  "tasks": [
    {
      "title": "Task 1",
      "description": "First task",
      "status": "todo"
    },
    {
      "title": "Task 2",
      "description": "Second task",
      "status": "todo"
    }
  ]
}
```

**Response**:

```json
{
  "created": [
    {"id": "task_001", "title": "Task 1"},
    {"id": "task_002", "title": "Task 2"}
  ],
  "errors": []
}
```

### Search API

Our search API provides powerful full-text search capabilities across all your resources.

#### Search Endpoint

**Endpoint**: `GET /v1/search`

**Query Parameters**:
- `q` (string, required): Search query
- `type` (string, optional): Resource type filter
- `limit` (integer, optional): Number of results

**Example**:

```bash
GET /v1/search?q=design+mockup&type=task&limit=10
```

**Response**:

```json
{
  "results": [
    {
      "type": "task",
      "id": "task_def456",
      "title": "Design homepage mockups",
      "snippet": "Create high-fidelity <em>mockups</em> for new homepage <em>design</em>",
      "score": 0.95
    }
  ],
  "total_count": 1,
  "query_time_ms": 45
}
```

### File Attachments

Upload and manage file attachments for tasks and comments.

#### Upload File

**Endpoint**: `POST /v1/attachments`

**Request**: Multipart form data

```bash
curl -X POST "https://api.example.com/v1/attachments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "resource_type=task" \
  -F "resource_id=task_def456"
```

**Response**:

```json
{
  "id": "att_ghi789",
  "filename": "file.pdf",
  "size": 1048576,
  "mime_type": "application/pdf",
  "url": "https://cdn.example.com/attachments/att_ghi789/file.pdf",
  "created_at": "2024-01-23T10:00:00Z"
}
```

### Activity Logs

Track all changes and activities within your organization.

#### List Activities

**Endpoint**: `GET /v1/organizations/{org_id}/activities`

**Response**:

```json
{
  "data": [
    {
      "id": "activity_123",
      "type": "task.completed",
      "actor": {
        "id": "user_12345",
        "name": "Alice Smith"
      },
      "resource": {
        "type": "task",
        "id": "task_def456",
        "title": "Design homepage mockups"
      },
      "timestamp": "2024-01-23T15:30:00Z"
    }
  ]
}
```

### Analytics and Reporting

Access analytics data for your organization.

#### Get Project Analytics

**Endpoint**: `GET /v1/projects/{project_id}/analytics`

**Query Parameters**:
- `start_date` (string, required): Start date in ISO 8601 format
- `end_date` (string, required): End date in ISO 8601 format
- `granularity` (string, optional): `day`, `week`, `month`

**Response**:

```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "metrics": {
    "tasks_created": 45,
    "tasks_completed": 38,
    "average_completion_time_hours": 24.5,
    "active_members": 12
  },
  "trends": [
    {
      "date": "2024-01-01",
      "tasks_created": 2,
      "tasks_completed": 1
    }
  ]
}
```

### Comments and Discussions

Add threaded comments to tasks and other resources.

#### List Comments

**Endpoint**: `GET /v1/tasks/{task_id}/comments`

**Response**:

```json
{
  "data": [
    {
      "id": "comment_abc",
      "body": "Great progress on this!",
      "author": {
        "id": "user_12345",
        "name": "Alice Smith"
      },
      "parent_id": null,
      "replies": [
        {
          "id": "comment_def",
          "body": "Thanks! Almost done.",
          "author": {
            "id": "user_67890",
            "name": "Bob Johnson"
          },
          "created_at": "2024-01-23T11:00:00Z"
        }
      ],
      "created_at": "2024-01-23T10:30:00Z"
    }
  ]
}
```

#### Create Comment

**Endpoint**: `POST /v1/tasks/{task_id}/comments`

**Request**:

```json
{
  "body": "This looks good to me!",
  "parent_id": null
}
```

### Labels and Tags

Organize resources using labels and tags.

#### List Labels

**Endpoint**: `GET /v1/organizations/{org_id}/labels`

**Response**:

```json
{
  "data": [
    {
      "id": "label_red",
      "name": "High Priority",
      "color": "#FF0000",
      "usage_count": 23
    }
  ]
}
```

### Notifications

Manage user notifications and preferences.

#### List Notifications

**Endpoint**: `GET /v1/notifications`

**Query Parameters**:
- `read` (boolean, optional): Filter by read status
- `type` (string, optional): Filter by notification type

**Response**:

```json
{
  "data": [
    {
      "id": "notif_123",
      "type": "task_assigned",
      "title": "You were assigned to a task",
      "body": "Alice assigned you to 'Design homepage mockups'",
      "read": false,
      "action_url": "/tasks/task_def456",
      "created_at": "2024-01-23T09:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read

**Endpoint**: `PATCH /v1/notifications/{notification_id}`

**Request**:

```json
{
  "read": true
}
```

## API Versioning

We use URL-based versioning for our API. The current version is `v1`, and all endpoints are prefixed with `/v1/`.

### Version Support Policy

- We support the current version (v1) indefinitely
- When a new version is released, we provide at least 12 months of support for the previous version
- Deprecated endpoints will show warnings in response headers
- Breaking changes are only introduced in new major versions

### Deprecation Process

1. **Announcement**: Deprecation announced 6 months in advance
2. **Warning Headers**: Deprecated endpoints return warning headers
3. **Documentation**: Clear migration guides provided
4. **Sunset Date**: Specific date when endpoint will be removed
5. **Final Removal**: Endpoint removed on sunset date

## SDK Examples

### JavaScript/Node.js

```javascript
const APIClient = require('example-api-client');

const client = new APIClient({
  accessToken: process.env.API_ACCESS_TOKEN
});

// List users
const users = await client.users.list({
  limit: 50,
  status: 'active'
});

// Create a task
const task = await client.tasks.create('proj_xyz789', {
  title: 'New feature implementation',
  status: 'todo',
  priority: 'high'
});

// Update task
await client.tasks.update(task.id, {
  status: 'in_progress'
});
```

### Python

```python
from example_api import Client

client = Client(access_token=os.environ['API_ACCESS_TOKEN'])

# List users
users = client.users.list(limit=50, status='active')

# Create a task
task = client.tasks.create(
    project_id='proj_xyz789',
    title='New feature implementation',
    status='todo',
    priority='high'
)

# Update task
client.tasks.update(task.id, status='in_progress')
```

### Ruby

```ruby
require 'example_api'

client = ExampleAPI::Client.new(
  access_token: ENV['API_ACCESS_TOKEN']
)

# List users
users = client.users.list(limit: 50, status: 'active')

# Create a task
task = client.tasks.create(
  project_id: 'proj_xyz789',
  title: 'New feature implementation',
  status: 'todo',
  priority: 'high'
)

# Update task
client.tasks.update(task.id, status: 'in_progress')
```

## FAQ

### How do I get started?

1. Sign up for an account
2. Generate API credentials
3. Make your first API request
4. Explore the documentation

### What's the rate limit?

Rate limits vary by tier. See the Rate Limiting section for details.

### How do I report bugs?

Contact api-support@example.com with details including request IDs and error messages.

### Is there a sandbox environment?

Yes, use https://sandbox-api.example.com for testing.

### How are breaking changes handled?

Breaking changes are only introduced in new major versions with 12 months advance notice.

## Appendix A: Complete Field Reference

### User Fields

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| id | string | Unique identifier | Auto-generated | N/A |
| email | string | Email address | Yes | None |
| name | string | Full name | Yes | None |
| password | string | User password | On create | None |
| status | enum | Account status | No | 'pending' |
| avatar_url | string | Profile picture URL | No | null |
| bio | string | User biography | No | null |
| location | string | User location | No | null |
| timezone | string | User timezone | No | 'UTC' |
| language | string | Preferred language | No | 'en-US' |
| created_at | timestamp | Creation time | Auto | Current time |
| updated_at | timestamp | Last update time | Auto | Current time |
| last_login_at | timestamp | Last login time | Auto | null |
| metadata | object | Custom metadata | No | {} |

### Organization Fields

| Field | Type | Description | Required | Default |
|-------|------|-------------|----------|---------|
| id | string | Unique identifier | Auto-generated | N/A |
| name | string | Organization name | Yes | None |
| slug | string | URL-safe identifier | Yes | None |
| type | enum | Organization type | No | 'team' |
| description | string | Organization description | No | null |
| website | string | Organization website | No | null |
| logo_url | string | Logo URL | No | null |
| member_count | integer | Number of members | Auto | 0 |
| plan | enum | Subscription plan | Auto | 'free' |
| billing_email | string | Billing contact email | No | owner email |
| settings | object | Organization settings | No | {} |
| created_at | timestamp | Creation time | Auto | Current time |
| updated_at | timestamp | Last update time | Auto | Current time |

## Appendix B: HTTP Status Code Reference

Complete list of HTTP status codes used by our API:

- 200 OK - Request succeeded
- 201 Created - Resource created successfully
- 202 Accepted - Request accepted for processing
- 204 No Content - Request succeeded, no response body
- 400 Bad Request - Invalid request syntax
- 401 Unauthorized - Authentication required
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 405 Method Not Allowed - HTTP method not supported
- 406 Not Acceptable - Requested format not available
- 409 Conflict - Request conflicts with current state
- 410 Gone - Resource permanently deleted
- 422 Unprocessable Entity - Validation failed
- 429 Too Many Requests - Rate limit exceeded
- 500 Internal Server Error - Server error
- 502 Bad Gateway - Invalid response from upstream server
- 503 Service Unavailable - Service temporarily unavailable
- 504 Gateway Timeout - Upstream server timeout

## Appendix C: Changelog

### Version 1.0.0 (January 2024)

- Initial public release
- Core CRUD operations for users, organizations, projects, tasks
- OAuth 2.0 authentication
- Webhook support
- Rate limiting
- Search functionality
- File attachments
- Activity logs
- Analytics endpoints

### Version 0.9.0 Beta (December 2023)

- Beta release for early adopters
- Basic CRUD operations
- API key authentication
- Limited webhook support

### Version 0.5.0 Alpha (November 2023)

- Internal alpha release
- Prototype endpoints
- Testing infrastructure
