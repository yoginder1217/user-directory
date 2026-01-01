import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
  siteTitle: "Campus Directory",
  siteSubtitle: "Academic profiles hub",
  heroTitle: "Welcome to Campus Directory",
  heroDescription: "Explore and connect with students, teachers, and staff across our campus. Find experts in various fields and expand your academic network.",
  footerText: "© 2024 Campus Directory. All rights reserved."
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      ...body,
      message: "Settings saved successfully!"
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
