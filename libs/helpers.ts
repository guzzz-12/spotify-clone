export const getUrl = () => {
  let urlStr = process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  "http://localhost:3000";

  let url = new URL(urlStr);

  if (url.host !== "localhost" && !url.protocol.includes("https")) {
    url.protocol = "https"
  };

  return url.origin;
};

export const toDateTime = (secs: number) => {
  const t = new Date("1970-01-01T00:30:00Z");
  t.setSeconds(secs);
  return t;
};