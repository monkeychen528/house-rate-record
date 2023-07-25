import React, { useEffect, useState } from 'react'

export interface ICheckboxCommon {
    address?: string
    value: string | number
    name: string
    child: React.ReactNode
    ischecked?: boolean
}

const Checkbox = (props: ICheckboxCommon) => {
    const { address, value, name, child,ischecked } = props

    return (
        <>
            <label htmlFor={name}>{child}</label>
            <input type="checkbox" id={name} value={value} defaultChecked={ischecked}></input>
        </>
    )
}
export interface IMultiCheckbox {
    dataArr: ICheckboxCommon[]
    handleCheckbox?: (value: string) => void
    checkedData: Map<string, []>
}

const MultiCheckbox = ({ dataArr, handleCheckbox, checkedData }: IMultiCheckbox) => {
    // todo add state handle
    const [value, setValue] = useState<string[]>([...checkedData.keys()])

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hasValue = value.indexOf(e.target.value)
        const clone = value.slice()
        if (hasValue < 0) setValue((prev) => [...prev, e.target.value])
        else {
            clone.splice(hasValue, 1)
            setValue(clone)
        }
        if (typeof handleCheckbox === 'function') {
            handleCheckbox(e.target.value)
        }
    }
    useEffect(() => {
        if (checkedData.size > 0) {
            const checkedCity: string[] = []
            checkedData.forEach((value, key) => {
                checkedCity.push(key)
            })
            setValue(checkedCity)
        }
    }, [])

    return (
        <>
            <div className="checkboxGroup" onChangeCapture={changeValue}>
                {dataArr.map((val) =>
                    <div key={val.value}>
                      
                        <Checkbox name={val.name} value={val.value} child={val.child} ischecked={value.includes(val.value.toString())} />
                    </div>
                )}
            </div>
        </>
    )
}
export { Checkbox, MultiCheckbox }