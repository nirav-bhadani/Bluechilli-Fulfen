import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Fulfen Primary School — Where Learning Comes Alive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/fulfen/logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0407a5 0%, #060886 55%, #04053f 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(249, 213, 4, 0.16)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 26,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              width={84}
              height={84}
              alt="Fulfen Primary School logo"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.1 }}>
              Fulfen Primary School
            </span>
            <span
              style={{
                fontSize: 22,
                color: "rgba(255,255,255,0.72)",
                marginTop: 6,
              }}
            >
              Burntwood · Staffordshire · WS7 9BJ
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            Where Learning
            <span style={{ color: "#f9d504", marginLeft: 22 }}>
              Comes Alive
            </span>
          </span>
          <span
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            A caring school where every child is known, valued and inspired.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#f9d504",
              display: "flex",
            }}
          />
          www.fulfen.staffs.sch.uk
        </div>
      </div>
    ),
    { ...size },
  );
}
