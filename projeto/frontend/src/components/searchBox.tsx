function SearchBox({ value, onEnter, onChange }: { value: string, onEnter: () => void, onChange: (texto: string) => void }) {

    return (
        <div className="relative h-[60px] w-[600px] rounded-xl border border-white">
            <input onKeyDown={(e) => {if(e.key === 'Enter'){onEnter()}}} value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent w-full h-full text-white px-4 focus:outline-none" placeholder="Buscar..." />
        </div>
    )
}

export default SearchBox