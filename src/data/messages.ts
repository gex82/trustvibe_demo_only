import type { MessageThread } from "../types";

export const INITIAL_THREADS: MessageThread[] = [
  {
    id: "thread-bathroom",
    participants: ["user-maria", "user-juan"],
    projectId: "proj-bathroom",
    projectTitle: "Primary Bathroom Renovation",
    messages: [
      {
        id: "msg-1",
        threadId: "thread-bathroom",
        senderId: "user-juan",
        text: "Hola Maria! I reviewed your bathroom project and I'm very interested. I've done several similar renovations in Santurce and Condado. When would be a good time to do a site visit?",
        timestamp: "2026-01-11T10:00:00",
        read: true,
      },
      {
        id: "msg-2",
        threadId: "thread-bathroom",
        senderId: "user-maria",
        text: "Hi Juan! Yes, would Tuesday afternoon work for you? Between 2–5 PM?",
        timestamp: "2026-01-11T14:22:00",
        read: true,
      },
      {
        id: "msg-3",
        threadId: "thread-bathroom",
        senderId: "user-juan",
        text: "Tuesday at 3pm works perfectly. I'll bring samples of the tile options so you can see them in person. What's the address?",
        timestamp: "2026-01-11T14:45:00",
        read: true,
      },
      {
        id: "msg-4",
        threadId: "thread-bathroom",
        senderId: "user-maria",
        text: "Great! 42 Calle Luna, Apt 3B, San Juan. See you then! The door code is #1842.",
        timestamp: "2026-01-11T15:00:00",
        read: true,
      },
      {
        id: "msg-5",
        threadId: "thread-bathroom",
        senderId: "user-juan",
        text: "Work is going great! Tile floor is 100% done — it looks stunning. Starting on the shower enclosure tomorrow morning. Sending photos to the project shortly.",
        timestamp: "2026-02-01T09:15:00",
        read: true,
      },
      {
        id: "msg-6",
        threadId: "thread-bathroom",
        senderId: "user-maria",
        text: "It looks amazing from the photos! The tile color is exactly what I imagined. How many more days until everything is finished?",
        timestamp: "2026-02-01T11:30:00",
        read: true,
      },
      {
        id: "msg-7",
        threadId: "thread-bathroom",
        senderId: "user-juan",
        text: "About 2–3 more days for the vanity and final plumbing. I'll submit for completion once the final inspection is done. Thank you for being such a great client — this has been a pleasure! 🙏",
        timestamp: "2026-02-01T12:05:00",
        read: false,
      },
    ],
  },
];
