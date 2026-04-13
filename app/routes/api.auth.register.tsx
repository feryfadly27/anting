import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { registerUser } from "~/utils/auth.server";
import { createSessionHeader } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return data({ error: "Method not allowed" }, { status: 405 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return data({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const user = await registerUser(name, email, password);

    if (!user) {
        return data({ error: "Registration failed" }, { status: 400 });
    }

    const headers = await createSessionHeader(user.id);

    return data({ user }, { headers });
}
