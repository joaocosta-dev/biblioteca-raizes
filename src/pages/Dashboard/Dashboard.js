import { useState } from "react"

import { Link } from "react-router-dom";

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import { useUpdateDocument as useUpdateRentalDocument } from "../../hooks/useUpdateDocument";
import { useUpdateDocument as useUpdateBooksDocument } from "../../hooks/useUpdateDocument";
import { useUpdateDocument as useUpdateUsersDocument } from "../../hooks/useUpdateDocument";


import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import BasicTable from "../../components/BasicTable";
import { arrayUnion } from "firebase/firestore";

import CardBook from '../../components/CardBook';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import searchBook from '../../assets/search-book.jpg';

const Dashboard = () => {
  const { user } = useAuthValue();

  // Busca o usuário autenticado na tabela de usuários
  const { document: userspecific } = useFetchDocument("users", user?.uid);

  /* Depois de carregar o usuário, a variavel recebe os livros lidos
  daquele usuário ou um array vazio */
  const readedBooks = userspecific?.readedBooks || []

  // Busca todos os livros
  const { documents: books } = useFetchDocuments("books");

  //Busca todas as solitações
  const { documents: rentals } = useFetchDocuments("rental");

  //livros solicitados pelo usuário da seção (coleção rental)
  var userSolicitedBooks = rentals.filter(rental => rental.userId === user.uid);
  //livros que o usuário solicitou (coleção book)
  var booksSolicited = books.filter(book => userSolicitedBooks.some(rental => rental.bookId === book.id));

  //filtro por status
  const booksWaitingAprov = booksSolicited.filter(book => book.status === "waitingAprov");
  const booksAproved = booksSolicited.filter(book => book.status === "reading");

  // Filtra de todos os livros para livros lidos
  const readedBooksfilter = books?.filter((book) => readedBooks.includes(book.id));

  // Estado para gerenciar as tabs do painel admin do dashboard
  const [value, setValue] = useState('1');

  //Funcao para fazer a alteração do estado, resultando na troca das tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { updateDocument: updateRentalDocument } = useUpdateRentalDocument("rental")
  const { updateDocument: updateBooksDocument } = useUpdateBooksDocument("books")
  const { updateDocument: updateUsersDocument } = useUpdateUsersDocument("users")


  //Função que cria um objeto para ser usada na criação das rows da tabela 
  const createData = (rentalId, rentalStatus, bookName, requester, deadline, bookId, requesterId) => {
    return { rentalId, rentalStatus, bookName, requester, deadline, bookId, requesterId };
  }
  let rows = []

  rentals?.map(rental => {
    rows.push(createData(rental.id, rental.rentalStatus, rental.bookTitle, rental.userName, rental.returnDate, rental.bookId, rental.userId))
  });


  const handleAprov = (rental) => {
    updateRentalDocument(rental.rentalId, { rentalStatus: "reading" })
    updateBooksDocument(rental.bookId, { status: "reading" })
  }

  const handleReceive = (rental) => {
    updateUsersDocument(rental.requesterId, { readedBooks: arrayUnion(rental.bookId) })
    updateBooksDocument(rental.bookId, { available: true, status: "available" })
    deleteDocument(rental.rentalId)
  }

  const handleCancel = (rental) => {
    deleteDocument(rental.rentalId)
  }
  const handleSaveDateEdited = (rental) => {
    // Use the value of newDate as the updated returnDate
    updateRentalDocument(rental?.rentalId, { returnDate: rental.deadline })
      .then(() => {
        // Opcional: Você pode adicionar um feedback aqui, como um alerta de sucesso
        console.log("Data atualizada com sucesso!");
      })
      .catch((error) => {
        // Caso haja erro ao tentar atualizar o documento
        console.error("Erro ao atualizar a data:", error);
      });

  };
  const { deleteDocument } = useDeleteDocument("rental");

  // Cancela a solicitação do livro
  const handleDelete = (id) => {
    var rentalDelete = userSolicitedBooks.map(rental => rental)

    for (let i = 0; i < rentalDelete.length; i++) {
      if (rentalDelete[i].bookId === id) {
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

          <div>
            {
              booksAproved && booksAproved.length === 0 ? (
                <div className="h-0">
                </div>
              ) : (
                <div className="my-5 ms-5">
                  <span className="text-3xl font-bold text-white text-center">Lendo</span>
                </div>
              )
            }
          </div>
          <Box sx={{ flexGrow: 1 }} className="mb-11">
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
                <div className="noposts">
                  <p className="text-white text-3xl font-medium mb-8">Não há livros aguardando Aprovação</p>
                  <div className="flex justify-center gap-14">
                    <img src={searchBook} alt="teste" className="w-full rounded-xl max-w-[500px] shadow-2xl" />
                    <div className="flex flex-col justify-center gap-4 max-w-[650px]">
                      <strong className="text-white text-xl border-s-8 border-black ps-3">
                        Explore nossa coleção e descubra um novo livro para mergulhar em uma leitura enriquecedora e envolvente! Aproveite o tempo para encontrar uma obra que irá inspirá-lo e abrir novas perspectivas.
                      </strong>
                      <Button variant="contained" sx={{ backgroundColor: "black" }} className="w-max">
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
          <Box sx={{ flexGrow: 1 }} className="mb-11">
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

          <div>
            {
              readedBooksfilter && readedBooksfilter.length === 0 ? (
                <div className="h-0">
                </div>
              ) : (
                <div className="my-5 ms-5">
                  <span className="text-3xl font-bold text-white text-center">Livros lidos</span>
                </div>
              )
            }
          </div>
          <Box sx={{ flexGrow: 1 }} className="mb-11">
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
      <div className="flex justify-center">
        <Box sx={{ m: 3, width: "100%", background: "linear-gradient(225deg, #04332d, #ffffff3b)", borderRadius: "15px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)" }}>
          <TabContext value={value} indicatorColor="primary">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="transparent" sx={{ display: "flex", gap: "20px" }}>
                <Tab label="Solicitações" value="1" sx={{
                  color: "white", borderRadius: "15px 15px 0 0",
                  '&.Mui-selected': {
                    borderBottom: "none", // Remove o border-bottom
                    outline: "none", // Remove contorno ao focar
                    backgroundColor: "black",
                    fontWeight: "bold",
                    color: "white"
                  },
                  '&:hover': { backgroundColor: '#000000b5' }
                }} />
                <Tab label="Relatórios" value="2" sx={{
                  color: "white", borderRadius: "15px 15px 0 0",
                  '&.Mui-selected': {
                    borderBottom: "none", // Remove o border-bottom
                    outline: "none", // Remove contorno ao focar
                    backgroundColor: "black",
                    fontWeight: "bold",
                    color: "white"
                  },
                  '&:hover': { backgroundColor: '#000000b5' }
                }} />

              </TabList>
            </Box>
            <TabPanel value="1">
              <BasicTable rows={rows}
                handleAprov={handleAprov}
                handleSaveDateEdited={handleSaveDateEdited}
                handleCancel={handleCancel}
                handleReceive={handleReceive} />

            </TabPanel>
            <TabPanel value="2">Em breve...</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    )
  )
};

export default Dashboard;
