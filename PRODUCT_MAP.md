# Product map: capability → product on this platform

The story never changes. The products that play each role do. Fill the **This platform** column
during onboarding. Until a row is filled, the skills fall back to the generic description.

How to fill a row:

- **This platform** is the product or feature name, plus the docs link.
- **Provisioned by** says how a demo creates it: API, console, CLI, or "ask someone".
- **Limited?** records any per-account cap or approval gate. These are what teardown exists to free.

| Capability | Role in the story | This platform | Provisioned by | Limited? |
|---|---|---|---|---|
| **Agent brain / procedures** | Where the agent's behavior lives: prompt, procedures, tool selection. | _TODO_ | | |
| **Conversation session** | One conversation id that survives channel switches and handoff. Makes "continuity" real. | _TODO_ | | |
| **Customer memory / profile** | Recognize the customer on message 1, recall prior interactions, write what just happened. | _TODO_ | | |
| **Knowledge / grounding** | Answers verbatim from approved content: "no hallucination". | _TODO_ | | |
| **Tools / actions** | The wow moment: a real state change in a system of record. | _TODO_ | | |
| **Simulated system of record** | Stands in for the customer's CRM/core. Mock data inside the demo's own backend: held in memory, seeded at boot, snake_case fields, with an admin reset route and a back-office page that shows rows change on screen. No external database. | Demo backend (default) | Deployed with the demo | no |
| **Messaging channels** | Chat, WhatsApp, SMS, email: usually the cold open. | _TODO_ | | |
| **Voice runtime** | ASR, TTS, turn-taking, interruption. Latency lives here. | _TODO_ | | |
| **Channel-switch mechanism** | How the customer moves from one channel to another inside one story (button, link, callback). | _TODO_ | | |
| **Human handoff** | Escalation with full context. The human never re-asks. | _TODO_ | | |
| **Agent desktop / context panel** | What the human sees when the handoff lands. | _TODO_ | | |
| **Post-conversation insights** | Summary, sentiment, QA/adherence scoring, custom scoring. The insight close. | _TODO_ | | |
| **Templates / approvals** | Outbound messages that need pre-approval (lead time). | _TODO_ | | |
| **Hosting** | Where the demo app runs. Pick the region closest to the voice infrastructure, not the user. | _TODO_ | | |
| **No-code builder** | A fast path when the wow moment needs no custom tool. | _TODO_ (if any) | | |
| **Observability** | Where to read the wire when something breaks: event timelines, per-leg errors. | _TODO_ | | |

## Onboarding questions to answer

- What is the unit of "a conversation"? Does it survive a channel switch, or does the platform
  stitch separate sessions by customer identity?
- How is the customer identified on the first message (phone, email, auth token)? Can a demo seed
  a profile ahead of time?
- How does the agent call an external system? Do custom tools exist, or only a fixed menu? Any
  timeout or latency budget?
- How does handoff carry context to the human? What does the agent desktop show by default?
- Which resources are account-limited or approval-gated, and how long do approvals take?
- What's the "reset" story? How do you close or clear conversations and memory for a test
  persona, and what is async (extraction lag)?
- Where is the per-leg error timeline when voice misbehaves?
- Is there a sandbox or demo account shared with teammates? (If so, see principles §E.)

## Mapping a previous demo onto this platform

Port the story and re-derive the mechanics. For each beat, ask which row above plays it here.
If a beat has no equivalent, name the gap honestly and flip the arc. Don't imitate the beat.
Example: if the channel switch doesn't exist, do voice-first with a messaging receipt.
