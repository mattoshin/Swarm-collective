---
type: project
title: Swarm Collective Handoff
captured_at: '2026-09-11T03:26:43.029Z'
captured_via: gstack-code-0941f48d-22ceef
ingested_via: put_page
ingested_at: '2026-09-11T03:26:46.371Z'
source_kind: put_page
---

# Swarm Collective Handoff

Updated: September 12, 2026

## Resolved (2026-09-11)

Both pending PRs merged to `main`:

- PR #2 `feat/crm-member-fields` — Instagram field + full member profile in
  the CRM. Migration `20260911_member_instagram.sql` confirmed live on
  Element's Supabase project (`ouundztbpxnwzacmxowa`).
- PR #3 `feat/reusable-invite-links` — personal invite links are now
  reusable for 6 months (`expires_at` / `redemption_count`). Migration
  `20260911_invite_reuse_expiry.sql` applied.

No open blockers.

## Product

Swarm Collective is a private, member-visible directory and lightweight CRM at [swarmcollective.world](https://swarmcollective.world). Members can discover one another, share contact and background information, and invite new people into the community.

The repository is intended to be open source. Never commit member records, live invite links, API keys, environment values, or other credentials.

## Live state

- Production branch: `main`
- Hosting: Vercel
- Primary domain: `https://swarmcollective.world`
- `www` domain: `https://www.swarmcollective.world`
- Database: Supabase
- Transactional email: Resend from the verified Swarm domain
- Latest verified release: `095f11e`

## Member experience

1. A prospective member opens an invitation link and completes a profile.
2. Swarm emails a one-time sign-in link to the submitted address.
3. The link expires after 15 minutes and can be redeemed only once.
4. Successful verification creates a signed, HTTP-only session lasting 30 days.
5. First-time members see a reminder to bookmark the site.
6. Signed-in members can view the full directory and create new one-time invitation links.

The production flow was verified end to end on September 10, 2026. The branded sign-in email arrived in Gmail's Primary inbox, the link redeemed successfully, the bookmark screen appeared, the directory loaded, and a member-generated invitation was created.

## Permissions

### All verified members

- View member profiles and contact information
- Open the meetings page and RSVP
- Generate one-time invitation links
- Review the status of invitations they created

### Administrators only

- Open the CRM dashboard
- Read and edit private admin notes
- Create meetings and email the verified membership

Admin status is assigned from `SWARM_ADMIN_EMAILS`. Server actions re-check the current verified member before performing protected operations.

## Authentication and invitations

- Passwords are not stored or used.
- Login tokens contain 32 random bytes. Only SHA-256 hashes are stored in the database.
- Requesting a new login link invalidates earlier unused links for that member.
- Login token redemption uses an atomic unused-token check.
- Session cookies are HMAC-signed, HTTP-only, secure in production, and `SameSite=Lax`.
- Personal invitation codes use cryptographically secure randomness.
- Personal invitations are single-use and protected against simultaneous redemption.
- The shared group-chat invitation is controlled by `SWARM_INVITE_TOKEN` and is intentionally reusable.

Anyone who joins through either valid invitation path must verify control of their email before accessing the directory. Once verified, that member can create personal invitations for others.

## Member profile fields

- Name
- Email
- Phone number
- Career title
- Company or workplace
- College
- Location
- Interests
- Biography
- LinkedIn URL
- Personal website URL
- Instagram
- Additional public information
- Private administrator notes

## Important files

- `src/lib/members.ts`: member records, invitation creation, and invitation redemption
- `src/lib/magic-link.ts`: login token issuance, branded email, and token redemption
- `src/lib/session.ts`: signed 30-day browser sessions
- `src/lib/email.ts`: Resend transport
- `src/app/join`: invited-member onboarding
- `src/app/enter`: returning-member sign-in
- `src/app/directory`: member directory and invitation controls
- `src/app/admin`: administrator CRM
- `src/app/meetings`: meeting scheduling and RSVPs
- `src/app/welcome`: bookmark reminder

## Verification commands

```bash
npm run typecheck
npm run lint
npm run build
```

Run secret-dependent Vercel commands through the 1Password wrapper:

```bash
~/.local/bin/with-automation-secrets vercel ls swarm-collective --yes
```

## Next product step (candidates, not yet chosen)

- Members have no page to edit their own profile after joining. Matthew has
  flagged this gap ("make editing your info and profile better").
- Design refresh: Matthew wants the site to feel high-tech, not gimmicky, and
  dislikes the current yellow editorial look (`9991a46`). Any UI work here
  must go through Refero research first per the standing design rule.
- Improve the meeting scheduler so an administrator can choose recipients,
  send polished invitation and reminder emails, and see RSVP totals. Preserve
  the existing rule that ordinary members can RSVP but cannot broadcast email
  to the membership.
