import api from "@/utils/axios";

export async function getAllUser(role) {
  const response = await api.get(`/api/user?role=${role}`);
  return response.data;
}

export async function changeRole(id, newRole) {
  const response = await api.put(
    `/api/user/${id}/role`,
    { role: newRole }
  );
  return response.data;
}

export async function changeBalance(id, amount, type) {

  const response = await api.put(
    `/api/user/balance`,
    {
      userId: id,
      amount: amount,
      type: type
    }
  );
  return response.data;
}

export async function getAllUserByKeyword(role, keyword) {
  const response = await api.get(`/api/user/search?role=${role}&keyword=${keyword}`);

  return response.data;
}
// ✅ Thêm mới: Lấy tổng tiêu & tổng nạp của user hiện tại
export async function getFinancialSummary() {
  const response = await api.get(`/api/order/financial-summary`);
  return response.data;
}