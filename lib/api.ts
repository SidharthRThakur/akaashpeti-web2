export async function fetchLinks(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/link-shares`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch links");
  return res.json();
}

export async function createLink(token: string, body: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/link-shares`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create link");
  return res.json();
}

export async function deleteLink(token: string, id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/link-shares/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete link");
  return res.json();
}
