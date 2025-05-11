import { Layout } from "antd";

const { Footer } = Layout;

export default function MainFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      © {new Date().getFullYear()} Блог-платформа. Все права защищены.
    </Footer>
  );
}
