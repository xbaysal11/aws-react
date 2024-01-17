import { Outlet, Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth'

const PrivateRoutes = () => (isLoggedIn() ? <Outlet /> : <Navigate to="/login" />)

export default PrivateRoutes
