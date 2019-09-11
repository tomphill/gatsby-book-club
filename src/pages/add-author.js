import React, {useState, useContext} from 'react';
import {Form, Input, Button} from '../components/common'
import {FirebaseContext} from '../components/Firebase'

const AddAuthor = () => {
  const {firebase} = useContext(FirebaseContext);
  const [authorName, setAuthorName] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e){
    e.preventDefault();
    firebase.createAuthor({
      authorName
    }).then(() => {
      setAuthorName('');
      setSuccess(true);
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input onChange={(e) => {
        e.persist();
        setSuccess(false);
        setAuthorName(e.target.value);
      }} value={authorName} placeholder="author name" />
      {!!success &&
      <span>
        Author created successfully!
      </span>
      }
      <Button type="submit" block>
        Add new author
      </Button>
    </Form>
  );
}

export default AddAuthor;