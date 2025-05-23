import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");

  if (!token) {
    return NextResponse.json({ token: null, message: "No token found" }, { status: 401 });
  }

  return NextResponse.json({ token, message: 'token found' }, { status: 200 });
}
