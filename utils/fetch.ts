export async function get(url: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`);
  return await res.json();
}

export async function post(url: string, body: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
}

export async function put(url: string, body: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/${url}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
}
