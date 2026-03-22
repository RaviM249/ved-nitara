import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'src', 'lib', 'mockData', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      users = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist, we'll just start with an empty array or handle error
      console.error("Could not read users.json", error);
    }

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 });
    }

    // Create new user mapping to our schema
    const newUser = {
      id: `u_${role.toLowerCase()}_${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
      role,
      isEmailVerified: false,
      status: "ACTIVE",
      roles: [role] // Backwards compatibility
    };

    // Add to array and save back to file
    users.push(newUser);
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf-8');

    // Don't send password back to frontend
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
