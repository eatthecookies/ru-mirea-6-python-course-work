"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { createApi } from "@/axiosConfig";
import { Typography, Layout, List, Card, Input, Button, message } from "antd";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

type Comment = {
  id: number;
  post: number;
  author: number;
  content: string;
  created_at: string;
};
type Post = {
  id: number;
  blog: number;
  title: string;
  content: string;
};
export default function PostDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();

  const api = useMemo(
    () => (session?.access_token ? createApi(session.access_token) : null),
    [session?.access_token],
  );

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!api || !id) return;

    api.get(`/posts/${id}/`).then((res) => setPost(res.data));

    fetchComments();
  }, [api, id]);

  const fetchComments = async () => {
    const res = await api?.get("/comments/");
    const filtered =
      res && res.data.filter((comment: Comment) => comment.post === Number(id));
    setComments(filtered);
  };

  const getUserId = async () => {
    try {
      const res = await api?.get("/users/id/");
      return res && res.data.user_id;
    } catch (error) {
      console.error("Ошибка при получении user_id:", error);
      return null;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const userId = await getUserId();
    if (!userId || !api) return;

    await api.post("/comments/", {
      content: newComment,
      post: Number(id),
      author: userId,
    });

    setNewComment("");
    fetchComments();
    message.success("Комментарий добавлен");
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <MainHeader />
      <div style={{ padding: 24, flex: 1 }}>
        <Typography.Title level={2}>{post?.title}</Typography.Title>
        <Typography.Paragraph>{post?.content}</Typography.Paragraph>

        <Typography.Title level={4}>Комментарии</Typography.Title>

        <List
          dataSource={comments}
          renderItem={(comment: Comment) => (
            <List.Item>
              <Card>{comment.content}</Card>
            </List.Item>
          )}
        />

        <div style={{ marginTop: 24, flex: 1 }}>
          <Input.TextArea
            placeholder="Напишите комментарий..."
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <Button type="primary" onClick={handleAddComment}>
            Добавить комментарий
          </Button>
        </div>
      </div>
      <MainFooter />
    </Layout>
  );
}
