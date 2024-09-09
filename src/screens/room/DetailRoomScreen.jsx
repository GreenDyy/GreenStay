import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent, HeaderComponent, SectionComponent, TextComponent } from '../../components'
import { apiRoom } from '../../apis/apiDTHome'

const initRoom = {
    roomId: "",
    roomName: "",
    roomPrice: "",
    photoUrl: "",
    isAvailable: true,
}

const DetailRoomScreen = ({ route }) => {
    const { roomId } = route.params
    console.log('id nè', roomId)
    const [dataRoom, setDataRoom] = useState(initRoom)

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiRoom(`/${roomId}`)
            setDataRoom(data)
        }
        fetchData()
    }, [])

    return (
        <ContainerComponent>
            <HeaderComponent text={dataRoom.roomName} isBack />
            <SectionComponent>
                <TextComponent text={dataRoom?.roomPrice} />
            </SectionComponent>
        </ContainerComponent>
    )
}

export default DetailRoomScreen