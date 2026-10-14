import type { Choice } from "./types";

export const mockChoices: Choice[] = [
  {
    id: "1",
    title: "주말에 떠나는 여행, 어디가 더 끌려?",
    description: "즉흥으로 가방만 싸는 주말 여행",
    optionA: {
      id: "1a",
      label: "바다로 드라이브",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      voteCount: 1284,
    },
    optionB: {
      id: "1b",
      label: "산속 온천",
      imageUrl:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
      voteCount: 1102,
    },
    authorId: "u1",
    authorName: "여행러버",
    createdAt: "2026-04-08T10:00:00.000Z",
  },
  {
    id: "2",
    title: "야식의 최후 승자는?",
    description: "배고픈 밤, 하나만 고른다면",
    optionA: {
      id: "2a",
      label: "치킨",
      imageUrl:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
      voteCount: 2451,
    },
    optionB: {
      id: "2b",
      label: "피자",
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      voteCount: 2310,
    },
    authorId: "u2",
    authorName: "야식위원회",
    createdAt: "2026-04-09T14:30:00.000Z",
  },
  {
    id: "3",
    title: "새 프로젝트 시작, 어떤 환경이 더 좋아?",
    description: "집중력을 위한 공간 선택",
    optionA: {
      id: "3a",
      label: "카페 구석 자리",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      voteCount: 876,
    },
    optionB: {
      id: "3b",
      label: "집 책상 딥포커스",
      imageUrl:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
      voteCount: 1024,
    },
    authorId: "u3",
    authorName: "코딩고양이",
    createdAt: "2026-04-10T08:15:00.000Z",
  },
  {
    id: "4",
    title: "데이트 코스 긴급 투표",
    description: "첫인상 남기는 코스는?",
    optionA: {
      id: "4a",
      label: "전시회 + 전시 카페",
      imageUrl:
        "https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80",
      voteCount: 654,
    },
    optionB: {
      id: "4b",
      label: "야경 맛집 + 산책",
      imageUrl:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
      voteCount: 891,
    },
    authorId: "u4",
    authorName: "데이트플래너",
    createdAt: "2026-04-10T19:45:00.000Z",
  },
  {
    id: "5",
    title: "운동 루틴, 너는 어느 쪽?",
    description: "이번 달 목표에 더 맞는 건",
    optionA: {
      id: "5a",
      label: "헬스장 웨이트",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      voteCount: 1433,
    },
    optionB: {
      id: "5b",
      label: "한강 러닝",
      imageUrl:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
      voteCount: 1288,
    },
    authorId: "u5",
    authorName: "무브먼트",
    createdAt: "2026-04-11T07:00:00.000Z",
  },
];
