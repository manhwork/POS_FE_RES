import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Define the path to the data file
const dataFilePath = path.join(process.cwd(), "data/tables.json");

/**
 * Handles GET requests to fetch all tables.
 */
export async function GET() {
    try {
        // Read the file from the server's file system
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        // Parse the JSON data
        const data = JSON.parse(fileContents);
        // Respond with the data
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading or parsing data file:", error);
        // Handle errors, e.g., file not found or invalid JSON
        return NextResponse.json(
            { message: "Error reading data file." },
            { status: 500 }
        );
    }
}

/**
 * Handles POST requests to update the tables data.
 */
export async function POST(request: Request) {
    try {
        // Get the new data from the request body
        const newData = await request.json();

        // Convert the new data to a formatted JSON string
        const updatedFileContents = JSON.stringify(newData, null, 2);

        // Write the updated data back to the file
        await fs.writeFile(dataFilePath, updatedFileContents, "utf8");

        // Respond with a success message
        return NextResponse.json({ message: "Data updated successfully." });
    } catch (error) {
        console.error("Error writing data file:", error);
        // Handle errors during writing
        return NextResponse.json(
            { message: "Error writing data file." },
            { status: 500 }
        );
    }
}
