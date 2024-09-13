
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

export {
    apiRoom,
    apiCustomer,
    apiRental,
    apiMemberOfRental,
}