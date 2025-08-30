import api from "@/utils/axios";

export const Login = async (email,password) => {
    const res = await api.post("api/users/login", {
        email: email,
        password: password
    });
    return res.data;
};

export const CheckMail = async (email) => {
    const res = await api.post("api/users/checkmail", {
        email: email
    });
    return res.data;
};

export const Register = async (name, email, password, otp) => {
    const res = await api.post("/api/users/register", {
        name:name,
        email,
        password,
        otp
    });
    return res.data;
};

export const getRole = async (token) => {
    const res = await api.post(
        "api/users/checkRole",
        {}, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export const getInfo = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/users", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// Gửi OTP để lấy lại mật khẩu
export const ForgotPassword = async (email) => {
    const res = await api.post("/api/users/forgot-password", { email });
    return res.data;
};

// Đổi mật khẩu bằng OTP
export const ResetPassword = async (email, otp, newPassword) => {
    const res = await api.post("/api/users/reset-password", {
        email,
        otp,
        newPassword,
    });
    return res.data;
};

// ================== ADMIN OTP XÁC THỰC ==================

// Gửi OTP đến email admin (dựa trên token)
export const sendAdminOTP = async () => {
    const token = localStorage.getItem("token");
    const res = await api.post("/api/user/balance/send-otp", {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// Xác thực OTP admin
export const verifyAdminOTP = async (otp) => {
    const token = localStorage.getItem("token");
    const res = await api.post("/api/user/balance/verify-otp", {
        otp
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// Cộng / trừ tiền user
export const updateBalance = async (user_id, amount) => {
    const token = localStorage.getItem("token");
    const res = await api.put("/api/user/balance", {
        user_id,
        amount
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
