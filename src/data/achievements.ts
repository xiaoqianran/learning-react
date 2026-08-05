export type AchievementId =
  | "first-lesson"
  | "five-lessons"
  | "half-course"
  | "all-course"
  | "lab-perfect"
  | "streak-3"
  | "bookmark-3"
  | "notes-3";

export type AchievementDef = {
  id: AchievementId;
  title: string;
  desc: string;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-lesson", title: "第一课", desc: "完成任意 1 节课" },
  { id: "five-lessons", title: "小有所成", desc: "完成 5 节课" },
  { id: "half-course", title: "过半", desc: "完成一半课程" },
  { id: "all-course", title: "通关", desc: "完成全部课程" },
  { id: "lab-perfect", title: "练习场全对", desc: "练习场一轮 5 题全对" },
  { id: "streak-3", title: "三日连续", desc: "连续打卡 3 天" },
  { id: "bookmark-3", title: "收藏家", desc: "收藏 3 节课" },
  { id: "notes-3", title: "勤记笔记", desc: "至少 3 节课有笔记" },
];
