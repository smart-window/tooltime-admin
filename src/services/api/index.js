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

export const createLocation = async (newLocation) => {
  return axiosClient.post('/location', newLocation).then(successFunc).catch(failFunc)
}

export const updateLocation = async (id, newLocation) => {
  return axiosClient.patch(`/location/${id}`, newLocation).then(successFunc).catch(failFunc)
}

export const removeLocation = async (id) => {
  return axiosClient.delete(`/location/${id}`).then(successFunc).catch(failFunc)
}
