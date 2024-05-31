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
        }),
        addNewUser: builder.mutation ({
            query: initialUserData => ({
                url: '/users',
                method : 'POST',
                body : {
                    ...initialUserData
                }
            }),
            invalidatesTags : [
                {type: 'User', id: "LIST"} //invalidates the list of users so the cache has to update the list
            ]
        }),
        updateUser : builder.mutation ({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags : (result, error, arg) => [{type: 'User', id: arg.id}]
        }),
        deleteUser : builder.mutation ({
            query: ({id}) => ({
                url: '/users',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags : (result, error, arg) => [{type: 'User', id: arg.id}]
        })
    })
})


export const {
    //rtk automatically creates hooks for us to use the query
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
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
