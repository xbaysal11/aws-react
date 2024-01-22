import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification, Image, Modal, Button, Typography, Input, Upload } from 'antd'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  InboxOutlined,
} from '@ant-design/icons'

import { auth, API } from '@/utils'
import { urls } from '@/consts'
import axios from 'axios'

const { Dragger } = Upload

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ description: '', file: null })
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
    fetch(url)
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

  const fileToBlob = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(new Blob([event.target.result], { type: file.type }))
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const uploadImage = async () => {
    await API.post(
      urls.IMAGE_UPLOAD,
      {
        description: form.description,
        fileformat: form.file.type.split('/')[1],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(async (res) => {
      const blob = await fileToBlob(form.file.originFileObj)
      await axios
        .put(res.data.clientUrl, blob, {
          headers: { 'Content-Type': form.file.type },
        })
        .then(() => {
          notification.success({
            message: `File uploaded successfully!`,
          })
          handleCancel()
          setTimeout(() => {
            getData()
          }, 2000)
        })
    })
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    uploadImage()
  }

  const handleCancel = () => {
    setForm({ description: '', file: null })
    setIsModalOpen(false)
  }

  const dummyRequest = async ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  const props = {
    name: 'file',
    multiple: false,
    headers: {
      authorization: 'authorization-text',
    },
    listType: 'picture',
    maxCount: 1,
    accept: '.png, .jpeg, .jpg',
    customRequest: dummyRequest,
    required: true,
    onChange(info) {
      if (info.file.status === 'done') {
        setForm({ ...form, file: info.file })
      } else if (info.file.status === 'error') {
        notification.error({ message: `${info.file.name} file upload failed!` })
      }
    },
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <h3>user: {username}</h3>
          <Button danger onClick={onLogout} ghost>
            logout
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '50px' }}>
        <Button type="primary" onClick={showModal}>
          Upload image
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '50px',
          alignItems: 'flex-end',
        }}
      >
        {data?.map((i) => (
          <div key={i.fileid}>
            <Image width={350} src={i.link} />
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
        ))}
      </div>
      <Modal
        title="Upload image"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={form.file === null}
            onClick={handleOk}
          >
            Submit
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <Typography.Text>Description!</Typography.Text>
            <Input
              value={form.description}
              name="description"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              label="Description"
              placeholder="Input description"
            />
          </div>
          <div>
            <Typography.Text>Upload one file</Typography.Text>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Single image upload. Supported types: png, jpg, jpeg
              </p>
            </Dragger>
          </div>
        </div>
      </Modal>
    </div>
  )
}
