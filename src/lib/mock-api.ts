/**
 * Browser-side mock REST API for the v5 全栈实训 studio.
 * Looks like fetch + JSON APIs; persists to localStorage.
 */

export type ApiUser = {
  id: string;
  email: string;
  name: string;
};

export type ApiNote = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
};

export type ApiLog = {
  id: string;
  at: number;
  method: string;
  path: string;
  status: number;
  detail?: string;
};

type Db = {
  users: Array<ApiUser & { password: string }>;
  notes: Record<string, ApiNote[]>; // userId -> notes
  sessions: Record<string, string>; // token -> userId
};

const DB_KEY = "learning-react-mock-api-v1";
const LOG_KEY = "learning-react-mock-api-logs-v1";

const DEMO_USER = {
  id: "u_demo",
  email: "demo@react.dev",
  name: "React 学员",
  password: "password123",
};

function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Db;
  } catch {
    /* ignore */
  }
  const seed: Db = {
    users: [DEMO_USER],
    notes: {
      [DEMO_USER.id]: [
        {
          id: "n1",
          title: "欢迎来到 React 全栈实训",
          body: "这是模拟后端返回的第一条笔记。试试新增 / 编辑 / 删除。",
          updatedAt: Date.now(),
        },
      ],
    },
    sessions: {},
  };
  saveDb(seed);
  return seed;
}

function saveDb(db: Db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function pushLog(entry: Omit<ApiLog, "id" | "at">) {
  const logs = getLogs();
  const next: ApiLog[] = [
    {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      at: Date.now(),
      ...entry,
    },
    ...logs,
  ].slice(0, 40);
  localStorage.setItem(LOG_KEY, JSON.stringify(next));
  return next;
}

export function getLogs(): ApiLog[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (raw) return JSON.parse(raw) as ApiLog[];
  } catch {
    /* ignore */
  }
  return [];
}

export function clearLogs() {
  localStorage.removeItem(LOG_KEY);
}

export function getDemoCredentials() {
  return { email: DEMO_USER.email, password: DEMO_USER.password };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function authUser(token: string | null): ApiUser {
  if (!token) throw new ApiError(401, "未登录");
  const db = loadDb();
  const userId = db.sessions[token];
  if (!userId) throw new ApiError(401, "token 无效或已过期");
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new ApiError(401, "用户不存在");
  const { password: _, ...safe } = user;
  return safe;
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<{ token: string; user: ApiUser }> {
  await delay();
  const db = loadDb();
  const user = db.users.find(
    (u) => u.email === email.trim() && u.password === password,
  );
  if (!user) {
    pushLog({
      method: "POST",
      path: "/api/auth/login",
      status: 401,
      detail: "邮箱或密码错误",
    });
    throw new ApiError(401, "邮箱或密码错误");
  }
  const token = `tok_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  db.sessions[token] = user.id;
  saveDb(db);
  const { password: _, ...safe } = user;
  pushLog({
    method: "POST",
    path: "/api/auth/login",
    status: 200,
    detail: `user=${safe.email}`,
  });
  return { token, user: safe };
}

export async function apiMe(token: string | null): Promise<ApiUser> {
  await delay(200);
  try {
    const user = authUser(token);
    pushLog({ method: "GET", path: "/api/me", status: 200 });
    return user;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    pushLog({
      method: "GET",
      path: "/api/me",
      status,
      detail: (e as Error).message,
    });
    throw e;
  }
}

export async function apiLogout(token: string | null): Promise<void> {
  await delay(150);
  if (token) {
    const db = loadDb();
    delete db.sessions[token];
    saveDb(db);
  }
  pushLog({ method: "POST", path: "/api/auth/logout", status: 204 });
}

export async function apiListNotes(token: string | null): Promise<ApiNote[]> {
  await delay();
  try {
    const user = authUser(token);
    const db = loadDb();
    const list = [...(db.notes[user.id] ?? [])].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
    pushLog({
      method: "GET",
      path: "/api/notes",
      status: 200,
      detail: `${list.length} items`,
    });
    return list;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    pushLog({
      method: "GET",
      path: "/api/notes",
      status,
      detail: (e as Error).message,
    });
    throw e;
  }
}

export async function apiCreateNote(
  token: string | null,
  input: { title: string; body: string },
): Promise<ApiNote> {
  await delay();
  try {
    const user = authUser(token);
    const title = input.title.trim();
    if (!title) throw new ApiError(400, "标题不能为空");
    const note: ApiNote = {
      id: `n_${Date.now().toString(36)}`,
      title,
      body: input.body.trim(),
      updatedAt: Date.now(),
    };
    const db = loadDb();
    db.notes[user.id] = [note, ...(db.notes[user.id] ?? [])];
    saveDb(db);
    pushLog({
      method: "POST",
      path: "/api/notes",
      status: 201,
      detail: note.id,
    });
    return note;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    pushLog({
      method: "POST",
      path: "/api/notes",
      status,
      detail: (e as Error).message,
    });
    throw e;
  }
}

export async function apiUpdateNote(
  token: string | null,
  id: string,
  input: { title: string; body: string },
): Promise<ApiNote> {
  await delay();
  try {
    const user = authUser(token);
    const title = input.title.trim();
    if (!title) throw new ApiError(400, "标题不能为空");
    const db = loadDb();
    const list = db.notes[user.id] ?? [];
    const idx = list.findIndex((n) => n.id === id);
    if (idx < 0) throw new ApiError(404, "笔记不存在");
    const next: ApiNote = {
      ...list[idx],
      title,
      body: input.body.trim(),
      updatedAt: Date.now(),
    };
    list[idx] = next;
    db.notes[user.id] = list;
    saveDb(db);
    pushLog({
      method: "PUT",
      path: `/api/notes/${id}`,
      status: 200,
    });
    return next;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    pushLog({
      method: "PUT",
      path: `/api/notes/${id}`,
      status,
      detail: (e as Error).message,
    });
    throw e;
  }
}

export async function apiDeleteNote(
  token: string | null,
  id: string,
): Promise<void> {
  await delay(250);
  try {
    const user = authUser(token);
    const db = loadDb();
    const list = db.notes[user.id] ?? [];
    if (!list.some((n) => n.id === id)) throw new ApiError(404, "笔记不存在");
    db.notes[user.id] = list.filter((n) => n.id !== id);
    saveDb(db);
    pushLog({
      method: "DELETE",
      path: `/api/notes/${id}`,
      status: 204,
    });
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    pushLog({
      method: "DELETE",
      path: `/api/notes/${id}`,
      status,
      detail: (e as Error).message,
    });
    throw e;
  }
}

export function resetMockApi() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(LOG_KEY);
  loadDb();
}
