import React, { useEffect, useState } from 'react'

export interface ICheckboxCommon {
    address?: string
    value: string | number
    name: string
    child: React.ReactNode
}

const Checkbox = (props: ICheckboxCommon) => {
    const { address, value, name, child } = props
    return (
        <>
            <label htmlFor={name}>{child}</label>
            <input type="checkbox" id={name} value={value}></input>
        </>
    )
}
export interface IMultiCheckbox {
    dataArr: ICheckboxCommon[]
    handleCheckbox?: (value: string) => void
}

const MultiCheckbox = ({ dataArr, handleCheckbox }: IMultiCheckbox) => {
    // todo add state handle
    const [value, setValue] = useState<string[]>([])

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hasValue = value.indexOf(e.target.value)
        const clone = value.slice()
        if (hasValue < 0) setValue((prev) => [...prev, e.target.value])
        else setValue(clone.splice(hasValue, 1))
        if (typeof handleCheckbox === 'function') {
            handleCheckbox(e.target.value)
        }
    }
    return (
        <>
            <div className="checkboxGroup" onChangeCapture={changeValue}>
                {dataArr.map((val) =>
                    <div key={val.value}>
                        <Checkbox name={val.name} value={val.value} child={val.child} />
                    </div>
                )}
            </div>
        </>
    )
}
export { Checkbox, MultiCheckbox }