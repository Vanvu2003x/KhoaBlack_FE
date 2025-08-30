import api from "@/utils/axios";

const token = () => localStorage.getItem("token");

// Lấy danh sách log
export const getListLogs = async (page) => {
  let urlAPI = `/api/toup-wallet-log`;
  if (page) urlAPI += `?page=${page}`;

  const result = await api.get(urlAPI, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return result.data;
};

// Lấy log Đang Chờ
export const getListLogsPending = async (page) => {
  let urlAPI = `/api/toup-wallet-log/pending`;
  if (page) urlAPI += `?page=${page}`;

  const result = await api.get(urlAPI, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return result.data;
};

// Nạp tiền thủ công
export const manualChargeBalance = async (id, newStatus) => {
  const urlAPI = `/api/toup-wallet-log/update?id=${id}`;
  const result = await api.patch(
    urlAPI,
    { newStatus },
    {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    }
  );

  return result.data;
};

// 🔥 Lấy tổng tiền đã nạp, tổng tháng này, và từng ngày 30 ngày gần nhất
export const getTopupStats = async (user_id = null) => {
  let urlAPI = `/api/toup-wallet-log/getTongtien`;
  if (user_id) urlAPI += `?user_id=${user_id}`;

  const result = await api.get(urlAPI, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return result.data;
};

// 🔥 Lấy tổng tiền đã nạp trong khoảng thời gian
export const getTopupTotalInRange = async ({ from, to, user_id = null }) => {
  if (!from || !to) throw new Error("Missing from or to date");

  let urlAPI = `/api/wallet/tong-tien-trong-khoang?from=${from}&to=${to}`;
  if (user_id) urlAPI += `&user_id=${user_id}`;

  const result = await api.get(urlAPI, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return result.data;
};

export const getLogByUser = async(page=1)=>{
  let urlAPI = `/api/toup-wallet-log/user?page=${page}`;

  const result = await api.get(urlAPI, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });
  return result.data
}