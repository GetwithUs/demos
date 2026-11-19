import type { Metadata } from "next";
import SkinQuiz from "@/sites/skincare/components/quiz/SkinQuiz";
import { Container } from "@/sites/skincare/components/ui";

export const metadata: Metadata = {
  title: "Skin quiz: find your routine",
  description:
    "Seven quick questions, then a morning and night routine made for your skin, city and time.",
};

export default function SkinQuizPage() {
  return (
    <Container className="pt-8 pb-10 sm:pt-12">
      <SkinQuiz />
    </Container>
  );
}
