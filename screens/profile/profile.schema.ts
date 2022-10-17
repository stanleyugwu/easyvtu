import { object } from "yup";
import signupSchema from '../signup/signup.schema';

// here we borrow needed schema fields (username, email, phone number) 
// from signup schema
const {confirmPassword,password,...neededFields} = signupSchema.fields

const profileSchema = object().shape({
    ...neededFields
})

export default profileSchema