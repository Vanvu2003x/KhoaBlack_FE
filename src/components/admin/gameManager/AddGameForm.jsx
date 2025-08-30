"use client"

import { createGame } from "@/services/games.service";
import { useState, useRef } from "react";
import { FiEdit, FiX, FiPlus } from "react-icons/fi";

export default function AddGameForm({ onCancel, setChange }) {
    const [img, setImg] = useState(null);
    const [imgUpload, setImgUpload] = useState(null)
    const [name, setName] = useState("");
    const [publisher, setPublisher] = useState("");
    const [gamecode, setGamecode] = useState("");
    const [servers, setServers] = useState([]);

    const inputFileRef = useRef(null);

    const handleChooseImage = () => {
        inputFileRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgUpload(file)
            setImg(URL.createObjectURL(file));
        }
    };

    const handleServerChange = (index, value) => {
        const updated = servers.slice();
        updated[index] = value;
        setServers(updated);
    };

    const handleAddServer = () => {
        setServers(servers.concat(""));
    };

    const handleRemoveServer = (index) => {
        const updated = servers.filter((_, i) => i !== index);
        setServers(updated);
    };

    const handleAddGame = async () => {
        if (!imgUpload || !name || !publisher || !gamecode) {
            alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
            return;
        }
        const info = {
            name,
            gamecode,
            publisher,
            sever: servers,
        }
        console.log("image:", imgUpload);
        console.log("info:", info);
        const formData = new FormData();
        formData.append("image", imgUpload)
        formData.append("info", JSON.stringify(info));

        const result = await createGame(formData);
        alert(result.message)
        onCancel()
        setChange(prev => !prev);

    };

    return (
        <div className="p-5 border rounded">
            <h2 className="text-xl font-semibold mb-4">Thêm game mới</h2>
            <div className="flex gap-6 items-start">
                {/* Ảnh game */}
                <div className="border p-3 w-48 flex flex-col items-center">
                    {img ? (
                        <img
                            src={img}
                            alt="Ảnh game"
                            className="w-40 h-40 object-contain border cursor-pointer"
                            onClick={handleChooseImage}
                            title="Click để thay ảnh"
                        />
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center gap-2 w-40 h-40 border-2 border-dashed cursor-pointer"
                            onClick={handleChooseImage}
                        >
                            <FiEdit size={24} />
                            <span className="text-gray-600 text-sm">Thêm ảnh</span>
                        </div>
                    )}
                    <input
                        ref={inputFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Thông tin game */}
                <div className="flex-1 space-y-4">
                    {[
                        { value: name, setValue: setName, placeholder: "Tên game" },
                        { value: publisher, setValue: setPublisher, placeholder: "Tên nhà phát hành" },
                        { value: gamecode, setValue: setGamecode, placeholder: "Game code" },
                    ].map(({ value, setValue, placeholder }, i) => (
                        <div key={i} className="flex items-center gap-2 border-b pb-1">
                            <FiEdit className="text-gray-500" />
                            <input
                                type="text"
                                placeholder={placeholder}
                                className="outline-none w-full py-1"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                    ))}

                    {/* Server inputs */}
                    <div className="space-y-2 pl-2">
                        {servers.map((server, index) => (
                            <div key={index} className="flex items-center gap-2 border-b pb-1">
                                <FiEdit className="text-gray-500" />
                                <input
                                    type="text"
                                    placeholder={`Server ${index + 1}`}
                                    className="outline-none w-full py-1"
                                    value={server}
                                    onChange={(e) => handleServerChange(index, e.target.value)}
                                />
                                <button
                                    onClick={() => handleRemoveServer(index)}
                                    className="text-red-500 hover:text-red-700"
                                    title="Xoá server"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddServer}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1 text-sm"
                            type="button"
                        >
                            <FiPlus />
                            Thêm server
                        </button>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleAddGame}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Thêm
                    </button>
                    <button
                        onClick={() => onCancel && onCancel()}
                        className="px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-500"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}
