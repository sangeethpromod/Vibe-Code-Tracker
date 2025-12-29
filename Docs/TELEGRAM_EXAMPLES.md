# Telegram Bot Usage Examples

## Message Format

Send messages in this format:
```
type: content
```

Where `type` is one of: `win`, `problem`, `money`, `avoidance`

---

## Examples

### Wins (Achievements, Progress)
```
win: Shipped feature X to production
win: Got 5 new users today
win: Fixed the critical bug in auth
win: Completed the client project 2 days early
win: Wrote 2000 words of documentation
```

### Problems (Issues, Blocks)
```
problem: Can't focus in the afternoon
problem: Client is unresponsive for 3 days
problem: Server keeps crashing under load
problem: Team member missed 3 deadlines
problem: Can't decide between tech stack A or B
```

### Money (Financial Events)
```
money: +5000 from client payment
money: -200 on unnecessary SaaS subscription
money: +1200 freelance project
money: -500 refund to unhappy client
money: +15000 Q4 revenue
```

### Avoidance (Things You're Dodging)
```
avoidance: Scrolling Twitter instead of coding
avoidance: Watching tutorials instead of building
avoidance: Rearranging Notion instead of shipping
avoidance: Reading about productivity instead of working
avoidance: Overthinking the design instead of launching
```

---

## Bot Response

✅ **Success:**
```
✅ Logged *win*: Shipped feature X to production
```

❌ **Invalid Format:**
```
Invalid format. Use:

`win: your achievement`
`problem: the issue`
`money: financial note`
`avoidance: what you avoided`
```

---

## Tips

1. **Be specific** - "Shipped login feature" > "Made progress"
2. **Be honest** - Especially with avoidance entries
3. **Include numbers** - Money entries should have amounts
4. **Don't overthink** - Quick logging is better than perfect logging
5. **Log daily** - The AI needs data to find patterns

---

## Testing Locally

If you haven't deployed yet, you can test via the API directly:

```powershell
# Test creating an entry
$body = @{
    type = "win"
    content = "Built the entire reflection system"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/entries" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

---

## Weekly Review Trigger

The review runs automatically every Sunday at 8pm. To test manually:

```powershell
$secret = "your-cron-secret-from-env"

Invoke-RestMethod -Uri "http://localhost:3000/api/weekly-review" `
    -Method Post `
    -Headers @{ Authorization = "Bearer $secret" }
```

You'll get a response like:
```json
{
  "message": "Weekly review generated",
  "report_id": "uuid-here",
  "entries_count": 42
}
```

And a Telegram message with your brutal review.

---

## What the AI Looks For

- **Patterns**: Repeated behaviors (good or bad)
- **Avoidance**: What you're dodging and why
- **Inconsistencies**: Saying one thing, doing another
- **Wins**: What's working that you should double down on
- **Problems**: Systemic issues vs one-off events
- **Money**: Where value is coming from (or leaking)

The goal: surface uncomfortable truths you might be avoiding.

---

## Privacy Note

- All data stored in your private Supabase instance
- Only you see the Telegram messages
- No analytics, no tracking, no external sharing
- You own all the data

This is a tool for you, not a product selling you.
