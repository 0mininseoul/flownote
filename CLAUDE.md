# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flownote is an automated voice documentation service built with Next.js 14 (App Router). Users record audio, which is transcribed via Groq Whisper API, formatted by OpenAI GPT-4o-mini, and saved to Notion with optional Slack notifications. The app is a PWA with multilingual support (Korean/English).

**Critical: Audio files are NOT stored.** They are sent directly to Groq API for transcription, then discarded. Only text (transcripts and formatted content) is persisted in the database.

## Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint check
npm run lint

# Type check (no script in package.json - use directly)
npx tsc --noEmit
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 App Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth with Google OAuth
- **External APIs**: Groq Whisper (STT), OpenAI GPT-4o-mini (formatting), Notion API, Slack API

### Directory Structure

```
app/
├── api/              # API Routes
│   ├── recordings/   # Recording CRUD + processing
│   ├── formats/      # Custom format templates
│   ├── user/         # User data, usage, language, onboarding
│   ├── auth/         # OAuth callbacks (Google, Notion, Slack)
│   └── notion/       # Notion database/page operations
├── dashboard/        # Main recording interface
├── history/          # Recording list with status
├── settings/         # Account, integrations, formats
└── onboarding/       # 3-step setup flow

lib/
├── supabase/         # Client/server/middleware for Supabase
├── services/         # External API integrations
│   ├── whisper.ts    # Groq Whisper Large V3 STT
│   ├── openai.ts     # GPT-4o-mini formatting
│   ├── notion.ts     # Notion OAuth + page creation
│   └── slack.ts      # Slack OAuth + notifications
├── i18n/             # Korean/English translations
├── prompts.ts        # Document formatting prompts
└── auth.ts           # Auth helper functions

components/
├── recorder/         # Audio recording UI
├── history/          # Recording list components
├── settings/         # Settings page components
└── ...               # Other UI components

database/
├── schema.sql        # Base schema (users, recordings, custom_formats)
└── migrations/       # Incremental migrations (run in order)
```

### Database Schema

Three main tables (PostgreSQL with RLS):
- **users**: Auth, integrations (Notion/Slack tokens), usage tracking
- **recordings**: Metadata, status, transcript, formatted_content, error tracking
- **custom_formats**: User-defined document templates

**Key fields:**
- `recordings.audio_file_path`: Nullable (audio not stored)
- `recordings.status`: 'processing' | 'completed' | 'failed'
- `recordings.error_step`: Tracks which stage failed (upload, transcription, formatting, notion, slack)
- `users.notion_save_target_type`: 'database' | 'page' (where to save in Notion)
- `users.language`: 'ko' | 'en'
- `users.is_onboarded`: Boolean flag

### Recording Processing Flow

1. **POST /api/recordings**: Client uploads audio + metadata
2. Create recording record with `status: 'processing'`
3. Background async processing (no queue - production should use one):
   - **Transcription**: Send audio File to Groq Whisper API → get text
   - **Formatting**: Send transcript to OpenAI with format prompt → get formatted doc
   - **Notion**: Create page in user's database/page
   - **Slack**: Send notification (if configured)
4. Update recording status to 'completed' or 'failed'
5. Update user's monthly usage (`monthly_minutes_used`)

**Important**: Audio file is passed directly to `transcribeAudio()` and never written to disk/storage. After transcription, it's garbage collected.

### Supabase Client Patterns

- **Server Components/API Routes**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **Middleware**: Uses `updateSession()` from `@/lib/supabase/middleware`

Always check auth before operations:
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### Internationalization (i18n)

- Translations in `lib/i18n/translations.ts` (Korean/English)
- Language detection: Browser locale or user's saved preference
- Language persists through OAuth flows via URL params
- User can change language in settings

### PWA Configuration

- `public/manifest.json`: App metadata, icons, theme
- `public/sw.js`: Service worker for offline capability
- Icons in `public/icons/` and `public/logos/`

## Key Patterns

### Error Handling in Processing
The `processRecording()` function (in `/api/recordings/route.ts`) updates the recording with specific error steps:
```typescript
error_step: 'transcription' | 'formatting' | 'notion' | 'slack'
```
This allows users to see exactly where processing failed.

### Format Prompts
- Three default formats: 'meeting', 'interview', 'lecture'
- Prompts in `lib/prompts.ts` use `{{transcript}}` and `{{date}}` placeholders
- Users can create custom formats with their own prompts

### Monthly Usage Tracking
- Stored in `users.monthly_minutes_used`
- Checked before creating new recording (350-minute limit)
- Updated after successful transcription
- Reset monthly via `last_reset_at` timestamp

### OAuth Flows
- **Notion**: Requires `pages:read`, `pages:write` scopes; stores access token + database/page ID
- **Slack**: Requires `chat:write`, `channels:read`, `groups:read` scopes; stores access token + channel ID
- All OAuth callbacks preserve language settings via URL params

## Database Management

