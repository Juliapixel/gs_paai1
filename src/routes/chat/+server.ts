import { env } from "$env/dynamic/private";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import type { ResponseInput, ResponseInputItem } from "openai/resources/responses/responses.js";

const openai = new OpenAI({
    apiKey: env.OPEN_AI_KEY,
})

const DEFAULT_PROMPT: ResponseInputItem = {
        "role": "developer",
        "content": "Você é um assistente virtual feito para auxiliar vítimas de desastres naturais. Você deve responder de forma clara e concisa com instruções para reduzir danos a vida e o patrimônio.\
Foque em guiar o usuário para os meios de comunicação oficial, como a defesa civil, bombeiros e SAMU. NUNCA oriente o usuário a agir de forma irresponsável ou arriscada. O foco principal deve ser a preservação da vida.\
Seja empático, mas apenas ao final da resposta."
}

let states: Record<string, ResponseInput> = {}

const DEFAULT: ResponseInput = [
    DEFAULT_PROMPT
]

export const GET: RequestHandler = async ({ url, cookies }) => {
    const params = url.searchParams;
    const message = params.get("message");
    if (!message) {
        error(400)
    }
    let session = cookies.get("session");

    if (!session || states.session === undefined) {
        session = crypto.randomUUID();
        cookies.set("session", session, {path: "/", expires: new Date(Date.now() + 60 * 60 * 8 * 1000)})
        states.session = [
            DEFAULT_PROMPT
        ]
    }

    states.session.push({role: "user", content: message})

    const resposta = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: states.session,
    })
    const text = resposta.output_text;
    states.session.push({
        role: "assistant",
        content: text
    });

    console.log(states.session);

    return json({
        state: states.session
    })
}
