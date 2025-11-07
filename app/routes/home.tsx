import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {

  

  return [
    { title: "Litly" },
    { name: "description", content: "Welcome to Litly!" },
  ];
}

export default function Home() {

  return (
    ""
  );

}