### Initial Setup
1. Run `database/schema.sql` in Supabase SQL Editor
2. Run migrations in order:
   - `add_language.sql`
   - `add_is_onboarded.sql`
   - `make_audio_file_path_nullable.sql`
   - `add_notion_save_target_fields.sql`
   - `add_processing_step.sql`
   - `add_error_tracking.sql`

### Adding Migrations
- Create new file in `database/migrations/`
- Update README.md and SETUP.md with migration order
- Test locally before production deployment

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY` (Whisper STT)
- `OPENAI_API_KEY` (GPT-4o-mini)
- `NOTION_CLIENT_ID`, `NOTION_CLIENT_SECRET`, `NOTION_REDIRECT_URI`
- `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_REDIRECT_URI`
- `NEXT_PUBLIC_APP_URL`

Optional:
- `WHISPER_API_KEY` (alternative STT provider, not currently used)

See `.env.example` for full structure.

## Common Gotchas

1. **Audio files are not stored**: Don't try to read from `audio_file_path` - it's nullable and unused
2. **Background processing is not queued**: In production, replace the async `processRecording()` call with a proper queue (e.g., BullMQ, Inngest)
3. **RLS is enabled**: Always filter by `user_id` in queries; Supabase policies enforce this
4. **OAuth redirects**: Must match exactly in provider settings (no trailing slash differences)
5. **Korean language**: Groq Whisper uses `language: "ko"` parameter for better Korean accuracy
6. **Service worker**: Changes to `sw.js` may require hard refresh or cache clear in browser

## Testing Guidelines

**CRITICAL**: When completing code updates, ALWAYS inform the user which parts they should manually test to verify the changes work correctly. This is MANDATORY for every code change.

For each update, provide:
1. **What to test**: Specific features, flows, or UI elements affected
2. **How to test**: Step-by-step testing instructions
3. **Expected behavior**: What should happen if working correctly
4. **Edge cases**: Specific scenarios to verify

### Testing Checklist by Update Type

**Database migrations:**
- [ ] Query affected table(s) to verify schema changes: `SELECT * FROM table_name LIMIT 1;`
- [ ] Create/update records with new fields via Supabase dashboard or API
- [ ] Verify existing data is unaffected
- [ ] Test RLS policies: try accessing data as different users
- [ ] Check triggers/functions execute correctly

**API endpoints:**
- [ ] Call endpoint with valid data (via UI, Postman, or curl)
- [ ] Call with invalid/missing data to verify error handling
- [ ] Check response format and status codes
- [ ] Verify data persistence in database
- [ ] Test auth protection: call without authentication
- [ ] Check server logs for errors

**UI components:**
- [ ] Interact with component in browser (click, type, navigate)
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Switch between Korean and English languages
- [ ] Check browser console for errors
- [ ] Verify loading/error states
- [ ] Test accessibility (keyboard navigation, screen reader)

**Recording flow:**
- [ ] Record short audio (10-20 seconds), verify transcription
- [ ] Check formatted output in database and Notion
- [ ] Verify `monthly_minutes_used` increments correctly
- [ ] Test with different format types (meeting, interview, lecture, custom)
- [ ] Test error handling: try without Notion/API credentials
- [ ] Check recording status updates in History page

**Integration features (Notion/Slack):**
- [ ] Complete OAuth flow from Settings page
- [ ] Verify tokens saved to database
- [ ] Trigger integration (e.g., create recording → check Slack notification)
- [ ] Verify result in external service (Notion page created, Slack message sent)
- [ ] Test disconnect and reconnect flow
- [ ] Test with missing/revoked credentials

**Authentication:**
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out and verify redirect
- [ ] Test protected routes without auth
- [ ] Verify session persistence across page refreshes

**Internationalization:**
- [ ] Switch language in Settings
- [ ] Verify all text updates immediately
- [ ] Test OAuth flows preserve language
- [ ] Check both Korean and English prompts generate correct output

### Example Testing Instructions

When you complete an update, format testing instructions like this:

```
## Testing Required

Please test the following to verify the changes:

1. **Database Migration - Referral System**
   - Open Supabase SQL Editor
   - Run: `SELECT referral_code, referred_by, bonus_minutes FROM users LIMIT 5;`
   - Expected: All users should have unique 8-character referral codes

2. **Referral Code Generation**
   - Sign up with a new account
   - Check database: new user should have auto-generated referral code
   - Expected: Format like "AB12CD34" (8 characters, no ambiguous chars)

3. **Referral Link Usage**
   - Copy your referral code from Settings
   - Sign out and visit: `http://localhost:3000/onboarding?ref=YOUR_CODE`
   - Complete signup
   - Expected: New user's `referred_by` field points to your user ID
   - Expected: Both users get bonus minutes

Edge cases to test:
- Try signing up without referral code (should work normally)
- Try invalid referral code (should ignore and proceed)
- Verify referral codes are case-insensitive
```

This structured approach ensures the user can systematically verify your changes work correctly.
