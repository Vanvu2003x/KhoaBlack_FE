import api from "@/utils/axios";

const token = () => localStorage.getItem("token");

export async function getAllPackageByGameCode(gamecode) {
    const apiURL = `/api/toup-package/game/${gamecode}`;
    const data = await api.get(apiURL, {
        headers: {
            Authorization: `Bearer ${token()}`,
        },
    });
    return data.data;
}

export async function addPkg(formData) {
    const apiURL = `/api/toup-package`;
    const res = await api.post(apiURL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token()}`,
        },
    });
    return res.data;
}

export async function delPkg(id) {
    const apiURL = `/api/toup-package/${id}`;
    const res = await api.delete(apiURL, {
        headers: {
            Authorization: `Bearer ${token()}`,
        },
    });
    return res.data;
}

export async function searchPkg(id, keyword) {
    const apiURL = `/api/toup-package/search?keyword=${keyword}&game_id=${id}`;
    const res = await api.get(apiURL, {
        headers: {
            Authorization: `Bearer ${token()}`,
        },
    });
    return res.data;
}

export async function updatePkg(id, formData) {
    const apiURL = `api/toup-package?id=${id}`;
    const res = await api.patch(apiURL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token()}`,
        },
    });
    return res.data;
}
export async function changeStatus(id, newStatus) {
  const apiURL = `api/toup-package/status?id=${id}`;
  const res = await api.patch(apiURL, { newStatus }, {
    headers: {
      "Content-Type": "application/json", 
       Authorization: `Bearer ${token()}`,
    },
  });
  return res.data;
}
