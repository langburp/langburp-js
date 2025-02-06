"use server"

import { authorizeEndUser } from "../../utils/langburp-api";

export async function authorizeEndUserForLangburp(state?: string) {
  try {
    return await authorizeEndUser(state);
  } catch (error) {
    console.error("Error authorizing end user in internal action:", error);
    throw error;
  }
}
