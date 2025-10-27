# Scenario 2: Cross-File Import/Export Dependency Chain

## Bug Target
Bot comments on lines 9-13 in types.ts (UserPreferences interface) even though only line 6 in user-service.ts changed.

## The Change
Only change: `getUser(id: number): UserData | null` → `async getUser(id: number): Promise<UserData | null>`

## Expected Bug Behavior
- Bot should comment only on line 6 in `user-service.ts` where async was added
- Instead, bot comments on lines 9-13 in `types.ts` (UserPreferences interface)
- Bug occurs because bot detects async pattern affects interface usage and cross-references dependencies

## Files
- `types.ts` - Unchanged interfaces (UserData, UserPreferences)
- `user-service-original.ts` - Original version without async
- `user-service.ts` - Modified version with async on getUser method
- The bot analyzes the async change and incorrectly determines it affects the UserPreferences interface

## Root Cause
Bot's pattern matching detects that adding async changes the return type from UserData to Promise<UserData>, then incorrectly assumes this affects all related interfaces in the dependency chain.