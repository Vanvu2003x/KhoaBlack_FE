import api from "@/utils/axios";

// Lấy tất cả orders
export async function getAllOrder() {
  const token = localStorage.getItem("token");
  const res = await api.get(`/api/accOrder`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Hủy đơn
export async function cancelOrder(orderId) {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/accOrder/${orderId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Gửi tài khoản cho user
export async function sendAcc(orderId, accInfo) {
  const token = localStorage.getItem("token");
  const res = await api.put(`/api/accOrder/${orderId}/send`, accInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
export async function BuyAcc(order_info) {
  const token = localStorage.getItem("token");
  const res = await api.post(`/api/accOrder/`, order_info, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getMyOrder() {
  const token = localStorage.getItem("token");
 const res = await api.get(`/api/accOrder/my-orders`, {
  headers: { Authorization: `Bearer ${token}` },
});

  return res.data;
}

