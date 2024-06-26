import { useParams } from "react-router-dom" //get user id from the url
import { useSelector } from "react-redux"
import { selectUserById} from "./usersApiSlice"
import EditUserForm from "./EditUserForm"

const EditUser = () => {
  const {id} = useParams()

  const user = useSelector(state => selectUserById(state, id))

  const content = user ? <EditUserForm user={user} /> : <p>Loading.123..</p>


  return content
}

export default EditUser