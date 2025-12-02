import { useParams, useNavigate, useLocation, type Params } from 'react-router-dom'

export default function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const navigateTo = (path: string) => navigate(path)
  const replaceRoute = (path: string) => navigate(path, { replace: true })
  const back = () => navigate(-1)
  const reloadPage = () => navigate(0)

  const getCurrentPath = () => location.pathname
  const getQueryParams = <T>() => {
    const searchParams = new URLSearchParams(location.search)
    return Object.fromEntries(searchParams.entries()) as T
  }

  const getParams = <T extends Params<string>>() =>
    Object.fromEntries(Object.entries(params).filter(([_, value]) => Boolean(value))) as T

  const getAsPath = () => location.pathname + location.search

  return {
    navigateTo,
    replaceRoute,
    back,
    reloadPage,
    getParams,
    getCurrentPath,
    getQueryParams,
    getAsPath,
  }
}
