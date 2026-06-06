const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

type ResponseWithMessage = Record<string, unknown> & { message?: string };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = options.token
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const responseBody = (await response.json().catch(() => ({}))) as ResponseWithMessage;

  if (!response.ok) {
    const message =
      typeof responseBody.message === "string" ? responseBody.message : "Request gagal";
    throw new Error(message);
  }

  return responseBody as T;
}

export type PostComment = {
  id: number;
  username: string;
  content: string;
  like_count: number;
  created_at: string;
};

export type PostDetail = {
  id: number;
  title: string;
  username: string;
  content: string;
  like_count: number;
  is_liked: boolean;
  comments: PostComment[];
  created_at: string;
  updated_at: string;
};

export type PostListResponse = {
  data: PostDetail[];
  current_page: number;
  total_page: number;
};

export async function getPosts({
  limit = 12,
  page = 1,
}: {
  limit?: number;
  page?: number;
} = {}): Promise<PostListResponse> {
  return request<PostListResponse>(`/posts?limit=${limit}&page=${page}`); // ✅ fix: hapus trailing slash
}

export async function getPostDetail(postId: string, token?: string | null): Promise<PostDetail> {
  return request<PostDetail>(`/posts/${postId}/detail`, { token });
}

export async function createPost(input: {
  title: string;
  content: string;
  token: string;
}): Promise<{ id: number }> {
  return request("/posts", {
    method: "POST",
    token: input.token,
    body: {
      title: input.title,
      content: input.content,
    },
  });
}

export async function updatePost(input: {
  postId: string;
  title: string;
  content: string;
  token: string;
}): Promise<{ id: number }> {
  return request(`/posts/${input.postId}/update`, {
    method: "PUT",
    token: input.token,
    body: {
      title: input.title,
      content: input.content,
    },
  });
}

export async function togglePostLike(postId: number | string, token: string) {
  return request<{ message: string }>("/posts/action", {
    method: "POST",
    token,
    body: {
      post_id: Number(postId),
    },
  });
}

export async function submitComment(payload: {
  postId: number;
  content: string;
  token: string;
}) {
  return request<{ id: number }>("/comments", {
    method: "POST",
    token: payload.token,
    body: {
      post_id: payload.postId,
      content: payload.content,
    },
  });
}

export async function toggleCommentLike(commentId: number, token: string) {
  return request<{ message: string }>("/comments/action", {
    method: "POST",
    token,
    body: {
      comment_id: commentId,
    },
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; refresh_token: string }> {
  return request("/auth/login", {
    method: "POST",
    body: payload,
  });
}
export async function deletePost(input: {
  postId: string;
  token: string;
}): Promise<{ message: string }> {
  return request(`/posts/${input.postId}/delete`, {
    method: "DELETE",
    token: input.token,
  });
}

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
};

export async function register(payload: RegisterPayload): Promise<{ id: number }> {
  return request("/auth/register", {
    method: "POST",
    body: payload,
  });
}
