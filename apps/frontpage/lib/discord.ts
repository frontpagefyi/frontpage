import "server-only";
import { serverConfig } from "./config/server-config";

type DiscordMessageInput = {
  embeds: Array<{
    title: string;
    description?: string;
    url?: string;
    color?: number;
    author?: {
      name: string;
      icon_url: string;
      url: string;
    };
    fields?: Array<{
      name: string;
      value: string;
    }>;
  }>;
};

export async function sendDiscordMessage(message: DiscordMessageInput) {
  if (serverConfig.DISCORD_WEBHOOK_URL) {
    const webhookResponse = await fetch(serverConfig.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!webhookResponse.ok) {
      console.error("Failed to alert of new post", webhookResponse.statusText);
    }
  } else {
    console.error("Can't send discord message: No DISCORD_WEBHOOK_URL set");
  }
}
