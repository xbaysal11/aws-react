import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification, Image } from 'antd'
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons'


import { auth, API } from '@/utils'
import { urls } from '@/consts'
import axios from 'axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    await API.get(urls.IMAGE_GET_ALL, {
      params: { username: auth.getUser().username },
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        setData(res.data.result)
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('err: ', err)
      })
  }
  const username = auth.getUser().username
  const onLogout = () => {
    notification.success({ message: 'Bye Bye! 👋' })
    auth.doLogout()
    navigate('/login')
  }

  const downloadImage = (url) => {
    axios
      .get(url, { AllowedOrigins: '*' })
      .then((response) => response.blob())
      .then((blob) => {
        let blobUrl = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.download = url.split('/').pop().split('?')[0]
        a.href = blobUrl
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }
  const deleteImage = async (fileid) => {
    await API.delete(urls.IMAGE_DELETE, {
      params: { fileid },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      setData(data.filter((i) => i.fileid !== fileid))
    })
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <h3>user: {username}</h3>
      <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
        {data?.map((i) => (
          <div key={i.fileid}>
            <Image width={400} src={i.link} />
            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
                justifyContent: 'flex-end',
              }}
            >
              <p>{i.description}</p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginTop: '20px',
                justifyContent: 'flex-end',
              }}
            >
              <CloudDownloadOutlined
                key="download"
                onClick={() => downloadImage(i.link, i.fileid)}
              />
              <DeleteOutlined key="delete" onClick={() => deleteImage(i.fileid)} />
            </div>
          </div>
          // <Card
          //   key={i.fileid}
          //   style={{ width: 300 }}
          //   cover={<img alt="example" src={i.link} />}
          //   actions={[
          //     <CloudDownloadOutlined
          //       key="download"
          //       onClick={() => downloadImage(i.link, i.fileid)}
          //     />,

          //     <DeleteOutlined key="delete" onClick={() => deleteImage(i.fileid)} />,
          //   ]}
          // >
          //   <Meta description={i.description} />
          // </Card>
        ))}
      </div>
      <div style={{ marginTop: '50px' }}>
        <button onClick={onLogout}>logout</button>
      </div>
    </div>
  )
}
