import AllyForm from "@/components/AllyForm";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import React from "react";

interface AllyParamsProps {
  params: { allyId: string };
}

const page = async ({ params }: AllyParamsProps) => {
  const { userId } = auth();
  if (!userId) {
    return auth().redirectToSignIn();
  }

  const ally = await db.ally.findUnique({
    where: { id: params.allyId, userId},
  });

  const categories = await db.category.findMany();

  return <AllyForm initialData={ally} categories={categories} />;
};

export default page;
