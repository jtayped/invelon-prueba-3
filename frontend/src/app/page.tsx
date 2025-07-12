import UserForm from "@/components/form";
import UserGrid from "@/components/grid";
import UserHeader from "@/components/header";
import { Container } from "react-bootstrap";

export default function HomePage() {
  return (
    <Container fluid className="py-3">
      <UserHeader />
      <UserForm />
      <UserGrid />
    </Container>
  );
}
