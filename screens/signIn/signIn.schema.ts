import * as yup from 'yup';

const signinSchema = yup.object().shape({
  email: yup
    .string()
    .email('Supply valid e-mail address')
    .required('Supply valid e-mail address'),
  password: yup.string().required('Supply valid password'),
});

export default signinSchema;
