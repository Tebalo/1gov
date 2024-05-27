'use server'
import axios from 'axios';
import {SignJWT, jwtVerify} from 'jose';
import {cookies} from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation'
import { DeTokenizeUrl, authUrl, secretKey, validateUrl } from '../lib/store';
import { revalidatePath } from 'next/cache';
/**
 * An authentication context or service that handles user authentication and 
 * role-based authorization
*/

const key = new TextEncoder().encode(secretKey);


export async function encrypt(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("3600 sec from now")
      .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  }
  export async function authenticate(_currentState: unknown, formData: FormData) {
    try {
        const res = await login(formData)
    } catch (error) {
      if (error) {
        switch (error) {
          case 'CredentialsSignin':
            return 'Invalid credentials.'
          default:
            return 'Something went wrong.'
        }
      }
      throw error
    }
    return redirect('/trls/home');
  }
export async function experiment(formData: FormData){
  const res = await login(formData)

  return res
  // if(res?.ok){
  //   redirect('/trls/home')
  // }else{
  //   return res?.json()
  // }
}
export async function login(formData: FormData) {
    // Verify credentials && get the user
  
    //const user = { email: formData.get("email"), name: "John" };
    const payload = {
        username: formData.get('username'),
        password: formData.get('password')
    }
    //console.log(payload)
    try{
        const res = await fetch(`${authUrl}`,{
            method: 'POST',
            cache:'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({...payload}),
        })
        return res.json()
    } catch(error){
      throw error
    }
  }
  export async function validateOTP(username: string, otp: string) {
    // Verify credentials && get the user
  
    //const user = { email: formData.get("email"), name: "John" };
    const payload = {
        username: username,
        otp: otp
    }
    try{
        const res = await fetch(`${validateUrl}`,{
            method: 'POST',
            cache:'no-cache',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({...payload}),
        })
        return res.json()
    } catch(error){
      throw error
    }
  }
export async function DeTokenize(access_token: string){
  console.log(DeTokenizeUrl,access_token)
  try{
    const res = await fetch(`${DeTokenizeUrl}${access_token}`, 
      {
        method: 'POST',
        cache:'no-cache',
        headers: {
          'Content-Type': 'application/json'
      },
      }
    )

    if(res.ok){
      const user = await res.json()
      // Create the session
      const expires = new Date(Date.now() + 3600 * 1000);
      const session = await encrypt({ user, expires });
      // Save the session in a cookie
      cookies().set("session", session, { expires, httpOnly: true });
      redirect('/trls/home')
      // return res.json()
    } else {
      return res.json();
    }
  } catch(error){
    throw error
  }
}
export async function logout() {
    // Destroy the session
    revalidatePath('/trls/home')
    cookies().set("session", "", { expires: new Date(0) });
}
  
export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;
  
    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 3600 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    });
    return res;
  }

export const register = async (username:string, password:string, roles:[]) => {
    try{
        const response = await axios.post(`${authUrl}/register/`, { username, password, roles });
        //setAuthCookie(response.data);
        return response.data;
    } catch(error){
        throw error;
    }
}

// export const login = async (username:string,password:string) => {
//     try{
//         const response = await axios.post(`${authUrl}/login/`, { username, password });
//         return response.data;
//     } catch(error){
//         throw error;
//     }
// }

const setAuthCookie = (authData: any) => {
    const {access, refresh} = authData;
}

/**
 * Authorized API request from the app to the backend app, include the JWT
 * token in the Authorization header
*/
const authAxios = axios.create({
    baseURL: authUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
})