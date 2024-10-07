import { object, string } from 'yup';

export const validatePostSchema = object({
  caption: string().required('Caption is required'),
  image: string().nullable(),
});
