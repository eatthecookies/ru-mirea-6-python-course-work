"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { createApi } from "@/axiosConfig";
import { Layout, Typography, List, Card, Spin, Empty } from "antd";
import Link from "next/link";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

type Post = {
  id: number;
  blog: number;
  title: string;
  content: string;
};

export default function PostsPage() {
  const { data: session } = useSession();
  const api = useMemo(
    () => (session?.access_token ? createApi(session.access_token) : null),
    [session?.access_token],
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) return;
    api
      .get("/posts/")
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [api]);

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <MainHeader />
      <Content style={{ padding: 24, flex: 1 }}>
        <Title level={2}>Все посты</Title>

        {loading ? (
          <Spin size="large" />
        ) : posts.length === 0 ? (
          <Empty description="Постов пока нет" />
        ) : (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={posts}
            renderItem={(post) => (
              <List.Item>
                <Link href={`/posts/${post.id}`}>
                  <Card
                    title={post.title}
                    hoverable
                    style={{ borderRadius: 8 }}
                  >
                    <Paragraph>
                      {post.content.length > 100
                        ? `${post.content.slice(0, 100)}...`
                        : post.content}
                    </Paragraph>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        )}
      </Content>
      <MainFooter />
    </Layout>
  );
}
