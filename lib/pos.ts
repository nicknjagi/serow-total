// /lib/pos.ts

let token: string | null = null;
let tokenExpiry: number | null = null;

const BASE_URL = process.env.POS_BASE_URL!;
const LOGIN_URL = process.env.POS_LOGIN_URL!;

async function login() {
  const res = await fetch(`${LOGIN_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username_email: process.env.POS_USERNAME,
      password: process.env.POS_PASSWORD,
    }),
  });

  if (!res.ok) {
    console.log(`error`,res)
    throw new Error("POS login failed");
  }

  const data = await res.json();

  token = data.access;

  // if expires_in exists (seconds)
  if (data.expires_in) {
    tokenExpiry = Date.now() + data.expires_in * 1000;
  } else {
    // fallback: assume 1 hour
    tokenExpiry = Date.now() + 60 * 60 * 1000;
  }
}

async function getToken() {
  if (!token || !tokenExpiry || Date.now() >= tokenExpiry) {
    await login();
  }
  return token!;
}

export async function posFetch(path: string, options: RequestInit = {}) {
  let t = await getToken();

  let res = await fetch(`${BASE_URL}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
    },
  });

  // handle expired token
  if (res.status === 401) {
    await login();
    t = await getToken();

    res = await fetch(`${BASE_URL}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
    });
  }

  if (!res.ok) {
    console.log(`error`,res)
    throw new Error(`POS request failed: ${res.status}`);
  }

  return res.json();
}