import { env } from "$env/dynamic/private";
import { prompts, type PromptType } from "$lib";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import type {
  ResponseInput,
  ResponseInputItem,
} from "openai/resources/responses/responses.js";

const openai = new OpenAI({
  apiKey: env.OPEN_AI_KEY,
});

let states: Record<string, ResponseInput> = {};

export const GET: RequestHandler = async ({ url, cookies }) => {
  const params = url.searchParams;
  const message = params.get("message");
  if (!message) {
    error(400);
  }
  let session = cookies.get("session");
  const mode = (params.get("mode") as PromptType | undefined) ?? "role";

  if (!session || states.session === undefined) {
    session = crypto.randomUUID();
    cookies.set("session", session, {
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 8 * 1000),
    });
    states.session = [];
  }

  states.session.push({ role: "user", content: message });
  const sys_prompt = prompts[mode];
  if (sys_prompt === undefined) {
    error(400);
  }

  const resposta = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "developer", content: sys_prompt } as ResponseInputItem,
    ].concat(states.session),
  });

  const text = resposta.output_text;

  states.session.push({
    role: "assistant",
    content: text,
  });

  console.log(states.session);

  return json({
    state: states.session,
  });
};
