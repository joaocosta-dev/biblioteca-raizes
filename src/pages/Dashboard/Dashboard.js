import styles from "./Dashboard.css";

import { Link } from "react-router-dom";

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

import CardBook from '../../components/CardBook';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import searchBook from '../../assets/search-book.jpg';

const Dashboard = ( {bookTitle, bookDescript, bookImage} ) => {
  const { user } = useAuthValue();

  // Busca os usuários
  const { document: userspecific } = useFetchDocument("users", user?.uid);
  // const readedBooks = userspecific.readedBooks;
  const readedBooks = userspecific?.readedBooks || [];

  // Busca todos os livros
  const { documents: books } = useFetchDocuments("books");
  const { documents: rentals } = useFetchDocuments("rental");

  //livros solicitados pelo usuário da seção (coleção rental)
  var userSolicitedBooks = rentals.filter(rental => rental.userId === user.uid);
  //livros que o usuário solicitou (coleção book)
  var booksSolicited = books.filter(book => userSolicitedBooks.some(rental => rental.bookId === book.id));

  //filtro por status
  const booksWaitingAprov = booksSolicited.filter(book => book.status === "waitingAprov");
  const booksAproved = booksSolicited.filter(book => book.status === "reading");

  // Filtra os livros lidos
  const readedBooksfilter = books?.filter((book) => readedBooks.includes(book.id));

  const { deleteDocument } = useDeleteDocument("rental");
  
  // Cancela a solicitação do livro
  const handleDelete = (id) => {
    var rentalDelete = userSolicitedBooks.map(rental => rental)

    for (let i = 0; i < rentalDelete.length; i++) {
      if(rentalDelete[i].bookId === id) {
        deleteDocument(rentalDelete[i].id)
      }
    }
  }


  //Limita a descrição do livro e adiciona os "..." no final.
  const truncatedDescription = books.map(books => books.description.length > 150
    ? `${books.description.substring(0, 150)}...`
    : books.description
  );

  const truncatedDescriptionWaiting = booksWaitingAprov.map(books => books.description.length > 150
    ? `${books.description.substring(0, 150)}...`
    : books.description
  );

  const truncatedDescriptionAprov = booksAproved.map(books => books.description.length > 150
    ? `${books.description.substring(0, 150)}...`
    : books.description
  );

  return (
    user && userspecific?.isAdmin !== true ? (
      <div className="container-dashboard container flex flex-col justify-center items-center py-14">
        <h2 className="text-white font-bold text-4xl mb-2">Área do leitor</h2>
        <p className="text-white font-medium text-xl mb-12">Acompanhe suas solicitações e leituras realizadas</p>
        
        <div className="flex flex-col w-full">

          <div className="my-5 ms-5">
            {
              booksAproved && booksAproved.length === 0 ? (
                <div className={styles.noposts}>
                  <p className="text-white">Não há livros em leitura</p>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white text-center">Lendo</span>
                </div>
              )
            }
          </div>
          <Box sx={{flexGrow: 1}} className="mb-11">
            <Grid container spacing={2} rowSpacing={4}>
              {
                booksAproved && booksAproved.map((book, index) => (
                  <Grid item xs={3} key={book.id} className="flex justify-center">
                    <CardBook
                      bookTitle={book.title}
                      bookDescript={truncatedDescriptionAprov[index]}
                      bookImage={book.image} 
                      bookLink={`/books/${book.id}`}
                    />
                  </Grid>
                ))
              }
            </Grid>
          </Box>
          
          <div className="my-5 ms-5">
            {
              booksWaitingAprov && booksWaitingAprov.length === 0 ? (
                <div className={styles.noposts}>
                  <p className="text-white text-3xl font-medium mb-8">Não há livros aguardando Aprovação</p>
                  <div className="flex justify-center gap-14">
                    <img src={searchBook} alt="teste" className="w-full rounded-xl max-w-[500px] shadow-2xl"/>
                    <div className="flex flex-col gap-4 max-w-[650px]">
                      <strong className="text-white text-xl border-s-8 border-black ps-3">
                        Explore nossa coleção e descubra um novo livro para mergulhar em uma leitura enriquecedora e envolvente! Aproveite o tempo para encontrar uma obra que irá inspirá-lo e abrir novas perspectivas.
                      </strong>
                      <Button variant="contained" sx={{backgroundColor: "black"}} className="w-max">
                        <Link to={"/"}>Procure um Livro</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white text-center">Aguardando Aprovação</span>
                </div>
              )
            }
          </div>
          <Box sx={{flexGrow: 1}} className="mb-11">
            <Grid container spacing={2} rowSpacing={4}>
              {
                booksWaitingAprov && booksWaitingAprov.map((book, index) => (
                  <Grid item xs={3} key={book.id} className="flex justify-center">
                    <CardBook
                      bookTitle={book.title}
                      bookDescript={truncatedDescriptionWaiting[index]}
                      bookImage={book.image} 
                      bookLink={`/books/${book.id}`}
                      showCancelButton={true}
                      onCancel={() => handleDelete(book.id)}
                    />
                  </Grid>                  
                ))
              }
            </Grid>
          </Box>

          <div className="my-5 ms-5">
            {
              readedBooksfilter && readedBooksfilter.length === 0 ? (
                <div className={styles.noposts}>
                  <p className="text-white">Não foram encontrados livros lidos</p>
                </div>
              ) : (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white text-center">Livros lidos</span>
                </div>
              )
            }
          </div>
          <Box sx={{flexGrow: 1}} className="mb-11">
            <Grid container spacing={2} rowSpacing={4}>
              {
                readedBooksfilter &&
                readedBooksfilter.map((book, index) => (
                  <Grid item xs={3} key={book.id} className="flex justify-center">
                    <CardBook
                      bookTitle={book.title}
                      bookDescript={truncatedDescription[index]}
                      bookImage={book.image} 
                      bookLink={`/books/${book.id}`}
                    />
                  </Grid>
                ))
              }          
            </Grid>
          </Box>
        </div>      
      </div>
    ) : (
      <p>rereorkoekroekro</p>
    )

  );
};

export default Dashboard;
