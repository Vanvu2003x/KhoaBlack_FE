import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function ImportantNotes({ rechargeMethod }) {
    return (
        <div className="bg-[#151021] rounded-2xl border border-white/5 p-5">
            <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-3 text-sm">
                <FiAlertCircle /> Lưu ý quan trọng
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 list-disc pl-4">
                <li>
                    Thời gian xử lý đơn hàng{" "}
                    {rechargeMethod === "login"
                        ? "sớm nhất có thể"
                        : "từ 5 - 15 phút"}
                    .
                </li>
                {rechargeMethod === "login" && (
                    <li>
                        Trong thời gian nạp vui lòng <b>không vào game</b> để tránh tình trạng lỗi đơn hàng.
                    </li>
                )}
                <li>Khi có thông tin đơn hàng sẽ được gửi thông báo về Email.</li>
                <li>
                    Vui lòng kiểm tra kỹ <b>UID và Server</b> trước khi thanh toán. Sai sót có thể dẫn đến mất tiền.
                </li>
                {rechargeMethod !== "login" && (
                    <li>
                        Nếu quá 30 phút chưa nhận được vật phẩm, vui lòng liên hệ{" "}
                        <span className="text-blue-400 font-bold cursor-pointer">
                            CSKH
                        </span>
                        .
                    </li>
                )}
            </ul>
        </div>
    );
}
