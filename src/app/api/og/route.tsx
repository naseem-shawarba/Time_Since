import { ImageResponse } from "next/og";
const size = {
  width: 900,
  height: 400,
};

const contentType = "image/png";

function getTimeDifferenceLabel(dateStr: string): string {
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return "";

  const now = new Date();

  // Determine if the date is past or future
  const isFuture = target.getTime() > now.getTime();

  // Work with positive differences by always subtracting the smaller from the larger
  const start = isFuture ? now : target;
  const end = isFuture ? target : now;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);

  if (parts.length === 0) return isFuture ? "in 0 days" : "0 days";

  return isFuture ? `in ${parts.join(", ")}` : parts.join(", ");
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
  
  const title = searchParams.get("title") || "";
  const date = searchParams.get("date") || "";
  const theme = searchParams.get("theme");
  const backgroundColor =
    theme === "dark"
      ? "#202020"
      : searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor =
    theme === "dark"
      ? "#E0E0E0"
      : searchParams.get("textColor") || "#000000";
  const showStartDate = searchParams.get("showStartDate") === "true";
  const startDateColor =
    theme === "dark"
      ? searchParams.get("backgroundColor") || "#404040"
      : searchParams.get("backgroundColor") || "#eaeaeaff";
  const logoUrl = searchParams.get("logoUrl") || "";
  const logoFilter = searchParams.get("invertLogoColor") === "true" ? "invert(1)" : "none";
  const since = getTimeDifferenceLabel(date);



  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          color: textColor,
          background: backgroundColor,
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
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end", 
            height: "110px",      
            marginBottom: 25,     
          }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              style={{
                height: "110px",
                borderRadius: "12px",
                background: "transparent",
                filter: logoFilter,
                marginRight: 10,
              }}
              alt="logo"
            />
          )}
          {title && (
            <div
              style={{
                fontSize: 66,
                fontWeight: 700,
                display: "flex",
                alignItems: "flex-end",
                height: "110px",
                marginBottom: 0,
              }}
            >
              {title}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 61,
            fontWeight: 800,
          }}
        >
          {since}
        </div>
        {showStartDate && date && (
          <div
            style={{
              position: "absolute",
              top: 22,
              left: 22,
              fontSize: 25,
              color: startDateColor,
            }}
          >
            {formatDate(date)}
          </div>
        )}
      </div>
    ),
    size
  );
}
