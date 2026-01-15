"use client"
import { updateGame } from "@/services/games.service"
import { useRef, useState } from "react"
import { FiEdit } from "react-icons/fi"
import { useToast } from "@/components/ui/Toast"

export default function EditGameForm({ game, onCancel }) {
    const toast = useToast();
    const [imgurl, setImgurl] = useState(`http://localhost:5000${game.thumbnail}`)
    const [img, setImg] = useState(null)
    const [name, setName] = useState(game.name)
    const [publisher, setPublisher] = useState(game.publisher)
    const [sever, setSever] = useState(game.sever)

    const fileRef = useRef(null)

    const handleImageClick = () => {
        fileRef.current?.click()
    }

    const handleChangeImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImg(file)
            setImgurl(URL.createObjectURL(file)) // Preview ảnh mới
        }
    }

    const HandlerSave = async () => {
        const formData = new FormData();
        const info = {
            name,
            publisher,
            sever,
        };

        formData.append("info", JSON.stringify(info));
        if (img) {
            formData.append("file", img);
        }

        try {
            await updateGame(game.id, formData);
            toast.success("✅ Cập nhật game thành công!");
            onCancel()
            window.location.reload()
        } catch (err) {
            toast.error("❌ Lỗi khi cập nhật game!");
        }

    };

    return (
        <div className="border p-4 bg-white shadow-sm rounded-lg flex items-start gap-6">
            {/* Ảnh thumbnail */}
            <div className="relative w-20 h-20 cursor-pointer">
                <img
                    src={imgurl}
                    alt="ảnh tạm"
                    className="w-full h-full object-cover border cursor-pointer"
                    title="Click để thay ảnh"
                    onClick={handleImageClick}
                />
                <div
                    onClick={handleImageClick}
                    className="w-full h-full text-4xl bg-gray-300 absolute z-20 top-0 left-0 opacity-70 flex items-center justify-center"
                >
                    +
                </div>
                <input
                    type="file"
                    ref={fileRef}
                    onChange={handleChangeImage}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Tên và nhà phát hành */}
            <div className="flex flex-col flex-grow gap-2">
                <div>
                    <div className="text-base font-semibold p-1 text-gray-800 flex w-fit items-center border-b-2 gap-2">
                        <FiEdit />
                        <input
                            className="outline-0 border-0"
                            type="text"
                            placeholder="Nhập tên game"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="text-sm p-1 text-gray-500 flex items-center gap-2 border-b-2 w-fit">
                        <FiEdit />
                        <input
                            className="outline-0 border-0"
                            type="text"
                            placeholder="Nhập nhà phát hành"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                        />
                    </div>
                </div>

                {/* Danh sách server */}
                <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium text-gray-700">Danh sách server</label>
                    {sever.map((sv, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={sv}
                                onChange={(e) => {
                                    const updated = [...sever]
                                    updated[index] = e.target.value
                                    setSever(updated)
                                }}
                                className="px-2 py-1 border w-full"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = sever.filter((_, i) => i !== index)
                                    setSever(updated)
                                }}
                                className="text-sm px-2 bg-red-200 hover:bg-red-300 "
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setSever([...sever, ""])}
                        className="text-sm px-3 py-1 bg-blue-200 hover:bg-blue-300  w-fit"
                    >
                        + Thêm server
                    </button>
                </div>
            </div>

            {/* Hành động */}
            <div className="flex flex-col gap-2 min-w-[100px]">
                <button
                    onClick={HandlerSave}
                    className="px-3 py-1 text-sm bg-green-300 border hover:bg-green-400 transition">
                    Lưu
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 text-white bg-gray-300 py-1 text-sm border hover:bg-gray-400 transition"
                >
                    Thoát
                </button>
            </div>
        </div>
    )
}
