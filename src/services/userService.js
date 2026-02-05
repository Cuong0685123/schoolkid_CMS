const API_URL = 'http://localhost:3001/api';
import Cookies from 'js-cookie';


// LOGIN USER
export async function login(emailOrUsername, password) {
    if (!emailOrUsername || !password) {
        return { success: false, message: 'username and password are required' };
    }
    
    const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
    });
    if(!res.ok) throw new Error('Failed to login, please check your username and password');
    
    const data = await res.json();
    Cookies.set("cms_user", JSON.stringify(data.data), { expires: 7 });
    return data;
}
