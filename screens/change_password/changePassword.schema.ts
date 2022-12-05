import {object, ref, string} from 'yup';

const ChangePasswordSchema = object({
  password: string().required('Supply new password'),
  confirmPassword: string()
    .required('Supply confirmation password')
    .when('password', (password, schema) => {
      if (
        password &&
        ChangePasswordSchema.fields.password.isValidSync(password)
      )
        return schema.required('Supply confirmation password');
    })
    .equals([ref('password')], "Passwords doesn't match"),
});

export default ChangePasswordSchema;
