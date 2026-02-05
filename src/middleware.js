import { NextResponse } from "next/server";

export function middleware(req) {
    const user = req.cookies.get("cms_user")?.value;
    console.log("middlewareee");
    
    console.log("cookie user: ", user);
    

    // Nếu chưa login và đang vào dashboard → redirect về login
    if (!user && req.nextUrl.pathname.startsWith("/")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Áp dụng cho toàn bộ / và /dashboard/*
export const config = {
    matcher: ["/", "/dashboard/:path*"],
};
