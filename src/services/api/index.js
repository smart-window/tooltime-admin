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

export const getOrders = async () => {
  return axiosClient.get('/order').then(successFunc).catch(failFunc)
}

export const createOrder = async (newOrder) => {
  return axiosClient.post('/order', newOrder).then(successFunc).catch(failFunc)
}

export const updateOrder = async (id, newOrder) => {
  return axiosClient.patch(`/order/${id}`, newOrder).then(successFunc).catch(failFunc)
}

export const removeOrder = async (id) => {
  return axiosClient.delete(`/order/${id}`).then(successFunc).catch(failFunc)
}

export const getProducts = async () => {
  return axiosClient.get('/product').then(successFunc).catch(failFunc)
}

export const getCustomers = async () => {
  return axiosClient.get('/customer').then(successFunc).catch(failFunc)
}

export const createCustomer = async (newCustomer) => {
  return axiosClient.post('/customer', newCustomer).then(successFunc).catch(failFunc)
}

export const updateCustomer = async (id, newCustomer) => {
  return axiosClient.patch(`/customer/${id}`, newCustomer).then(successFunc).catch(failFunc)
}

export const removeCustomer = async (id) => {
  return axiosClient.delete(`/customer/${id}`).then(successFunc).catch(failFunc)
}

export const getCategorys = async () => {
  return axiosClient.get('/category').then(successFunc).catch(failFunc)
}

export const createCategory = async (newCategory) => {
  return axiosClient.post('/category', newCategory).then(successFunc).catch(failFunc)
}

export const updateCategory = async (id, newCategory) => {
  return axiosClient.patch(`/category/${id}`, newCategory).then(successFunc).catch(failFunc)
}

export const removeCategory = async (id) => {
  return axiosClient.delete(`/category/${id}`).then(successFunc).catch(failFunc)
}
