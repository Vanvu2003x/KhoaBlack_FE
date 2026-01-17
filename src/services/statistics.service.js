import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/statistics/leaderboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return null;
    }
};

export const getBestSellers = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/statistics/best-sellers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching best sellers:", error);
        return null;
    }
};
