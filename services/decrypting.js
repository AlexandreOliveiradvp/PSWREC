import crypto from "crypto";

const keySecret = "asdfqwerasdfqwerasdfqwerasdfqwer";
function decrypt(value) {
  const [iv, encrypted] = value.split(":");
  const ivBuffer = Buffer.from(iv, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(keySecret),
    ivBuffer
  );
  let content = decipher.update(Buffer.from(encrypted, "hex"));
  content = Buffer.concat([content, decipher.final()]);
  return content.toString();
}
export default decrypt;
