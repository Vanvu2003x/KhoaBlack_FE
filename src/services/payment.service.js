import api from "@/utils/axios";

export const getUrlPayment = async (requestData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Chưa đăng nhập không thể nạp, vui lòng đăng nhập lại.");
  }

  try {
    const res = await api.post("/api/payment/createQR", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }, requestData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo payment link:", error);
    throw error; 
  }
};
// Hủy đơn nạp
export const cancelPaymentAPI = async (id) => {
  if (!id) throw new Error("Thiếu ID");
  const token = localStorage.getItem("token");

  const urlAPI = `/api/payment/cancel?id=${id}`;

  const result = await api.patch(
    urlAPI,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return result.data;
};