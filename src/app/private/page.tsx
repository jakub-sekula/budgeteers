import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import {
  encryptMasterKey,
  generateKeyEncryptionKey,
  generateMasterKey,
  getPasswordKey,
} from "@/lib/encrypt";
import { fetchTransactions } from "@/utils/supabase/api";

export default async function PrivatePage() {
  const supabase = createClient();

  const transactions = await fetchTransactions()
  console.log("transactions: ", transactions)

  const masterKey = await generateMasterKey();
  const passwordKey = await getPasswordKey("password");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyEncryptionKey = await generateKeyEncryptionKey(passwordKey, salt);

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
      /**
       * The encrypted master key is encoded into a base64 string, and
       * can now be stored safely in a database. No one can decrypt the
       * key without being able to derive a keyEncryptionKey
       *
       * To ensure users can re-derive their keyEncryptionKey and decrypt the
       * master key on other devices, the keyEncryptionKey salt and encryptedMasterKey
       * nonce are saved to the database as base64 strings too
       *
       * This is safe to do since they're not sensitive secrets, and still requires
       * the user to know the exact password to be able to derive and decrypt
       */
      const encryptedMasterKey_b64 =
        Buffer.from(encryptedMasterKey).toString("base64");
      const salt_b64 = Buffer.from(salt).toString("base64");
      const iv_b64 = Buffer.from(iv).toString("base64");

      console.log(encryptedMasterKey_b64, salt_b64, iv_b64);
    }
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <pre>{JSON.stringify(data.user, null, 2)}</pre>;
}
