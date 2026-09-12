import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Swarm Collective — an invite-only network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GREEN = "#00ff41";
const BG = "#030703";

const NODES = [
  { x: 56, y: 40, s: 24, o: 1 },
  { x: 34, y: 54, s: 17, o: 0.88 },
  { x: 68, y: 16, s: 15, o: 0.82 },
  { x: 16, y: 36, s: 12, o: 0.68 },
  { x: 46, y: 74, s: 11, o: 0.6 },
  { x: 78, y: 54, s: 9, o: 0.5 },
  { x: 10, y: 60, s: 8, o: 0.4 },
  { x: 60, y: 4, s: 7, o: 0.32 },
];

const vt323Promise = readFile(join(process.cwd(), "src/app/og-fonts/VT323-Regular.ttf"));
const shareTechMonoPromise = readFile(
  join(process.cwd(), "src/app/og-fonts/ShareTechMono-Regular.ttf")
);

export default async function Image() {
  const [vt323, shareTechMono] = await Promise.all([vt323Promise, shareTechMonoPromise]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: BG,
          fontFamily: "ShareTechMono",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `radial-gradient(${GREEN}55 2px, transparent 2px)`,
            backgroundSize: "30px 30px",
            opacity: 0.5,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -140,
            left: 300,
            width: 900,
            height: 900,
            display: "flex",
            borderRadius: 900,
            background: `radial-gradient(circle, ${GREEN}45 0%, ${GREEN}00 65%)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 28,
            display: "flex",
            border: `1px solid ${GREEN}66`,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `repeating-linear-gradient(0deg, ${GREEN}14 0px, ${GREEN}14 1px, transparent 1px, transparent 4px)`,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 8,
              color: `${GREEN}cc`,
              marginBottom: 28,
            }}
          >
            {">_ INVITE-ONLY NETWORK"}
          </div>

          <div style={{ display: "flex", width: 170, height: 170, marginBottom: 8 }}>
            <svg viewBox="0 0 100 100" width="170" height="170">
              {NODES.map((n) => (
                <rect
                  key={`${n.x}-${n.y}`}
                  x={n.x}
                  y={n.y}
                  width={n.s}
                  height={n.s}
                  fill={GREEN}
                  opacity={n.o}
                />
              ))}
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "VT323",
              fontSize: 112,
              color: GREEN,
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            SWARM COLLECTIVE
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#d4ffdcaa",
              marginTop: 18,
            }}
          >
            Get introduced. Join the directory. Bring others in.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 44,
            right: 56,
            display: "flex",
            fontSize: 22,
            color: `${GREEN}99`,
            letterSpacing: 2,
          }}
        >
          swarmcollective.world
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "VT323", data: vt323, style: "normal", weight: 400 },
        { name: "ShareTechMono", data: shareTechMono, style: "normal", weight: 400 },
      ],
    }
  );
}
