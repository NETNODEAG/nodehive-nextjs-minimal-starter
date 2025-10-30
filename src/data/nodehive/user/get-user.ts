import { createUserClient } from '@/lib/nodehive-client';

export async function getUser() {
  const client = createUserClient();
  try {
    const user = await client.getUserDetails();
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching user details:', message);
    return null;
  }
}
