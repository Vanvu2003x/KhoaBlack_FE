export default function Stat({ title, info, className, onClick }) {
    return (
        <>
            <div onClick={onClick} className={`${className} cursor-pointer font-bold border-3 w-full bg-white md:w-[300px] h-36 my-2 rounded p-4`}>
                <div className="text-xl font-semibold">{title}</div>
                <div className="text-4xl text-center mt-2">{info}</div>
            </div>
        </>
    )
}