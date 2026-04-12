import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const { email, password, name,role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        role:role || 'user'
      },
    });

    const token = await generateToken(user.id, user.email);

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

