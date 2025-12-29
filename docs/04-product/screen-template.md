# [Screen Title] - [Role/Scope]

## Screen Information
- **Route**: `/{lang}/path/to/screen`
- **Role**: [Client|Employee|Admin|Shared|Public]
- **Status**: ✅ IMPLEMENTED
- **Related ALI**: [If any parent task exists from original backlog]
- **Implementation Date**: [YYYY-MM-DD if known]

## Description

[2-3 sentence description of what this screen does and its purpose in the application]

## User Story

Como [role], quiero [action] para [benefit/goal].

## Features Implemented

### Feature 1: [Feature Name]
- **Description**: [What it does]
- **Implementation**: [How it works - brief technical note]
- **User Action**: [What user can do]

### Feature 2: [Feature Name]
- **Description**: [What it does]
- **Implementation**: [How it works]
- **User Action**: [What user can do]

### Feature 3: [Feature Name]
- **Description**: [What it does]
- **Implementation**: [How it works]
- **User Action**: [What user can do]

## Technical Details

### Frontend
- **Component Path**: `/packages/web/src/app/[lang]/...`
- **Key Components**: [List main organisms/molecules/atoms used]
- **State Management**: [Zustand stores or React Query hooks if applicable]
- **Forms**: [React Hook Form + validation schemas if applicable]

### Backend
- **API Endpoints**:
  - `[METHOD] /api/endpoint` - [Description]
  - `[METHOD] /api/endpoint/:id` - [Description]
- **Services**: [List relevant NestJS services]
- **Database Models**: [List Prisma models used]
- **Validation**: [Zod schemas used]

### Authentication
- **Required**: [Yes|No]
- **Roles**: [Which roles can access]
- **Guards**: [JWT, Role-based, etc.]

## User Interface

### Layout
- **Template**: [Layout component used]
- **Navigation**: [How users navigate to/from this screen]
- **Responsive**: [Mobile/tablet/desktop behavior]

### Key Interactions
1. [User action 1] → [System response]
2. [User action 2] → [System response]
3. [User action 3] → [System response]

## Data Flow

### Input
- **User Inputs**: [What data user provides]
- **URL Parameters**: [Dynamic route params if any]
- **Query Parameters**: [Filters, pagination, etc.]

### Output
- **Displayed Data**: [What information is shown]
- **Actions Available**: [What operations user can perform]
- **Navigation**: [Where user can go from here]

## Integrations

### Internal
- [Links to related screens/features]

### External
- [Third-party services if any]

## Screenshots

_Add screenshots here if available_

- `./screenshots/[ali-number]-[screen-name]-overview.png`
- `./screenshots/[ali-number]-[screen-name]-detail.png`

## Related Screens

- [Link to related screen docs]
- [Link to parent/child screens]

## Testing

### Unit Tests
- **Location**: [Path to test files]
- **Coverage**: [Percentage if known]

### E2E Tests
- **Location**: [Path to Playwright tests]
- **Scenarios**: [List key test scenarios]

## Notes

### Implementation Details
- [Any important implementation notes]
- [Technical decisions made]
- [Known limitations]

### Future Improvements
- [Planned enhancements]
- [Technical debt items]

## References

- **JIRA Task**: [Link to JIRA issue]
- **Related ALI**: [Link to backlog task if exists]
- **Technical Spec**: [Link to detailed spec if exists]
- **Design Mockup**: [Link to Figma/design files if available]

---

**Last Updated**: [YYYY-MM-DD]
**Documented By**: [Name/Team]
**Status**: [DRAFT|COMPLETE|NEEDS_UPDATE]
