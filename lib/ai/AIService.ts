import { StaffSchedulingAgent } from "@/lib/ai/agents/StaffSchedulingAgent";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  isDemo: boolean;
  model?: string;
  confidence?: number;
}

// Demo responses keyed by topic keywords
const DEMO_RESPONSES: Record<string, string> = {
  revenue:
    "Revenue is currently at ₹18.12L today, which is **+9.8% vs yesterday**. The main driver is the surge in villa bookings (+3 confirmed in the last 2 hours) and the premium suite pricing adjustment applied yesterday. Weekend occupancy is tracking 7% above forecast, which should push RevPAR to ₹14,200.\n\n**What you can do now:**\n1. Apply the pending Premium Suite pricing recommendation (+₹1,700) — estimated impact: +₹2.1L\n2. Launch a last-minute Sunday package for Standard rooms to fill the 12% gap\n3. Activate the F&B upsell campaign for tonight's Spice Garden dinner",

  occupancy:
    "Current occupancy is **87.4%** (105/120 rooms + 14/20 villas occupied). This is +6.8% above the previous period.\n\n**Floor breakdown:**\n- Floor 1-2: 92% (mostly standard rooms, strong demand)\n- Floor 3-4: 89% (deluxe segment, healthy)\n- Floor 5: 78% (suites — 3 available, pricing opportunity)\n- Villas: 70% (14/20 occupied, below target)\n\n**AI Recommendation:** Reduce Villa ADR by ₹2,500 for 48 hours to drive occupancy above 80%.",

  staff:
    "Current staff utilization is **76.4%** across all departments:\n\n- 🧹 Housekeeping: 94% — **overstretched** (8 rooms pending)\n- 🍽️ F&B: 71% — adequate\n- 💆 Spa: 52% — **underutilized** (4 idle therapists)\n- 🔧 Maintenance: 83% — healthy\n- 🎪 Concierge: 68% — adequate\n\n**AI Recommendation:** Move 2 spa therapists to housekeeping support for 90 minutes. This reduces room wait time from 47 to 22 minutes and improves guest satisfaction by ~12 points.",

  maintenance:
    "**3 assets require attention:**\n\n🔴 **HVAC-A01** (Block A) — Health: 71%, Failure probability: 34%\nPredicted failure within 8-12 days. Recommend scheduling PM within 5 days.\n\n🟡 **Generator-02** (Backup) — Health: 78%, Failure probability: 18%\nSchedule test run. Last tested 23 days ago.\n\n🟡 **Spice Garden Refrigeration** — Running 2°C above spec\nCalibration needed. Risk of food safety violation.\n\n**Total estimated cost if all fail:** ₹8.4L. **Preventive maintenance cost:** ₹1.1L.",

  guest:
    "**50 active guests profiled.** Key highlights:\n\n🔴 **High Friction (>70 score):** 4 guests\n- Rahul Sharma (Room 412) — Friction: 87. AC complaint unresolved 18 min. VIP. Action NOW.\n- Priya Kapoor (Villa V03) — Friction: 74. Requested room change, pending.\n\n⭐ **VIP Guests:** 8 on property\n- 2 Platinum tier, 6 Diamond tier\n- Average satisfaction: 91/100\n\n📊 **Overall NPS: 72** (up from 68 last week)\n\n**Tonight's risk:** Rahul Sharma's unresolved AC issue could generate a 1-star review. Recommend immediate manager intervention + complimentary upgrade.",

  energy:
    "**Today's energy consumption: 2,847 kWh** (down 4.7% from yesterday).\n\n**Biggest consumers:**\n- Kitchen: 520 kWh (18.3%)\n- Main Wing HVAC: 680 kWh (23.9%)\n- Pool systems: 310 kWh (10.9%)\n\n**AI Opportunity:**\nBlock C has 22 vacant rooms. HVAC running at full capacity. Reducing load by 35% would save **₹18,400 today**.\n\n**Sustainability score: 74/100**\nSolar contribution: 340 kWh (11.9% of total). On track for monthly target.",

  sentiment:
    "**Sentiment analysis from last 7 days (148 reviews):**\n\n😊 Positive: 72% (107 reviews)\n😐 Neutral: 18% (27 reviews)\n😞 Negative: 10% (14 reviews)\n\n**Top complaint: Wi-Fi reliability** (37 mentions, ↑21%)\n- Concentrated in Block C floors 2-3\n- AI recommendation: Upgrade access points in Block C. Estimated cost: ₹1.8L. ROI within 30 days from guest retention.\n\n**Rising praise:** Spa experience (+34%), F&B quality (+18%)\n\n**Risk:** Wi-Fi complaints trending up. If unresolved, NPS could drop 8 points next month.",

  pricing:
    "**Current pricing recommendations:**\n\n1. **Premium Suite** — Current: ₹15,500 → Recommended: ₹17,200 (+11%)\nReason: Booking pace 18% above forecast. Only 4 remaining this weekend.\nExpected impact: +₹1.8L revenue, +2.4% RevPAR\n\n2. **Suite** — Current: ₹22,000 → Recommended: ₹24,500 (+11.4%)\nReason: Festival season demand. 3 suites left.\nExpected impact: +₹2.1L revenue\n\n3. **Standard Room** — Current: ₹8,500 → Recommended: ₹7,800 (-8.2%)\nReason: Occupancy 12% below target in this segment.\nExpected impact: +15% bookings, net positive.\n\n**Apply all? Expected total impact: +₹3.7L this weekend.**",

  weather:
    "**Current conditions:** 26.4°C, Cloudy, Wind 14.2 km/h\n**Rain probability: 68%** (⚠️ High)\n\n**Next 48 hours forecast:**\n- Today evening: Showers likely (72%)\n- Tomorrow: Heavy rain (85%), 24-25°C\n- Day after: Monsoon intensity (91%)\n\n**AI Weather-to-Revenue Impact:**\n- 🏊 Pool/Outdoor: -42% demand\n- 💆 Spa: +24% demand → Book now or lose revenue\n- 🍽️ Room service: +17% orders\n- 🍷 Restaurant dinner: +13% covers\n\n**Automation rules triggered:** Rain protocol activated. 2 staff reallocated to Spa.",

  default:
    "I'm your **Azure Hills AI Concierge**. I have real-time access to all resort telemetry, occupancy, guest experience, staff operations, maintenance, and revenue intelligence.\n\nI can assist you with:\n- 🏨 **Resort Operations & Occupancy** — 'Which villas are available tonight?'\n- 🍽️ **Dining & Experiences** — 'What are the top evening banquet options?'\n- 👥 **Guest Intelligence & VIPs** — 'Show me high-friction guest alerts'\n- 📊 **Revenue Intelligence** — 'How is RevPAR tracking this week?'\n- 🔧 **Maintenance & Assets** — 'What equipment needs immediate attention?'\n- 🌦️ **Weather Forecast** — 'How will monsoon rains impact our pool & outdoor dining?'\n\nHow may I assist your resort operations today?",
};

function getDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("revenue") || msg.includes("money") || msg.includes("earning")) {
    return DEMO_RESPONSES.revenue;
  }
  if (msg.includes("occupanc") || msg.includes("room") || msg.includes("available") || msg.includes("book")) {
    return DEMO_RESPONSES.occupancy;
  }
  if (msg.includes("staff") || msg.includes("employee") || msg.includes("housekeep") || msg.includes("worker") || msg.includes("schedule")) {
    return DEMO_RESPONSES.staff;
  }
  if (msg.includes("maintenance") || msg.includes("hvac") || msg.includes("equipment") || msg.includes("repair") || msg.includes("broken")) {
    return DEMO_RESPONSES.maintenance;
  }
  if (msg.includes("guest") || msg.includes("friction") || msg.includes("complaint") || msg.includes("vip") || msg.includes("customer")) {
    return DEMO_RESPONSES.guest;
  }
  if (msg.includes("energy") || msg.includes("electric") || msg.includes("power") || msg.includes("consumption")) {
    return DEMO_RESPONSES.energy;
  }
  if (msg.includes("sentiment") || msg.includes("review") || msg.includes("feedback") || msg.includes("rating") || msg.includes("nps")) {
    return DEMO_RESPONSES.sentiment;
  }
  if (msg.includes("pric") || msg.includes("adr") || msg.includes("rate") || msg.includes("tariff")) {
    return DEMO_RESPONSES.pricing;
  }
  if (msg.includes("weather") || msg.includes("rain") || msg.includes("monsoon") || msg.includes("forecast")) {
    return DEMO_RESPONSES.weather;
  }

  // Contextual fallback
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("help") || msg.includes("who are you")) {
    return DEMO_RESPONSES.default;
  }

  return `Based on real-time intelligence for **Azure Hills Resort**:\n\n${DEMO_RESPONSES.default}\n\n*Feel free to ask about live revenue, occupancy, staff schedules, maintenance, or guest VIPs.*`;
}

export class AIService {
  private static getGroqKey() {
    return process.env.GROQ_API_KEY || "";
  }

  private static getOpenAIKey() {
    return process.env.OPENAI_API_KEY || "";
  }

