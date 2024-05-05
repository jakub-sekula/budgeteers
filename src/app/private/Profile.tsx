"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClient,
  getAuthenticatedObjectUrl,
} from "@/utils/supabase/client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { splitExt } from "@/lib/utils";

export default function Profile() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const supabase = createClient();
      return await supabase.from("users").select("*");
    },
  });

  const userData = query.data?.data as Tables<"users">[] | undefined;

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const supabase = createClient();
    const { data: userRes, error } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!file || !user) return;

    const [filename, extension] = splitExt(file.name);

    try {
      const { data: uploadRes, error } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/${filename}-${Date.now()}.${extension}`, file);

      if (error) {
        console.error("Error uploading file:", error.message);
      } else {
        console.log("File uploaded successfully:", uploadRes);

        const { data: uploadData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadRes.path);

        await supabase
          .from("users")
          .update({ avatar: uploadData?.publicUrl })
          .eq("id", user.id);

        queryClient.invalidateQueries({ queryKey: ["userData"] });
      }
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
    }
  };

  return (
    <>
      <input type="file" name="avatar" onChange={handleFileChange} />
      <Button onClick={handleSubmit}>Upload</Button>
      <Image
        width={64}
        height={64}
        src={userData?.[0]?.avatar ? (userData[0].avatar as string) : ""}
        alt=""
        className="size-16 rounded-full"
      />
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </>
  );
}
