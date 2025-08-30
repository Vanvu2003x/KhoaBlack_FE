import api from "@/utils/axios";

//Hàm lấy order
export const getAllOrder = async (page) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`/api/order?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// hamf laysa oder theo status
export const getAllOrderByStatus = async (status, page = 1) => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    `/api/order/by-status?status=${status}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// Hàm lấy thống kê chi phí (có xác thực bằng JWT)
export const getOrderStatistics = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await api.get("/api/order/stats/cost", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy thống kê đơn hàng:", err);
    throw err;
  }
};

//Hàm thay đổi status

export const changeStatus = async (id, newStatus) => {
  const token = localStorage.getItem("token");

  const res = await api.patch(
    `/api/order/${id}/status`,
    {
      status: newStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const searchOrder = async (keyword) => {
  const token = localStorage.getItem("token");
  const res = await api.get(
    `/api/order/search?keyword=${keyword}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const createOrder = async (data) => {
  const token = localStorage.getItem("token");
  const apiurl = "/api/order/";
  
  const res = await api.post(apiurl, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const CancelOrder = async (id) => {
  const token = localStorage.getItem("token");
  const apiurl = `/api/order/${id}/cancel`;
  
  const res = await api.patch(apiurl,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getOrderByUserID = async (page=1) => {
  const token = localStorage.getItem("token");
  const apiurl = `/api/order/user?page=${page}`;
  
  const res = await api.get(apiurl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export const updateOrderAccountInfo = async (id, account_info) => {
  const token = localStorage.getItem("token");
  const apiurl = `/api/order/${id}/account`;

  const res = await api.patch(apiurl, { account_info }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getOrdersByUserNap = async (status) => {
  const token = localStorage.getItem("token");
  let apiurl = "/api/order/mynap";

  // Nếu có status thì thêm query param
  if (status) {
    apiurl += `?status=${status}`;
  }

  const res = await api.get(apiurl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
// Nhận đơn (chuyển trạng thái -> processing)
export const acceptOrder = async (id) => {
  const token = localStorage.getItem("token");
  const apiurl = `/api/order/${id}/accept`;

  const res = await api.patch(apiurl, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
// Hoàn thành đơn (status = success)
export const completeOrder = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.patch(
    `/api/order/${id}/complete`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Hủy đơn + hoàn tiền (status = cancel)
export const cancelOrder1 = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.patch(
    `/api/order/${id}/cancel`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
// Lấy summary: tổng pending + stats của user_id_nap
export const getOrderSummary = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await api.get("/api/order/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi lấy summary đơn hàng:", err);
    throw err;
  }
};
