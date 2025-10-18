import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNING_SECRET);

    // Use the request headers directly (req.headers) because headers() helper may not be available
    const svixHeader = {
        "svix-id": req.headers.get("svix-id"),
        "svix-timestamp": req.headers.get("svix-timestamp"),
        "svix-signature": req.headers.get("svix-signature"),
    };

    // Read the raw body text — Svix requires verification against the exact raw payload
    const body = await req.text();
    const { data, type } = wh.verify(body, svixHeader);

    //prepare the user data to save in DB

    const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || undefined,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        image: data.image_url,
    };

    await connectDB();

    switch (type) { 
        case "user.created":
            await User.create(userData);
            break;

        case "user.updated":
            await User.findByIdAndUpdate(data.id, userData);
            break;

        case "user.deleted":
            await User.findByIdAndDelete(data.id);
            break;

        default:
            break;
    }

    return NextResponse.json({ message: "Webhook received successfully" });
}