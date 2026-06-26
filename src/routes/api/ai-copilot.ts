import { createFileRoute } from "@tanstack/react-router";

type Msg = { role: "system" | "user" | "assistant"; content: unknown };

export const Route = createFileRoute("/api/ai-copilot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        let body: { messages?: Msg[] };
        try { body = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
        if (!Array.isArray(body.messages)) return new Response("messages required", { status: 400 });

        const systemMsg: Msg = {
          role: "system",
          content:
            "You are Vajra AI, the in-house legal copilot for Vajra Legal Chambers, an elite Indian law firm. " +
            "You assist senior advocates with: Indian statute citations (BNS, BNSS, BSA, IPC, CrPC, CPC, Evidence Act, NI Act, Contract Act, Companies Act, GST, FEMA), Supreme Court & High Court precedents, " +
            "drafting plaints/bail applications/legal notices, summarising orders/FIRs/plaints, extracting weaknesses, and brainstorming arguments. " +
            "Be precise, cite sections, format with markdown. When given a document, produce: (1) Summary, (2) Key Facts, (3) Legal Issues, (4) Weaknesses & Counter-arguments, (5) Suggested Next Steps.",
        };

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [systemMsg, ...body.messages],
          }),
        });
        if (!res.ok) {
          const t = await res.text();
          return new Response(t || "AI error", { status: res.status });
        }
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content ?? "";
        return Response.json({ text });
      },
    },
  },
});
