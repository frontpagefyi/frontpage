import {
  badRequest,
  createApiRoute,
  internalServerError,
} from "@/lib/api-route";
import z from "zod";

export const GET = createApiRoute(async (request) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    badRequest("Missing url parameter");
  }

  const cardyBURL = new URL("https://cardyb.bsky.app/v1/extract");
  cardyBURL.searchParams.set("url", targetUrl);

  const response = await fetch(cardyBURL);
  if (!response.ok) {
    internalServerError(`CardyB responded with status ${response.status}`);
  }

  const data = await response.json();

  const parseResult = CardyBResponse.safeParse(data);
  if (!parseResult.success) {
    internalServerError("CardyB responded with invalid data");
  }

  if (parseResult.data.error) {
    badRequest(`CardyB error: ${parseResult.data.error}`);
  }

  return {
    title: parseResult.data.title ?? null,
  };
});

const CardyBResponse = z.object({
  error: z.string().nullish(),
  title: z.string().nullish(),
});
