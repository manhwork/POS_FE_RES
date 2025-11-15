import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/settings.json");

/**
 * Handles GET requests to fetch the settings.
 */
export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading settings data file:", error);
        return NextResponse.json(
            { message: "Error reading settings data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to update the settings data.
 */
export async function POST(request: Request) {
    try {
        const newData = await request.json();
        const updatedFileContents = JSON.stringify(newData, null, 2);
        await fs.writeFile(dataFilePath, updatedFileContents, "utf8");
        return NextResponse.json({
            message: "Settings data updated successfully.",
        });
    } catch (error) {
        console.error("Error writing settings data file:", error);
        return NextResponse.json(
            { message: "Error writing settings data file." },
            { status: 500 }
        );
    }
}
