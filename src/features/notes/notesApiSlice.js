import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit" ;
import { apiSlice } from "../../app/api/apiSlice";  
// import { type } from "@testing-library/note-event/dist/type";

const notesAdapter = createEntityAdapter({
    sortComparer: (a,b) => (a.completed === b.completed) ? 0 : 
    a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => './notes',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5, //ideally its 60s when deployed
            transformResponse: responseData => {
                const loadedNotes = responseData.map (note => {
                    note.id = note._id
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        {type: 'note', id: 'LIST'},
                        ...result.ids.map(id => ({type: 'note', id}))
                    ]
                } else return [{type: 'note', id: 'LIST'}]
            }
        }),
        addNewNote: builder.mutation ({
            query: initialNote => ({
                url: '/notes',
                method : 'POST',
                body : {
                    ...initialNote
                }
            }),
            invalidatesTags : [
                {type: 'Note', id: "LIST"} //so the cache has to update the list
            ]
        }),
        updateNote: builder.mutation ({
            query: initialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote,
                }
            }), 
            invalidatesTags : (result, error, arg) => [{type: 'Note', id: arg.id}]    
        
        }),
        deleteNote: builder.mutation ({
            query: ({id}) => ({
                url: '/notes',
                method: 'DELETE',
                body: {id}
            }),
            invalidatesTags : (result, error, arg) => [{type: 'Note', id: arg.id}]
        })
    })
})


export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice;


//returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

//creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data //normalized state object with ids & entities
)

//getSelectors creates these selectors and we name them with aliases using destructuring

export const {
    selectAll : selectAllNotes,
    selectById: selectNoteById,
    selectIds : selectNoteIds
    //pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)
