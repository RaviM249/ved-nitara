import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to get or initialize the mock DB
async function getUsersData() {
  const dataPath = path.join(process.cwd(), 'src', 'lib', 'mockData', 'users.json');
  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const users = await getUsersData();
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: 'mock_jwt_token_' + user.id,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
