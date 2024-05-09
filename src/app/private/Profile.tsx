"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClient,
  getAuthenticatedObjectUrl,
} from "@/utils/supabase/client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { splitExt } from "@/lib/utils";
import {
  encryptMasterKey,
  generateKeyEncryptionKey,
  generateMasterKey,
  getPasswordKey,
} from "@/lib/encrypt";

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

  const keySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(Object.fromEntries(formData));

    if (!formData.get("pin")) return;

    const passwordKey = await getPasswordKey(formData.get("pin") as string);

    const masterKey = await generateMasterKey();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    console.log("OG salt: ", salt);
    const keyEncryptionKey = await generateKeyEncryptionKey(passwordKey, salt);
    console.log(masterKey);

    let payload;

    if (masterKey.k) {
      /**
       * Encrypt the master key using the keyEncryptionKey and
       * an initialization vector/nonce of 12 random bytes
       */
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedMasterKey = await encryptMasterKey(
        keyEncryptionKey,
        masterKey.k,
        iv
      );

      if (encryptedMasterKey) {
        const encryptedMasterKey_b64 =
          Buffer.from(encryptedMasterKey).toString("base64");
        const salt_b64 = Buffer.from(salt).toString("base64");
        const iv_b64 = Buffer.from(iv).toString("base64");

        payload = {
          encrypted_master_key_b64: encryptedMasterKey_b64,
          // encryptedMessage,
          salt_b64: salt_b64,
          iv_b64: iv_b64,
        };

        console.log(payload);
        const supabase = createClient();
        const { data, error } = await supabase.from("users").upsert(payload);
        console.log(data, error);
        queryClient.invalidateQueries({ queryKey: ["userData"] });
      }
    }
  };
  return (
    <>
      <form onSubmit={keySubmit}>
        <label htmlFor="pin">PIN</label>
        <input type="text" name="pin" />
        <button>Submit</button>
      </form>
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
