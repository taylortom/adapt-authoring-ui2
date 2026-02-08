import React from 'react'

const CustomTextWidget = (props) => {
  return (
    <input
      type='text'
      value={props.value || ''}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
    />
  )
}

export default CustomTextWidget
