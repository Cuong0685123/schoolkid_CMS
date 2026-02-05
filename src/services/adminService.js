import Cookies from 'js-cookie';

export async function loginAdmin(username, password) {
  if (!username || !password) {
    throw new Error('MISSING_CREDENTIALS');
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/admin/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!res.ok) {
    throw new Error('LOGIN_FAILED');
  }

  const data = await res.json();

  // API trả admin
  Cookies.set('cms_user', JSON.stringify(data.admin), { expires: 7 });

  return data;
}
