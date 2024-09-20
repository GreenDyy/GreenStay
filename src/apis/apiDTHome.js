
import axiosClient from "./axiosClient"

const apiCustomer = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Customer${url}`, {
        method: method ?? 'get',
        data
    })
}

const apiRoom = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Room${url}`, {
        method: method ?? 'get',
        data,
    })
}

const apiRental = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Rental${url}`, {
        method: method ?? 'get',
        data
    })
}

const apiMemberOfRental = async (url, data = null, method = 'get') => {
    return await axiosClient(`/MemberOfRental${url}`, {
        method: method ?? 'get',
        data,
    })
}

const apiWater = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Water${url}`, {
        method: method ?? 'get',
        data,
    })
}

const apiTrash = async (url, data = null, method = 'get') => {
    return await axiosClient(`/apiTrash${url}`, {
        method: method ?? 'get',
        data,
    })
}

const apiPower = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Power${url}`, {
        method: method ?? 'get',
        data,
    })
}

const apiInvoice = async (url, data = null, method = 'get') => {
    return await axiosClient(`/Invoice${url}`, {
        method: method ?? 'get',
        data,
    })
}

export {
    apiRoom,
    apiCustomer,
    apiRental,
    apiMemberOfRental,
    apiInvoice,
    apiPower,
    apiTrash,
    apiWater,
}