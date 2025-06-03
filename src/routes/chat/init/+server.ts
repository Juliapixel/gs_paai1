import { json, type RequestHandler } from "@sveltejs/kit";
import { _states } from "../+server";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get("session");
  if (!session) {
    return json({ state: [] });
  }

  const state = _states[session];
  if (!state) {
    return json({ state: [] });
  } else {
    return json({ state: state });
  }
};
