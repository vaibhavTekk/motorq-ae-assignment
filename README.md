## MotorQ AE Assignment

## Admin Login

email : admin@example.com
password: adminpassword

## Requester login

email: requester@example.com
password: requesterpassword

API ROUTES:

Auth and User:

- [ ] /auth - middleware to decrypt JWT
- [ ] /auth/login - validates data and returns JWT
- [ ] ~~/auth/refresh - refresh existing token~~
- [ ] /auth/logout - invalidate token / remove token from local storage

DONE

USER Schema:
Name\
Email\
Password (hashed)\
Roles : ['admin','approver','requester']

USER API ROUTES:

- [ ] /user/me - returns currently logged in user details
- [ ] /users - lists all available users (needs to be approver or admin)
- [ ] /user/:id - get user Details
- [ ] UPDATE /user/:id/addRole - add specified role to specified user (admin only)
- [ ] UPDATE /user/:id/removeRole - remove specified role to specified user (admin only)

DONE

WORKFLOW:

- [ ] /workflows/ - get available workflows
- [ ] POST /workflow/ - create workflow (admin only)
- [ ] GET /workflow/:id - get details of workflow of specified id

WORKFLOW SCHEMA:

- Workflow ID
- Workflow name
- Info
- Created By
- Approvers [ ]
- Approval Type ['Everyone','Atleast Two','Anyone']

DONE

REQUEST SCHEMA:

- requestID
- request Name
- request Description
- Attachments : [ ]
- workflow type
- approved by: [ ]
- Status:

API ROUTES:

- [ ] POST /request/ by requester - make it ready for review body contains details
- [ ] POST /request/:id/accept change status to under Review
- [ ] POST /request/:id/approve - needs to be under review, add an approval adjacent to approver, if all approvers approved, move to approve
- [ ] POST /request/:id/reject - needs to be under review - change to reject
- [ ] POST /request/:id/review -
- [ ] UPDATE /request/:id - by requester, if under justification required make changes, ready for review
- [ ]
