import { Editor } from "@/components/features/editor";
import { protectServer } from "@/lib/auth";
import React from "react";

export default async function EditorProject() {
  await protectServer();

  return <Editor initialData={""} />;
}
