import React, { useState } from "react"

interface ISelect {
    value: string | string[] | ObjectConstructor[]
    defaultSelect?: string
    handleCallback?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const DropDown: React.FC<ISelect> = ({ value, defaultSelect, handleCallback }) => {//如果要寫成元件，這邊資料可能要重新整理一次
    const [selected, setSelected] = useState(defaultSelect)
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value)
        console.log('fireddd')
        if (typeof handleCallback === 'function') handleCallback(e)
    }
    return (
        <>
            <select value={selected} onChange={handleChange}>

                {typeof value === 'string' ? <option value={value}>{value}</option> : null}
                {value instanceof Array ? value.map((val: any) => {
                    return <option value={val} key={val}>{val}</option>

                }) : null}
            </select>
        </>
    )
}


const Selects: React.FC<ISelect> = ({ value }) => {
    return (
        <>
            {typeof value === 'string' ? <option value={value}>{value}</option> : value.map((val: any) => {
                return <option value={val.value}>{val.value}</option>

            })}
        </>
    )
}

export { DropDown }