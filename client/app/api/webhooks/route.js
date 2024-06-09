import { Webhook } from "svix";
import { headers } from "next/headers";
import { createUser } from "../../../lib/actions/user.action";
import { NextResponse } from "next/server";
export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: No svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;
    console.log("Webhook event type:", eventType, "Event Id:", id);

    const mongoUser = await createUser({
      clerkId: id,
      name: `${first_name} ${last_name}`,
      userName: username,
      email: email_addresses[0].email_address,
      profilePic: image_url,
    });
    return NextResponse.json({
      success: true,
      data: mongoUser,
      message: "User has been created Successfully",
    });
  }
}
