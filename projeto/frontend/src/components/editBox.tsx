function EditBox({ value, onEnter, onChange, onFocus, rotulo, style, styleInput}: { value: string, onEnter: () => void, onChange: (texto: string) => void, onFocus?: () => void, rotulo?: string, style?: string, styleInput?: string }) {

    return (
        <div className={`relative border border-white justify-center items-center h-[60px] w-[600px] rounded-xl ${style}`}>
            <input onFocus={onFocus} onKeyDown={(e) => {if(e.key === 'Enter'){e.currentTarget.blur(); onEnter()}}} value={value} onChange={(e) => onChange(e.target.value)} className={`bg-transparent w-full h-full text-white px-4 focus:outline-none ${styleInput}`} placeholder={rotulo} />
        </div>
    )
}

export default EditBox