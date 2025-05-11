"use client";
import { Layout, Button, Space } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSession, signOut } from "next-auth/react";

const { Header } = Layout;

export default function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const showBack = pathname !== "/" && pathname !== "/blogs";

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 24px",
      }}
    >
      <Space>
        {showBack && (
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Назад
          </Button>
        )}
        <Link href="/">
          <Button type="link">Все блоги</Button>
        </Link>
        <Link href="/posts">
          <Button type="link">Все посты</Button>
        </Link>
      </Space>
      <Space>
        {session ? (
          <Button danger onClick={handleSignOut}>
            Выйти
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button type="primary">Войти</Button>
          </Link>
        )}
      </Space>
    </Header>
  );
}
