// api/auth.ts
import { Config } from "react-native-config";
import { getToken } from "../helpers/keychain";
import {
  SignInUserInfo,
  GetMeApiV1AuthMeGetResponse,
  SignupUserApiV1AuthSignupPostResponse,
  UserInfo,
} from "../dto/auth/types.gen";

const API_AUTH_URL = Config && Config.API_AUTH_URL || "http://localhost:8000";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/signin/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: SignInUserInfo = await response.json();

    return { data, error: false };
  } catch (error) {
    console.error("Login error:", error);
    return { data: null, error: true };
  }
};


export const register = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: SignupUserApiV1AuthSignupPostResponse = await response.json();

    return { data, error: false };
  } catch (error) {
    console.error("Register error:", error);
    return { data: null, error: true };
  }
};

export const getMe = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const data: GetMeApiV1AuthMeGetResponse = await response.json();
    return { data, error: false };
  } catch (error) {
    console.error("getMe error:", error);
    return { data: null, error: true };
  }
};

export const changeMe = async (userInfo: Partial<UserInfo>) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/me/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const data: GetMeApiV1AuthMeGetResponse = await response.json();
    return { data, error: false };
  } catch (error) {
    console.error("getMe error:", error);
    return { data: null, error: true };
  }
};

export const isEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${API_AUTH_URL}/api/v1/users/is-user/?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const result = await response.json();
    return { data: Boolean(result?.is_user), error: false };
  } catch (error) {
    console.error("isEmail error:", error);
    return { data: false, error: true };
  }
};


export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/forgot-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data: SignInUserInfo = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password error:", error);
    return { data: null, error: true };
  }
}

export const forgotPasswordConfirm = async (email: string, code: string) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/forgot-password-confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}

export const forgotPasswordChange = async (email: string, code: string, newPassword: string) => {
  try {
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/forgot-password-change/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}

export const changePassword = async (newPassword: string) => {
  try {

    const token = await getToken();
    if (!token) throw new Error("No token");
    
    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/change-password/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_password: newPassword }),
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}




export const sendConfirmationCode = async (email: string) => {
  try {

    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/send-confirmation-code/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}

export const confirmEmail = async (email: string, code: string) => {
  try {

    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/confirm-email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code: code.toString() }),
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}



export const deleteAccount = async () => {
  try {

    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await fetch(`${API_AUTH_URL}/api/v1/auth/delete-account/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    const data: {success: boolean} = await response.json();

    return { data, error: false };
  }
  catch (error) {
    console.error("Forgot password confirm error:", error);
    return { data: null, error: true };
  }
}



export const getTermsUrl = (url: string) => {
  return `${API_AUTH_URL}/api/v1/terms/${url}/`;
}



