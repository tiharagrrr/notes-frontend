import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"

const UsersList = () => {

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery(undefined, {
    pollingInterval : 60000, //ms aka 1 minute
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content 

  //can add some cute loading animation instead here
  if (isLoading) content = <p>Loading...</p> 

  if (isError) {
    content = <p className={isError ? 'errmsg' : 'offscreen'}>{error?.data?.message}</p>
  }

  if (isSuccess) {
    const {ids} = users
    const tableContent = ids?.length
      ? ids.map(userId => <User key={userId} userId={userId} />)
      : null

    content = (
      <table className="table table--users">
        <thead className="table_-thead">
          <tr>
            <th scope="col" className="table__th user__username">Username</th>
            <th scope="col" className="table__th user__roles">Roles</th>
            <th scope="col" className="table__th user__edit">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content

}

export default UsersList