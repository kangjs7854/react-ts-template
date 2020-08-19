/*
 * @Date: 2020-08-19 10:57:26
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 18:35:07
 * @FilePath: \react-ts-template\src\app.tsx
//  */
import React from 'react'
import './app.scss'
import Header from '@/components/Header'

interface IProps {
  name: string
  age: number
}

function App(props: IProps) {
  const { name, age,sex } = props
  return (
    <div className='app'>
      <Header />
      <span>{`Hello! ssI'm ${name},sssssss ${age} years old.`}</span>
    </div>
  )
}

export default App

// const root = document.querySelector('#root')
// root.innerHTML = 'hello, webpack!'