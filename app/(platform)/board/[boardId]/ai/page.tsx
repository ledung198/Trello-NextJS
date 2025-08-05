import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AIDashboard } from "../_components/ai-dashboard";

interface AIPageProps {
  params: {
    boardId: string;
  };
}

const AIPage = async ({ params }: AIPageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <AIDashboard />;
};

export default AIPage;