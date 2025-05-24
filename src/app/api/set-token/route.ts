import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ message: "Token missing" }, { status: 400 });
  }

  const response = NextResponse.json({ message: "Cookie set from frontend" });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax", // or "strict" depending on your needs
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return response;
}
