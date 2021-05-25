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

export const getCategories = async () => {
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

export const getSections = async () => {
  return axiosClient.get('/section').then(successFunc).catch(failFunc)
}

export const createSection = async (newSection) => {
  return axiosClient.post('/section', newSection).then(successFunc).catch(failFunc)
}

export const updateSection = async (id, newSection) => {
  return axiosClient.patch(`/section/${id}`, newSection).then(successFunc).catch(failFunc)
}

export const removeSection = async (id) => {
  return axiosClient.delete(`/section/${id}`).then(successFunc).catch(failFunc)
}

export const getServiceAreas = async () => {
  return axiosClient.get('/service-area').then(successFunc).catch(failFunc)
}

export const createServiceArea = async (newServiceArea) => {
  return axiosClient.post('/service-area', newServiceArea).then(successFunc).catch(failFunc)
}

export const updateServiceArea = async (id, newServiceArea) => {
  return axiosClient.patch(`/service-area/${id}`, newServiceArea).then(successFunc).catch(failFunc)
}

export const removeServiceArea = async (id) => {
  return axiosClient.delete(`/service-area/${id}`).then(successFunc).catch(failFunc)
}
