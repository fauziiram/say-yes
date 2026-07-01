export function encodePrank(question: string, memeId: string, customYesMsg?: string): string {
  try {
    const data = { q: question, m: memeId, msg: customYesMsg || "" };
    const jsonStr = JSON.stringify(data);
    // Safe UTF-8 Base64 encoding
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return b64;
  } catch (error) {
    console.error("Encoding error:", error);
    return "";
  }
}

export interface DecodedPrank {
  question: string;
  memeId: string;
  customYesMsg: string;
}

export function decodePrank(hash: string): DecodedPrank | null {
  try {
    // Safe UTF-8 Base64 decoding
    const jsonStr = decodeURIComponent(escape(atob(hash)));
    const parsed = JSON.parse(jsonStr);
    return {
      question: parsed.q || "",
      memeId: parsed.m || "cat_dance",
      customYesMsg: parsed.msg || "",
    };
  } catch (error) {
    console.error("Decoding error:", error);
    return null;
  }
}

export function getShareUrls(url: string, question: string) {
  const text = `Eits, coba jawab pertanyaan dari aku di link ini dong! Jangan ditolak ya! 😜👇\n${url}`;
  const encodedText = encodeURIComponent(text);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Jawab jujur ya! 😉")}`,
    discord: `https://discord.com/channels/@me`, // Discord doesn't have a direct share URL API, but we can direct them to share the text
    clipboardText: text,
  };
}
