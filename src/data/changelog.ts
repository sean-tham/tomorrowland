export interface ChangeEntry {
  type: "added" | "removed" | "changed" | "renamed";
  category: string;
  description: string;
  detail?: string;
}

export const CHANGELOG_DATE = "June 21, 2026";

export const CHANGES: ChangeEntry[] = [
  // Stage renames
  { type: "renamed", category: "Stage", description: "THE LIBRARY → THE GREAT LIBRARY", detail: "Same stage, updated name" },
  { type: "renamed", category: "Stage", description: "RISE → CELESTIA BY KUCOIN", detail: "Same stage, new sponsor name" },

  // Big additions
  { type: "added", category: "Mainstage · Fri/Sat/Sun", description: "DISCOVERY", detail: "New opening act 12:00–14:00 all three days" },
  { type: "added", category: "Freedom by Bud · Fri", description: "Enrico Sangiuliano", detail: "17:30–19:00 — major techno addition" },
  { type: "added", category: "Freedom by Bud · Fri", description: "John Newman", detail: "19:00–20:00" },
  { type: "added", category: "Freedom by Bud · Fri", description: "Bebe Rexha", detail: "20:00–20:30" },
  { type: "added", category: "Mainstage · Sat", description: "D.O.D", detail: "16:15–17:15" },
  { type: "changed", category: "Mainstage · Sat", description: "MATTN moved to Mainstage", detail: "Was on The Library; now 17:20–18:20 on Mainstage" },
  { type: "added", category: "Freedom by Bud · Sat", description: "Argy presents NEWORLD", detail: "20:00–21:00 (was listed as Argy)" },
  { type: "added", category: "Core · Sat", description: "Dino Lenny b2b Radioslave", detail: "16:30–18:30 — Radioslave joins the b2b" },
  { type: "added", category: "Core · Sat", description: "DJ Boring", detail: "18:30–20:30" },
  { type: "added", category: "Core · Sat", description: "Skream b2b dj Seinfeld", detail: "20:30–22:30" },
  { type: "changed", category: "Planaxis · Sat", description: "Joris Voorn replaced by Chris Avantgarde", detail: "Now Chris Avantgarde b2b Konstantin Sibold at 22:30–00:00" },
  { type: "added", category: "Great Library · Sun", description: "Joel Corry", detail: "18:00–19:00 (also plays House of Fortune 20:00–21:00)" },
  { type: "added", category: "Great Library · Sun", description: "Kaaze", detail: "16:00–17:00" },
  { type: "added", category: "Great Library · Sun", description: "Nico Moreno", detail: "20:00–21:00 solo set (plus b2b with Dimitri Vegas at 22:00)" },

  // Removals
  { type: "removed", category: "Freedom by Bud · Sun", description: "Rezz", detail: "No longer on the lineup" },
  { type: "removed", category: "Mainstage", description: "MC STRETCH", detail: "Opening host slot removed from all 3 days" },
  { type: "removed", category: "Mainstage · Sat", description: "Odymel", detail: "No longer on the lineup" },
  { type: "removed", category: "Planaxis · Sun", description: "Thomas Gold", detail: "No longer on the lineup" },
  { type: "removed", category: "Freedom by Bud · Sun", description: "Gap 19:00–20:30", detail: "No act announced for this slot yet — may be TBA" },

  // Time changes (notable)
  { type: "changed", category: "Mainstage · Fri", description: "Hardwell now 23:50–00:50", detail: "Was listed as 00:00–01:00" },
  { type: "changed", category: "Mainstage · Sat", description: "Calvin Harris now 23:45–00:45", detail: "Was listed as 00:00–01:00" },
  { type: "changed", category: "Great Library · Fri", description: "Illenium now closes at 00:55", detail: "Moved from 21:00 slot to midnight closer" },
  { type: "changed", category: "Mainstage · Sat", description: "Armin van Buuren now 21:25–22:25", detail: "Staggered times throughout the day" },
  { type: "changed", category: "Freedom by Bud · Fri", description: "Fisher extended to 90 mins", detail: "21:30–23:00 (was 21:00–22:00)" },
];
