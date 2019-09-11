import React, {useContext} from 'react';
import BookItem from '../components/BookItem';
import {BookComments} from '../components/common';
import {FirebaseContext} from '../components/Firebase';
import {graphql} from 'gatsby';

const BookTemplate = (props) => {
  const {firebase} = useContext(FirebaseContext)

  return (
    <section>
      <BookItem
        bookCover={props.data.book.localImage.childImageSharp.fixed}
        authorName={props.data.book.author.name}
        bookSummary={props.data.book.summary}
        bookTitle={props.data.book.title} />
      {!!firebase &&
      <BookComments firebase={firebase} bookId={props.data.book.id}/>
      }
    </section>
  )
};

export const query = graphql`
  query BookQuery($bookId: String!) {
    book(id: {eq: $bookId}){
      summary
      title
      localImage{
        childImageSharp{
          fixed(width: 200){
            ...GatsbyImageSharpFixed
          }
        }
      }
      id
      author {
        name
      }
    }
  }
`;

export default BookTemplate;