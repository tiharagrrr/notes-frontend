import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

import React from 'react'

const User = ({userId}) => {
    const user = useSelector(state => getUserById(state, userId))

    const navigate = useNavigate()

    if (user){
        const handleEdit = () => navigate('/dash/users/${userId')

        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        const cellStatus = user.active ? '' : 'table__cell--inactive'

        return (
            <tr className="table__row user">
               
                
            </tr>
        )

    } else return null

}

export default User