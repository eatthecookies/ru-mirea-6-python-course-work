"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message } from "antd";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string; email: string }) => {
    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/users/", {
        username: values.username,
        password: values.password,
        email: values.email,
      });

      message.success("Регистрация успешна! Теперь вы можете войти");
      router.push("/auth/login");
    } catch (error: any) {
      if (error.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else {
        message.error("Произошла ошибка при регистрации");
      }
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
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Регистрация</h1>
        <Form
          name="register"
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Пожалуйста, введите email" },
              { type: "email", message: "Введите корректный email" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: "Пожалуйста, введите пароль" },
              { min: 6, message: "Пароль должен быть не менее 6 символов" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Link href="/auth/login">
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
} 