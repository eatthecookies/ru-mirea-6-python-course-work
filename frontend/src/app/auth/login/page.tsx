"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        message.error("Неверный логин или пароль");
        return;
      }

      router.push("/");
      message.success("Успешный вход");
    } catch (error) {
      message.error("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#f0f2f5"
    }}>
      <Card style={{ width: 400, padding: "24px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Вход</h1>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[{ required: true, message: "Пожалуйста, введите имя пользователя" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Link href="/auth/register">
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
} 