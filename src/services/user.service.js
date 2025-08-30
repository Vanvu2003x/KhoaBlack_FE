import api from "@/utils/axios";

export async function getAllUser(role) {
  const token = localStorage.getItem("token");
  const response = await api.get(`/api/user?role=${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function changeRole(id, newRole) {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `/api/user/${id}/role`,
    { role: newRole },  
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function changeBalance(id, amount, type) {

  const token = localStorage.getItem("token");
  const response = await api.put(
    `/api/user/balance`,
    {
      userId: id,
      amount: amount,
      type:type
     },  
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getAllUserByKeyword(role,keyword) {
  const token = localStorage.getItem("token");
  const response = await api.get(`/api/user/search?role=${role}&keyword=${keyword}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
// ✅ Thêm mới: Lấy tổng tiêu & tổng nạp của user hiện tại
export async function getFinancialSummary() {
  const token = localStorage.getItem("token");
  const response = await api.get(`/api/order/financial-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}