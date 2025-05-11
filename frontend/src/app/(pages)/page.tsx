"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { createApi } from "@/axiosConfig";
import { Layout, Typography, List, Card, Button, Modal, Input } from "antd";
import Link from "next/link";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

const { Content } = Layout;

type Blog = {
  id: number;
  title: string;
  description: string;
};

export default function BlogsPage() {
  const { data: session } = useSession();
  const api = useMemo(
    () => (session?.access_token ? createApi(session.access_token) : null),
    [session?.access_token],
  );

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false);

  // Функция для получения user.id
  const getUserId = async () => {
    try {
      const res = await api?.get("/users/id/");
      return res && res.data.user_id; // Возвращаем ID пользователя
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!api) return;
    api.get("/blogs/").then((res) => setBlogs(res.data));
  }, [api]);

  const handleAdd = async () => {
    if (!api || !session) return;

    const userId = await getUserId(); // Получаем ID пользователя
    if (!userId) return; // Если не удалось получить ID, прекращаем выполнение

    const res = await api.post("/blogs/", {
      title,
      description: desc,
      owner: userId, // Используем полученный user.id
    });

    setBlogs((prev: Blog[]) => [...prev, res.data]);
    setOpen(false);
    setTitle("");
    setDesc("");
  };

  const handleDelete = async (id: number) => {
    if (!api) return;
    await api.delete(`/blogs/${id}/`);
    setBlogs((prev) => prev.filter((b: Blog) => b.id !== id));
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <MainHeader />
      <Content style={{ padding: 24, flex: 1 }}>
        <Typography.Title>Блоги</Typography.Title>
        <Button
          style={{ marginBottom: 24 }}
          type="primary"
          onClick={() => setOpen(true)}
        >
          Добавить блог
        </Button>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={blogs}
          renderItem={(blog) => (
            <List.Item>
              <Card
                title={<Link href={`/blogs/${blog.id}`}>{blog.title}</Link>}
                extra={
                  <Button danger onClick={() => handleDelete(blog.id)}>
                    Удалить
                  </Button>
                }
              >
                {blog.description}
              </Card>
            </List.Item>
          )}
        />
        <Modal
          title="Новый блог"
          open={open}
          onOk={handleAdd}
          onCancel={() => setOpen(false)}
        >
          <Input
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Input.TextArea
            placeholder="Описание"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Modal>
      </Content>
      <MainFooter />
    </Layout>
  );
}
