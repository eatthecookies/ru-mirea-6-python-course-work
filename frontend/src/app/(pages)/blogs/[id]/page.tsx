"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { createApi } from "@/axiosConfig";
import {
  Typography,
  List,
  Card,
  Spin,
  Empty,
  Button,
  Modal,
  Input,
  Layout,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";

const { Title, Paragraph } = Typography;

type Post = {
  id: number;
  blog: number;
  title: string;
  content: string;
};

type Blog = {
  id: number;
  title: string;
  description: string;
};

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const api = useMemo(
    () => (session?.access_token ? createApi(session.access_token) : null),
    [session?.access_token],
  );

  const [blog, setBlog] = useState<Blog | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  const getUserId = async () => {
    try {
      const res = await api?.get("/users/id/");
      return res && res.data.user_id;
    } catch (error) {
      console.error("Ошибка при получении ID пользователя", error);
      return null;
    }
  };

  const fetchData = async () => {
    if (!api || !id) return;

    setLoading(true);
    try {
      const [blogRes, postsRes] = await Promise.all([
        api.get(`/blogs/${id}/`),
        api.get("/posts/"),
      ]);

      setBlog(blogRes.data);
      const filteredPosts = postsRes.data.filter(
        (post: Post) => post.blog === Number(id),
      );
      setPosts(filteredPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api, id]);

  const handleAddPost = async () => {
    const userId = await getUserId();
    if (!userId || !api || !id) return;

    const res = await api.post("/posts/", {
      title: postTitle,
      content: postContent,
      blog: Number(id),
      owner: userId,
    });

    setPosts((prev) => [...prev, res.data]);
    setOpen(false);
    setPostTitle("");
    setPostContent("");
  };

  const handleDeletePost = async (postId: number) => {
    if (!api) return;
    await api.delete(`/posts/${postId}/`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="Блог не найден" />
      </div>
    );
  }

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <MainHeader />

      <div style={{ padding: 24, flex: 1 }}>
        <Title level={2}>{blog.title}</Title>
        <Paragraph>{blog.description}</Paragraph>

        <Title level={4}>Посты</Title>

        <Button
          type="primary"
          onClick={() => setOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Добавить пост
        </Button>

        {posts.length === 0 ? (
          <Empty description="Постов пока нет" />
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={posts}
            renderItem={(post) => (
              <List.Item>
                <Card
                  title={<Link href={`/posts/${post.id}`}>{post.title}</Link>}
                  extra={
                    <Button danger onClick={() => handleDeletePost(post.id)}>
                      Удалить
                    </Button>
                  }
                  hoverable
                  style={{ borderRadius: 8 }}
                >
                  {post.content.slice(0, 100)}...
                </Card>
              </List.Item>
            )}
          />
        )}

        <Modal
          title="Новый пост"
          open={open}
          onOk={handleAddPost}
          onCancel={() => setOpen(false)}
        >
          <Input
            placeholder="Заголовок"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Input.TextArea
            placeholder="Содержимое"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={4}
          />
        </Modal>
      </div>
      <MainFooter />
    </Layout>
  );
}
