import axiosClient from '../axios'

const successFunc = (response) => {
  return response.data
}

const failFunc = (err) => {
  console.log(err.message)
  throw new Error(err.message)
}

export const getLocations = async () => {
  return axiosClient.get('/location').then(successFunc).catch(failFunc)
}
