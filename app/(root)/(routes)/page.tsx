import Allies from "@/components/Allies";
import Categories from "@/components/Categories";
import SearchBar from "@/components/SearchBar";
import db from "@/lib/db";
import React from "react";

interface RootSearchProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const page = async ({ searchParams }: RootSearchProps) => {
  const { categoryId, name } = searchParams;

  const allies = await db.ally.findMany({
    where: {
      categoryId,
      name: { search: name },
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  const categories = await db.category.findMany();

  return (
    <div className="p-3 h-full space-y-2">
      <SearchBar />
      <Categories categories={categories} />
      <Allies data={allies} />
    </div>
  );
};

export default page;
