# Platform notes: <<platform name>>

The gotchas file. **Rule: if something cost more than an hour, it goes here the same day.**
Order entries by severity. Every entry follows the same shape, so the next person (or agent) can
scan by symptom.

Read this file before touching the platform. Propose additions at the end of every task that
surfaced something new.

---

## Entry template

### N. <<short, symptom-first title>>

**Symptom:** <<what you see: error code, log line, behavior>>
**Cause:** <<the real root cause, proven how>>
**Fix:** <<exact change, command or config>>
**Verified:** <<YYYY-MM-DD, live / static>> · **Scope:** <<when it applies, and when it doesn't>>

---

## Starter checklist: things to find out early on any platform

- [ ] What's account-limited (count caps), and what's approval-gated (lead time)?
- [ ] Which ids are cached at app boot, so changing them needs a restart?
- [ ] Which list endpoints are NOT ordered the way you'd assume?
- [ ] What does "close" vs "inactive" vs "delete" do to a conversation, and is closed final?
- [ ] Does the memory layer merge or deduplicate writes? Is extraction asynchronous, and how long
      does it lag?
- [ ] Where is the per-call / per-step event timeline?
- [ ] Which credentials are recommended for server-side calls?
- [ ] What does a webhook signature check reject (methods, headers)?
- [ ] Is there a shared demo account? Who else lives on it?

---

## Entries

<!-- 1. … -->
