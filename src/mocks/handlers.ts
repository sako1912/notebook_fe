import { http, HttpResponse, delay } from "msw";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  role: "human" | "ai";
}

interface Chat {
  uuid: string;
  messages: Message[];
}

interface ChatHistory {
  uuid: string;
  firstMessage: Message | null;
}

// Mock 데이터 분리
const mockChats: Record<string, Chat> = {
  "chat-1": {
    uuid: "chat-1",
    messages: [
      {
        id: 1,
        content: "안녕하세요, 날씨 어떤가요?",
        timestamp: "2024-03-20T10:00:00Z",
        role: "human",
      },
      {
        id: 2,
        content: "오늘은 맑고 화창한 날씨입니다.",
        timestamp: "2024-03-20T10:00:05Z",
        role: "ai",
      },
      {
        id: 3,
        content: "주말에도 날씨가 좋을까요?",
        timestamp: "2024-03-20T10:00:10Z",
        role: "human",
      },
      {
        id: 4,
        content: "주말에는 비 소식이 있을 것으로 예상됩니다.",
        timestamp: "2024-03-20T10:00:15Z",
        role: "ai",
      },
    ],
  },
  "chat-2": {
    uuid: "chat-2",
    messages: [
      {
        id: 5,
        content: "오늘 저녁 메뉴 추천해주세요.",
        timestamp: "2024-03-19T18:00:00Z",
        role: "human",
      },
      {
        id: 6,
        content: "오늘은 따뜻한 파스타는 어떠신가요?",
        timestamp: "2024-03-19T18:00:05Z",
        role: "ai",
      },
      {
        id: 7,
        content: "파스타 레시피도 알려주실 수 있나요?",
        timestamp: "2024-03-19T18:00:10Z",
        role: "human",
      },
      {
        id: 8,
        content: "카르보나라 파스타 레시피를 알려드리겠습니다...",
        timestamp: "2024-03-19T18:00:15Z",
        role: "ai",
      },
    ],
  },
  "chat-3": {
    uuid: "chat-3",
    messages: [
      {
        id: 9,
        content: "주말 여행지 추천해주세요.",
        timestamp: "2024-03-18T15:00:00Z",
        role: "human",
      },
      {
        id: 10,
        content: "이 시기에는 제주도 여행을 추천드립니다.",
        timestamp: "2024-03-18T15:00:05Z",
        role: "ai",
      },
      {
        id: 11,
        content: "제주도 필수 관광지도 알려주세요.",
        timestamp: "2024-03-18T15:00:10Z",
        role: "human",
      },
      {
        id: 12,
        content: "성산일출봉, 만장굴, 우도 등을 추천드립니다.",
        timestamp: "2024-03-18T15:00:15Z",
        role: "ai",
      },
    ],
  },
};

const mockChatHistories: ChatHistory[] = [
  {
    uuid: "chat-1",
    firstMessage: {
      id: 1,
      content: "안녕하세요, 날씨 어떤가요?",
      timestamp: "2024-03-20T10:00:00Z",
      role: "human",
    },
  },
  {
    uuid: "chat-2",
    firstMessage: {
      id: 5,
      content: "오늘 저녁 메뉴 추천해주세요.",
      timestamp: "2024-03-19T18:00:00Z",
      role: "human",
    },
  },
  {
    uuid: "chat-3",
    firstMessage: {
      id: 9,
      content: "주말 여행지 추천해주세요.",
      timestamp: "2024-03-18T15:00:00Z",
      role: "human",
    },
  },
];

// 채팅 데이터 저장소 초기화
let chats = mockChats;
let chatHistories = mockChatHistories;

export const handlers = [
  // 채팅 히스토리 목록 조회
  http.get("/api/chats", () => {
    // 최신 메시지 기준으로 정렬
    const sortedHistories = [...chatHistories].sort((a, b) => {
      const aTime = a.firstMessage?.timestamp || "";
      const bTime = b.firstMessage?.timestamp || "";
      return bTime.localeCompare(aTime);
    });

    return HttpResponse.json(sortedHistories);
  }),

  // 새 채팅 생성
  http.post("/api/chats", async () => {
    const uuid = crypto.randomUUID();
    const newChat: Chat = {
      uuid,
      messages: [],
    };

    chats[uuid] = newChat;
    return HttpResponse.json({ uuid, firstMessage: null });
  }),

  // 채팅방 상세 조회
  http.get("/api/chats/:uuid", ({ params }) => {
    const uuid = params.uuid as string;
    const chat = chats[uuid];

    if (!chat) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(chat);
  }),

  // 채팅 메시지 전송
  http.post("/api/chats/:uuid/messages", async ({ params, request }) => {
    const uuid = params.uuid as string;
    const { content, role } = (await request.json()) as {
      content: string;
      role: Message["role"];
    };

    await delay(500);

    if (!chats[uuid]) {
      return new HttpResponse(null, { status: 404 });
    }

    const newMessage: Message = {
      id: Date.now(),
      content,
      timestamp: new Date().toISOString(),
      role,
    };

    // 메시지 추가
    chats[uuid].messages.push(newMessage);

    // AI 응답 생성
    if (role === "human") {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: "AI의 응답입니다.",
        timestamp: new Date().toISOString(),
        role: "ai",
      };
      chats[uuid].messages.push(aiResponse);
    }

    return HttpResponse.json(chats[uuid]);
  }),

  // 파일 업로드
  http.post("/api/upload", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const uuid = formData.get("uuid") as string;

    await delay(500);

    if (!chats[uuid]) {
      return new HttpResponse(null, {
        status: 404,
        statusText: "채팅방을 찾을 수 없습니다.",
      });
    }

    const response = {
      message: `${file.name} 업로드에 성공하였습니다. \r\n업로드 된 파일에 Q&A를 진행해보세요`,
    };

    return HttpResponse.json(response);
  }),

  // 채팅 히스토리 조회 API
  http.get("/api/chat/history", () => {
    return HttpResponse.json([
      {
        id: 1,
        message: "안녕하세요!",
        timestamp: new Date().toISOString(),
        sender: "bot",
      },
      {
        id: 2,
        message: "무엇을 도와드릴까요?",
        timestamp: new Date().toISOString(),
        sender: "bot",
      },
    ]);
  }),

  //file upload
  http.post("/api/file", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");
    return HttpResponse.json({
      message: "파일 업로드 성공",
    });
  }),
];
