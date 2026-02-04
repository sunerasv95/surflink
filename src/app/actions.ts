"use server";

export type WaitlistState = {
    status: "idle" | "loading" | "success" | "error";
    message?: string;
};

export async function submitWaitlist(email: string, homeBreak: string): Promise<WaitlistState> {
    if (!email || !homeBreak) {
        return { status: "error", message: "Email and Home Break are required." };
    }

    const scriptUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;

    if (!scriptUrl) {
        console.error("GOOGLE_SHEETS_WEBAPP_URL is not defined");
        return { status: "error", message: "Service configuration error." };
    }

    try {
        const response = await fetch(scriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, homeBreak }),
        });

        const result = await response.json();

        if (result.result === "success") {
            return { status: "success", message: "You're in the lineup!" };
        } else {
            console.error("Google Script Error:", result);
            return { status: "error", message: "Failed to join waitlist." };
        }
    } catch (error) {
        console.error("Submission error:", error);
        return { status: "error", message: "Network error. Please try again." };
    }
}
