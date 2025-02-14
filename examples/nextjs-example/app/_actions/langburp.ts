"use server"

import { langburpClient } from "../../utils/langburp-client";

// It's important to run this logic server-side, as it requires your secret API key
export async function authorizeEndUserForLangburp(state?: string) {
  try {
    // Instead of dummy data, you can fetch and verify the organization and user from your database here
    const organization = {
      id: "example-org-123",
      name: "Example Organization",
    };
    const user = {
      id: "john-doe-123",
      name: "John Doe",
      email: "john.doe@example.com",
    };

    // Authorize the end user for Langburp and return the authorization response to the Langburp client library
    return await langburpClient.endUserAuth.authorizeEndUser({
      authorizeEndUserRequestBody: {
        state,
        connectionMetadata: {
          id: organization.id,
          name: organization.name,
          // You can add any other metadata you want to store for the organization on the "Connection" object
        },
        connectionUserMetadata: {
          id: user.id,
          name: user.name,
          email: user.email,
          // You can add any other metadata you want to store for the user on the "Connection User" object
        },
      },
    });
  } catch (error) {
    console.error("Error authorizing end user in internal action:", error);
    throw error;
  }
}
