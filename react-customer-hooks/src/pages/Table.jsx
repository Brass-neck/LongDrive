import React from 'react'
import useRequest from '../hooks/useRequest'

export default function Table() {
  const [data, options, setoptions] = useRequest('http://localhost:8000/api/users')
  const { list, totalPage } = data

  return (
    <>
      <table className='table table-striped'>
        <thead>
          <tr>
            <td>ID</td>
            <td>NAME</td>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <nav>
        <ul className='pagination'>
          {new Array(totalPage).fill(0).map((e, i) => (
            <li key={i}>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setoptions({ ...options, currentPage: i + 1 })
                }}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
