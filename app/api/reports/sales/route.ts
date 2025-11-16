import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "data", "sales.json");
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to read data" }),
      { status: 500 }
    );
  }
}
