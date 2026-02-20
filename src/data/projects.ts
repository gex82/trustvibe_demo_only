import type { Project } from "../types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-bathroom",
    customerId: "user-maria",
    title: "Primary Bathroom Renovation",
    description:
      "Complete renovation of primary bathroom. Remove old tile, install new porcelain tile floor (12×24), replace vanity, install new shower with glass enclosure, repaint. All fixtures are customer-supplied. Bathroom is approx. 8×10 ft.",
    category: "Bathroom",
    location: "San Juan, PR",
    budget: "$2,500 – $3,500",
    timeline: "3–4 weeks",
    status: "in_progress",
    createdAt: "2026-01-10",
    photos: [
      "/images/jobs/bathroom-renovation.png",
      "/images/jobs/living-room-reno.png",
    ],
    completionPhotos: [
      "/images/jobs/bathroom-renovation.png",
      "/images/jobs/bedroom-interior.png",
      "/images/jobs/living-room-reno.png",
    ],
    completionNote:
      "All work is complete! Tile floor installed, shower enclosure done, new vanity fitted and plumbing connected. Final clean-up done. Please inspect and approve when ready.",
    quotes: [
      {
        id: "quote-juan-bathroom",
        projectId: "proj-bathroom",
        contractorId: "user-juan",
        amount: 2800,
        breakdown: [
          { label: "Tile removal & disposal", amount: 350 },
          { label: "Floor tile installation (materials incl.)", amount: 800 },
          { label: "Shower enclosure installation", amount: 650 },
          { label: "Vanity installation", amount: 400 },
          { label: "Plumbing rough-in & fixtures", amount: 450 },
          { label: "Paint & finishing", amount: 150 },
        ],
        timeline: "3 weeks",
        notes:
          "I have completed 5 similar renovations this year in Santurce and Condado. All work guaranteed for 1 year. Start date flexible — can begin Monday.",
        status: "accepted",
        submittedAt: "2026-01-12",
      },
      {
        id: "quote-rosa-bathroom",
        projectId: "proj-bathroom",
        contractorId: "user-rosa",
        amount: 3100,
        breakdown: [
          { label: "Demolition & prep", amount: 400 },
          { label: "Tile work (floor + accent wall)", amount: 950 },
          { label: "Plumbing (full scope)", amount: 900 },
          { label: "Vanity + shower install", amount: 650 },
          { label: "Paint & cleanup", amount: 200 },
        ],
        timeline: "4 weeks",
        notes:
          "Premium materials available on request. Includes 1-year warranty on all plumbing work. I can accommodate a weekend start.",
        status: "rejected",
        submittedAt: "2026-01-13",
      },
    ],
    acceptedQuoteId: "quote-juan-bathroom",
    escrowAmount: 2800,
    trustvibeFee: 196,
  },
  {
    id: "proj-kitchen",
    customerId: "user-maria",
    title: "Kitchen Cabinet Repair & Refinishing",
    description:
      "Repair 3 cabinet doors that are off-hinges, refinish all upper cabinets (sand + repaint white). Replace all cabinet hardware (18 pulls). Kitchen is approximately 12×14 ft. Customer will supply hardware.",
    category: "Kitchen",
    location: "San Juan, PR",
    budget: "$400 – $600",
    timeline: "1 week",
    status: "open",
    createdAt: "2026-02-01",
    photos: ["/images/jobs/kitchen-cabinets.png"],
    quotes: [
      {
        id: "quote-juan-kitchen",
        projectId: "proj-kitchen",
        contractorId: "user-juan",
        amount: 450,
        breakdown: [
          { label: "Cabinet door repair (3 doors)", amount: 150 },
          { label: "Sanding & priming all uppers", amount: 100 },
          { label: "Painting (2 coats, white)", amount: 150 },
          { label: "Hardware installation (labor)", amount: 50 },
        ],
        timeline: "4–5 days",
        notes:
          "I can start next week Monday. Paint color to be selected by customer — I recommend Benjamin Moore Chantilly Lace for a crisp white.",
        status: "pending",
        submittedAt: "2026-02-05",
      },
    ],
  },
  {
    id: "proj-exterior-paint",
    customerId: "user-other-1",
    title: "Exterior House Painting",
    description:
      "Full exterior repaint of 2-story single-family home. Approx. 2,400 sq ft exterior surface. Power wash first. Customer-selected colors. Includes trim and fascia.",
    category: "Painting",
    location: "Bayamón, PR",
    budget: "$3,000 – $5,000",
    timeline: "2 weeks",
    status: "open",
    createdAt: "2026-02-10",
    photos: ["/images/jobs/exterior-painting.png"],
    quotes: [],
  },
  {
    id: "proj-ac-install",
    customerId: "user-other-2",
    title: "Mini-Split AC Installation (2 Units)",
    description:
      "Install 2 mini-split AC units — one 12,000 BTU in living room, one 9,000 BTU in master bedroom. Run new dedicated circuits for each unit. Units are already purchased.",
    category: "HVAC",
    location: "Caguas, PR",
    budget: "$800 – $1,200",
    timeline: "2 days",
    status: "open",
    createdAt: "2026-02-12",
    photos: ["/images/jobs/solar-install.png"],
    quotes: [
      {
        id: "quote-carlos-ac",
        projectId: "proj-ac-install",
        contractorId: "user-carlos",
        amount: 950,
        breakdown: [
          { label: "Living room unit install", amount: 450 },
          { label: "Bedroom unit install", amount: 350 },
          { label: "Electrical circuits (2x)", amount: 150 },
        ],
        timeline: "1 day",
        notes: "I do these regularly and can get it done in one day. All permits included.",
        status: "pending",
        submittedAt: "2026-02-13",
      },
    ],
  },
];
