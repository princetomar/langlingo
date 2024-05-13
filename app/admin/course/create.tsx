import { SimpleForm, List, TextInput, required, Create } from "react-admin";

export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="Title" />
        <TextInput
          source="imageSrc"
          validate={[required()]}
          label="Course Image"
        />
      </SimpleForm>
    </Create>
  );
};
