import {object, ref, string} from 'yup';

const signupSchema = object().shape({
  username: string().required('Supply username'),
  phoneNumber: string()
    .matches(/^\d{11,11}$/, {
      message: 'Supply valid phone number',
    })
    .required('Supply phone number'),
  email: string()
    .email('Supply valid e-mail address')
    .required('Supply e-mail address'),
  password: string().required('Supply password'),
  confirmPassword: string()
    .required('Supply confirmation password')
    .when('password', (password, schema) => {
      if (password && signupSchema.fields.password.isValidSync(password))
        return schema.required('Supply confirmation password');
    })
    .equals([ref('password')], "Passwords doesn't match"),
});

export default signupSchema;
