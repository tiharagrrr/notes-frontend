import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit" ;
import { apiSlice } from "../../app/api/apiSlice";  
// import { type } from "@testing-library/user-event/dist/type";

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => './users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5, //ideally its 60s when deployed
            transformResponse: responseData => {
                const loadedUsers = responseData.map (user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'User', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'User', id}))
                    ]
                } else return [{type: 'User', id: 'LIST'}]
            }
        })
    })
})


export const {
    useGetUsersQuery
} = usersApiSlice;


//returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

//creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data //normalized state object with ids & entities
)

//getSelectors creates these selectors and we name them with aliases using destructuring

export const {
    selectAll : selectAllUsers,
    selectById: selectUserById,
    selectIds : selectUserIds
    //pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
