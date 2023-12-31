import React, { useState } from "react"

interface IvalueArr {
    value: string | number
    key: string | number
    name: string | number
}

interface ISelect {
    value: string | string[] | IvalueArr[]
    defaultSelect?: string
    handleCallback?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const DropDown: React.FC<ISelect> = ({ value, defaultSelect, handleCallback }) => {//如果要寫成元件，這邊資料可能要重新整理一次
    const [selected, setSelected] = useState(defaultSelect)
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value)
        if (typeof handleCallback === 'function') handleCallback(e)
    }
    return (
        <>
            <select value={selected} onChange={handleChange}>

                {typeof value === 'string' ? <option value={value} key={value}>{value}</option> : null}
                {value instanceof Array ? value.map((val: any) => {
                    return <option value={val?.value || val} key={val?.key || val}>{val?.name || val}</option>

                }) : null}
            </select>
        </>
    )
}


const Selects: React.FC<ISelect> = ({ value }) => {
    return (
        <>
            {typeof value === 'string' ? <option value={value} key={value}>{value}</option> : value.map((val: any) => {
                return <option value={val.value} key={val.value}>{val.value}</option>

            })}
        </>
    )
}

export { DropDown }