  static async chat(
    messages: AIMessage[],
    resortContext?: string
  ): Promise<AIResponse> {
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
    const lower = lastUserMsg.toLowerCase();

    // Check if user message is a complaint/request (cleaning, repairs, plumbing, AC, towels, etc.)
    const isComplaintOrIssue = [
      "clean", "housekeep", "towel", "linen", "dirty", "stain", "trash", "bed", "vacuum", "mop", "sweep", "soap", "shampoo",
      "plumb", "leak", "tap", "pipe", "water", "toilet", "flush", "sink", "drain", "clog",
      "repair", "fix", "ac", "aircon", "cool", "heat", "tv", "light", "switch", "door", "lock",
      "broken", "damage", "geyser", "shower", "smell", "odor", "maintenance", "spill", "fan"
    ].some((kw) => lower.includes(kw));

    if (isComplaintOrIssue) {
      try {
        const dispatch = await StaffSchedulingAgent.assignStaffForGuestIssue(lastUserMsg);
        return {
          content: `I have received your request regarding **"${lastUserMsg}"**! 🚨\n\nOur **Staff Scheduling Agent** has processed your message and immediately assigned on-duty staff to assist you at your room.\n\n**Immediate Dispatch Confirmation:**\n- 📋 **Ticket Number:** \`#${dispatch.ticketId}\`\n- 👤 **Assigned Staff:** **${dispatch.staffName}** (${dispatch.staffDept})\n- 🏷️ **Service Category:** ${dispatch.category}\n- ⏱️ **Estimated Arrival:** **${dispatch.estimatedMinutes} minutes**\n- 🤖 **Agent Controller:** Staff Scheduling Agent (Logged & Persisted to DB)\n\n**${dispatch.staffName}** has been dispatched to your room as top priority. Please let me know if you need anything else!`,
          isDemo: false,
          model: "StaffSchedulingAgent Autonomous Dispatch",
          confidence: 0.99,
        };
      } catch (err) {
        console.error("StaffSchedulingAgent dispatch error:", err);
      }
    }

    const groqKey = this.getGroqKey();
    const openAIKey = this.getOpenAIKey();

    // 1. Check if Groq API Key is configured (Fastest Inference)
    if (groqKey) {
      try {
        const systemPrompt = `You are the AI Concierge for Azure Hills Resort, a premier 5-star luxury sanctuary in Coorg, Karnataka, India.
You have real-time access to all resort systems: occupancy (87.4%), revenue intelligence, VIP guests, staff scheduling, predictive maintenance, and dining/spa.
${resortContext ? `Current context:\n${resortContext}` : ""}
Respond with exceptional luxury hospitality tone, actionable insights, markdown bolding, and specific data points where appropriate. Keep answers concise, clear, and structured.`;

        const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            temperature: 0.6,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return {
              content,
              isDemo: false,
              model: `Groq (${model})`,
              confidence: 0.98,
            };
          }
        } else {
          console.warn("Groq API returned error status:", response.status);
        }
      } catch (err) {
        console.error("Groq API error:", err);
      }
    }

    // 2. Check if OpenAI Key is configured
    if (openAIKey) {
      try {
        const systemPrompt = `You are the AI Concierge for Azure Hills Resort, a 5-star luxury sanctuary in Coorg, Karnataka, India. ${resortContext || ""}`;
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return {
              content,
              isDemo: false,
              model: `OpenAI (${model})`,
              confidence: 0.95,
            };
          }
        }
      } catch (err) {
        console.error("OpenAI API error:", err);
      }
    }

    // 3. Fallback: Ultra-Rich Demo Mode
    const lastMessage = messages[messages.length - 1]?.content || "";
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      content: getDemoResponse(lastMessage),
      isDemo: true,
      model: "Demo Mode (Mock Intelligence)",
      confidence: 0.92,
    };
  }

  static generateRecommendation(type: string, context: Record<string, any>): string {
    switch (type) {
      case "PRICING":
        return `**Increase ${context.roomType} rate by ₹${context.increase?.toLocaleString()}**\n\n**Why?** ${context.reason}\n\n**Expected Impact:** +₹${context.revenue?.toLocaleString()} revenue, +${context.occupancy}% occupancy`;
      case "STAFFING":
        return `**Reallocate ${context.count} staff from ${context.from} → ${context.to}**\n\n**Why?** ${context.reason}\n\n**Expected Impact:** Reduce wait time by ${context.impact} minutes`;
      case "MAINTENANCE":
        return `**Schedule ${context.asset} maintenance within ${context.days} days**\n\n**Why?** ${context.reason}\n\n**Expected Impact:** Prevent ₹${context.savingAmount?.toLocaleString()} in emergency repair costs`;
      default:
        return `**AI Recommendation:** ${context.description || "No details available"}`;
    }
  }

  static get isLiveLLM() {
    return Boolean(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
  }
}
