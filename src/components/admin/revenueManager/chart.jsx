"use client";
import { formatChartData } from "@/utils/formatDateForChart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function LineChartComponent({ rawData }) {
    const data = formatChartData(rawData);
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" padding={{ left: 40, right: 40 }} />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) =>
                            [`${value.toLocaleString()} VND`, name === "total_amount" ? "Doanh thu" : "Chi phí"]
                        }
                        labelFormatter={(label) => `Ngày ${label}`}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                        type="monotone"
                        dataKey="total_amount"
                        stroke="blue"
                        strokeWidth={4}
                        name="Doanh thu"
                    />
                    <Line
                        type="monotone"
                        dataKey="total_cost"
                        stroke="red"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="Chi phí"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
