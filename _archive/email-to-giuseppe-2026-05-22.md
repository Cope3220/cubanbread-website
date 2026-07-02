**To:** Giuseppe Bua <giuseppe@cubanbread.com>
**From:** Copeland More <copeland@cubanbread.com>
**Subject:** Re: SalesPower / Website — wired up, two notes

---

G,

Form is wired to the new endpoint. Three things from my side:

**1. Endpoint + mapping — done.**
Website now POSTs JSON to `https://salespower-production.up.railway.app/api/website-lead`. Mapped on our side per your table:

- `company_name` → `company`
- `message` → `notes`
- everything else lines up 1:1
- `submitted_at` dropped (you auto-generate)
- `source` hardcoded to `"Website"`

**2. `business_type` — folded into `notes`.**
Heads up: the website form also collects Business Type (Restaurant / Sandwich Shop / Hotel / Caterer / Distributor / etc.) because it helps you triage. Your schema doesn't have a column for it, so rather than make you add one, I'm prepending it to the `notes` field like this:

```
Business Type: Restaurant

[their actual message here]
```

If you'd rather have it as its own column down the road, easy change on both sides — just let me know.

**3. reCAPTCHA — I'll register it.**
I'll set up reCAPTCHA v2 under the cubanbread.com Google account so La Segunda owns it long-term. Once it's registered I'll send you the **Secret Key** in a separate message for the Railway env vars. Site Key goes on the website on my end.

Ping me when `/api/website-lead` is live and I'll run a test submission end-to-end before we flip the form on.

Thank you,

Copeland
