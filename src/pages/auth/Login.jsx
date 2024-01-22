import { Form, Input, Button, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { urls } from '@/consts'
import { API, auth } from '@/utils'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  const onLogin = async (values) => {
    await API.post(
      urls.LOGIN,
      JSON.stringify({ username: values.username, password: values.password }),
    )
      .then((res) => {
        notification.success({ message: 'Welcome! 😊' })

        auth.doLogin({ username: values.username, token: res.data.Token })
        navigate('/dashboard')
      })
      .catch((err) => {
        if (err.response?.status === 401) {
        notification.error({ message: 'Wrong username or password! 😓' })

        } else {
        notification.error({ message: 'Login failed! 😓' })
        }
      })
  }

  return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onLogin}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
  )
}
