# Governance: approvals, workflows, roles, provisioning

Runnable: [`scripts/api/approvals.mjs`](../scripts/api/approvals.mjs),
[`scripts/api/members.mjs`](../scripts/api/members.mjs).

## Approvals

Require review before a flag change lands in a protected environment. Docs:
<https://launchdarkly.com/docs/home/releases/approvals>

```bash
node scripts/api/approvals.mjs request beta-checkout on          # request a change
node scripts/api/approvals.mjs review  <approval-id> approve     # a reviewer approves
node scripts/api/approvals.mjs list
```

Flow: requester proposes an instruction → configured reviewers approve/decline →
on approval the change applies (or is applied by the requester).

## Workflows & scheduling

- **Scheduled changes** — apply a flag change at a future time (e.g. turn a
  feature on Monday 9am).
- **Workflows** — multi-step, ordered release automation (progress a rollout on a
  schedule, gated by approvals). `GET/POST /projects/{p}/flags/{f}/environments/{e}/workflows`

## RBAC / custom roles

Base roles: **reader, writer, admin, owner**. Custom roles use resource
specifiers + allow/deny policies for fine-grained control.

```bash
node scripts/api/members.mjs roles          # list custom roles
node scripts/api/members.mjs invite dev@example.com writer
node scripts/api/members.mjs teams          # teams bundle members + roles
```

## User provisioning & access

- **SCIM / SSO** — provision members from Okta, Entra ID, etc.; SAML SSO for
  login. Docs: <https://launchdarkly.com/docs/home/account/sso>
- **IP allowlisting** — restrict dashboard/API access to known networks
  (Enterprise).
- **Audit log** — every change is recorded; query it via
  `scripts/api/auditlog.mjs recent`.
