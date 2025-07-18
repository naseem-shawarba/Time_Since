import { ImageResponse } from "next/og";
const size = {
  width: 900,
  height: 400,
};

const contentType = "image/png";

function getTimeSince(dateStr: string): string {
  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return "";

  const now = new Date();
  let years = now.getFullYear() - targetDate.getFullYear();
  let months = now.getMonth() - targetDate.getMonth();
  let days = now.getDate() - targetDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);

  return parts.join(", ");
}


function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Untitled";
  const date = searchParams.get("date") || "";
  const since = getTimeSince(date);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          color: "#E0E0E0",
          background: "#202020",
          width: "100%",
          height: "100%",
          padding: "50px 50px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "30px",
        }}
      >
        <div
          style={{
            fontSize: 66,
            fontWeight: 700,
            marginBottom: 25,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 61,
            fontWeight: 800,
          }}
        >
          {since}
        </div>
        <div style={{ position: "absolute", top: 22, left: 22 , fontSize: 25, color: "#404040" }}>
          {formatDate(date)}
        </div>
      </div>
    ),
    size
  );
}
